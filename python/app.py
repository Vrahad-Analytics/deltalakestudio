from flask import Flask, render_template, jsonify, request, send_from_directory, session, redirect, url_for
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect
import os
import time
import json
import uuid
from datetime import datetime
from services.notebook_service import deploy_to_databricks
from services.s3_mount_service import deploy_mount_notebook, generate_mount_code
from services.spark_code_generator import generate_notebook_code, generate_spark_code
from services.data_validation_service import validate_data, generate_validation_code
from services.ml_service import generate_ml_code, deploy_ml_model

# Initialize Flask app
app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Configure app
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'deltalakestudio-secret-key')
app.config['TEMP_FOLDER'] = os.path.join(app.static_folder, 'temp')

# Enable CORS
CORS(app)

# Disable CSRF protection for development
# csrf = CSRFProtect(app)

# Ensure temp directory exists
os.makedirs(app.config['TEMP_FOLDER'], exist_ok=True)

# Authentication and session management
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get form data
        url = request.form.get('url')
        token = request.form.get('token')
        
        # For debugging
        print(f"Login attempt with URL: {url} and token length: {len(token) if token else 0}")
        
        if not url or not token:
            return render_template('index.html', error="URL and token are required")
        
        # Store in session
        session['databricks_url'] = url
        session['databricks_token'] = token
        session['logged_in'] = True
        
        # Redirect to dashboard
        return redirect(url_for('dashboard'))
    
    # If GET request or any other method
    return redirect(url_for('index'))

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    # For API-based login (AJAX)
    if request.is_json:
        data = request.json
    else:
        data = request.form
    
    url = data.get('url')
    token = data.get('token')
    
    if not url or not token:
        return jsonify({
            "success": False,
            "message": "URL and token are required"
        }), 400
    
    # Store in session
    session['databricks_url'] = url
    session['databricks_token'] = token
    session['logged_in'] = True
    
    return jsonify({
        "success": True,
        "message": "Logged in successfully"
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    })

@app.route('/api/auth/status', methods=['GET'])
def auth_status():
    if session.get('logged_in'):
        return jsonify({
            "loggedIn": True,
            "workspaceUrl": session.get('databricks_url')
        })
    return jsonify({"loggedIn": False})

# Dashboard and pipeline management
@app.route('/dashboard')
def dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    return render_template('dashboard.html')

@app.route('/pipeline-designer')
@app.route('/pipeline-designer/<pipeline_id>')
def pipeline_designer(pipeline_id=None):
    if not session.get('logged_in'):
        return redirect(url_for('index'))
    return render_template('pipeline_designer.html', pipeline_id=pipeline_id)

@app.route('/api/dashboard/stats', methods=['GET'])
def dashboard_stats():
    # In a real application, this would fetch actual stats from Databricks
    return jsonify({
        "clusters": {
            "total": 5,
            "running": 2,
            "terminated": 3
        },
        "jobs": {
            "total": 12,
            "running": 1,
            "completed": 10,
            "failed": 1
        },
        "storage": {
            "total": "1.2 TB",
            "used": "0.8 TB"
        }
    })

@app.route('/api/pipelines', methods=['GET'])
def get_pipelines():
    # This would fetch actual pipelines from a database in a real application
    # For now, return mock data
    return jsonify({
        "pipelines": [
            {
                "id": "pipeline-1",
                "name": "Customer Data ETL",
                "lastRun": "2025-05-19T10:30:00",
                "status": "completed",
                "nodes": 8,
                "edges": 7
            },
            {
                "id": "pipeline-2",
                "name": "Sales Analytics",
                "lastRun": "2025-05-20T09:15:00",
                "status": "running",
                "nodes": 5,
                "edges": 4
            }
        ]
    })

@app.route('/api/pipelines/<pipeline_id>', methods=['GET'])
def get_pipeline(pipeline_id):
    # This would fetch a specific pipeline in a real application
    # For now, return mock data
    return jsonify({
        "id": pipeline_id,
        "name": "Customer Data ETL" if pipeline_id == "pipeline-1" else "Sales Analytics",
        "nodes": [],
        "edges": []
    })

# Pipeline designer endpoints
@app.route('/api/pipeline/save', methods=['POST'])
def save_pipeline():
    data = request.json
    pipeline_id = data.get('id') or str(uuid.uuid4())
    pipeline_name = data.get('name', 'Untitled Pipeline')
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    
    # In a real application, this would save to a database
    # For now, save to a JSON file in the temp directory
    pipeline_data = {
        "id": pipeline_id,
        "name": pipeline_name,
        "nodes": nodes,
        "edges": edges,
        "lastModified": datetime.now().isoformat(),
        "createdBy": session.get('user_id', 'anonymous')
    }
    
    file_path = os.path.join(app.config['TEMP_FOLDER'], f"{pipeline_id}.json")
    with open(file_path, 'w') as f:
        json.dump(pipeline_data, f)
    
    return jsonify({
        "success": True,
        "message": "Pipeline saved successfully",
        "pipeline": {
            "id": pipeline_id,
            "name": pipeline_name
        }
    })

@app.route('/api/pipeline/generate-code', methods=['POST'])
def generate_pipeline_code():
    data = request.json
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    pipeline_name = data.get('pipelineName', 'MyPipeline')
    
    # Generate code using the spark_code_generator service
    code = generate_spark_code(nodes, edges, pipeline_name)
    
    return jsonify({"code": code})

@app.route('/api/pipeline/validate', methods=['POST'])
def validate_pipeline():
    data = request.json
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    
    # Validate the pipeline structure
    issues = []
    
    # Check for disconnected nodes
    connected_nodes = set()
    for edge in edges:
        connected_nodes.add(edge.get('source'))
        connected_nodes.add(edge.get('target'))
    
    for node in nodes:
        if node.get('id') not in connected_nodes and node.get('type') != 'source':
            issues.append({
                "nodeId": node.get('id'),
                "severity": "warning",
                "message": f"Node '{node.get('data', {}).get('label')}' is disconnected from the pipeline."
            })
    
    # Check for missing configurations
    for node in nodes:
        node_type = node.get('type')
        node_data = node.get('data', {})
        
        if node_type == 'source' and not node_data.get('filePath'):
            issues.append({
                "nodeId": node.get('id'),
                "severity": "error",
                "message": "Source node is missing file path configuration."
            })
        
        if node_type == 'transformation' and not node_data.get('transformation'):
            issues.append({
                "nodeId": node.get('id'),
                "severity": "error",
                "message": "Transformation node is missing transformation configuration."
            })
    
    return jsonify({
        "valid": len(issues) == 0,
        "issues": issues
    })

@app.route('/api/databricks/deploy-notebook', methods=['POST'])
def deploy_notebook():
    data = request.json
    node = data.get('node')
    workspace_url = data.get('workspaceUrl')
    token = data.get('token')
    
    result = deploy_to_databricks(node, workspace_url, token)
    return jsonify(result)

@app.route('/api/s3/deploy-mount', methods=['POST'])
def deploy_s3_mount():
    data = request.json
    values = data.get('values')
    workspace_url = data.get('workspaceUrl')
    token = data.get('token')
    
    result = deploy_mount_notebook(values, workspace_url, token)
    return jsonify(result)

@app.route('/api/download-code', methods=['POST'])
def download_code():
    data = request.json
    code = data.get('code')
    filename = data.get('filename', 'pipeline_code.py')
    
    # Save the code to a temporary file
    temp_dir = os.path.join(app.static_folder, 'temp')
    os.makedirs(temp_dir, exist_ok=True)
    
    file_path = os.path.join(temp_dir, filename)
    with open(file_path, 'w') as f:
        f.write(code)
    
    return jsonify({"success": True, "downloadUrl": f"/static/temp/{filename}"})

@app.route('/api/data-validation/validate', methods=['POST'])
def validate_data_endpoint():
    data = request.json
    node = data.get('node')
    workspace_url = data.get('workspaceUrl') or session.get('databricks_url')
    token = data.get('token') or session.get('databricks_token')
    
    result = validate_data(node, workspace_url, token)
    return jsonify(result)

@app.route('/api/data-validation/generate-code', methods=['POST'])
def generate_validation_code_endpoint():
    data = request.json
    validation_rules = data.get('validationRules', [])
    dataframe_name = data.get('dataframeName', 'df')
    
    code = generate_validation_code(validation_rules, dataframe_name)
    return jsonify({"code": code})

@app.route('/api/ml/generate-code', methods=['POST'])
def generate_ml_code_endpoint():
    data = request.json
    ml_config = data.get('mlConfig', {})
    dataframe_name = data.get('dataframeName', 'df')
    
    code = generate_ml_code(ml_config, dataframe_name)
    return jsonify({"code": code})

@app.route('/api/ml/deploy-model', methods=['POST'])
def deploy_ml_model_endpoint():
    data = request.json
    node = data.get('node')
    workspace_url = data.get('workspaceUrl') or session.get('databricks_url')
    token = data.get('token') or session.get('databricks_token')
    
    result = deploy_ml_model(node, workspace_url, token)
    return jsonify(result)

@app.route('/api/warehouse/create', methods=['POST'])
def create_warehouse():
    data = request.json
    warehouse_config = data.get('warehouseConfig', {})
    workspace_url = data.get('workspaceUrl') or session.get('databricks_url')
    token = data.get('token') or session.get('databricks_token')
    
    # In a real application, this would create a warehouse in Databricks
    # For now, return mock data
    warehouse_id = str(uuid.uuid4())
    
    return jsonify({
        "success": True,
        "warehouseId": warehouse_id,
        "details": f"Warehouse {warehouse_config.get('name')} created successfully",
        "code": f"# Code to connect to warehouse {warehouse_config.get('name')}\n"
               f"spark.sql(\"USE WAREHOUSE {warehouse_config.get('name')}\")"
    })

@app.route('/api/transformations', methods=['GET'])
def get_transformations():
    # Return a list of available transformations
    return jsonify({
        "transformations": [
            {
                "id": "filter",
                "name": "Filter",
                "description": "Filter rows based on a condition",
                "category": "basic"
            },
            {
                "id": "select",
                "name": "Select Columns",
                "description": "Select specific columns from the dataframe",
                "category": "basic"
            },
            {
                "id": "join",
                "name": "Join",
                "description": "Join with another dataframe",
                "category": "advanced"
            },
            {
                "id": "aggregate",
                "name": "Aggregate",
                "description": "Group by and aggregate data",
                "category": "advanced"
            },
            {
                "id": "sort",
                "name": "Sort",
                "description": "Sort data by specified columns",
                "category": "basic"
            }
        ]
    })

@app.route('/api/transformations/<transformation_id>/generate-code', methods=['POST'])
def generate_transformation_code(transformation_id):
    data = request.json
    input_dataframe = data.get('inputDataframe', 'df')
    output_dataframe = data.get('outputDataframe', 'result_df')
    options = data.get('options', {})
    
    code = ""
    
    if transformation_id == "filter":
        condition = options.get('condition', 'col("id") > 0')
        code = f"{output_dataframe} = {input_dataframe}.filter({condition})"
    
    elif transformation_id == "select":
        columns = options.get('columns', [])
        columns_str = ", ".join([f'"' + col + '"' for col in columns])
        code = f"{output_dataframe} = {input_dataframe}.select({columns_str})"
    
    elif transformation_id == "join":
        right_dataframe = options.get('rightDataframe', 'right_df')
        join_type = options.get('joinType', 'inner')
        join_condition = options.get('joinCondition', 'df.id == right_df.id')
        code = f"{output_dataframe} = {input_dataframe}.join({right_dataframe}, {join_condition}, \"{join_type}\")"
    
    elif transformation_id == "aggregate":
        group_by_cols = options.get('groupByCols', [])
        agg_expressions = options.get('aggExpressions', [])
        
        group_by_str = ", ".join([f'"' + col + '"' for col in group_by_cols])
        agg_str = ", ".join(agg_expressions)
        
        code = f"{output_dataframe} = {input_dataframe}.groupBy({group_by_str}).agg({agg_str})"
    
    elif transformation_id == "sort":
        sort_cols = options.get('sortCols', [])
        ascending = options.get('ascending', True)
        
        sort_cols_str = ", ".join([f'"' + col + '"' for col in sort_cols])
        code = f"{output_dataframe} = {input_dataframe}.orderBy({sort_cols_str}, ascending={str(ascending).lower()})"
    
    return jsonify({"code": code})

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return render_template('index.html')

@app.errorhandler(500)
def server_error(e):
    return jsonify({
        "success": False,
        "message": "Internal server error",
        "error": str(e)
    }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)