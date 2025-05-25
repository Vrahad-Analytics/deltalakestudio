import base64
import requests
import time
import json
from typing import List, Dict, Any, Optional, Set, Tuple

def generate_spark_code(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]], pipeline_name: str = "MyPipeline") -> str:
    """Generate complete PySpark code for a pipeline
    
    Args:
        nodes: List of pipeline nodes
        edges: List of pipeline edges
        pipeline_name: Name of the pipeline
        
    Returns:
        Generated PySpark code as a string
    """
    # Start with imports and SparkSession initialization
    code = "# PySpark Pipeline Code\n"
    code += "from pyspark.sql import SparkSession\n"
    code += "from pyspark.sql.functions import *\n"
    code += "from pyspark.sql.types import *\n\n"
    
    code += "# Initialize Spark Session\n"
    code += f"spark = SparkSession.builder.appName(\"{pipeline_name}\").getOrCreate()\n\n"
    
    # Create a dictionary to store node IDs and their corresponding dataframe variables
    dataframe_vars = {}
    
    # Process nodes in topological order
    processed_nodes = set()
    node_order = get_topological_order(nodes, edges)
    
    for node_id in node_order:
        node = next((n for n in nodes if n.get('id') == node_id), None)
        if not node:
            continue
            
        node_type = node.get('type')
        node_data = node.get('data', {})
        node_label = node_data.get('label', f"Node_{node_id}")
        
        # Generate variable name for this node's dataframe
        var_name = f"df_{node_id.replace('-', '_')}"
        dataframe_vars[node_id] = var_name
        
        code += f"# {node_label}\n"
        
        if node_type == 'source':
            # Generate source data loading code
            source_code = generate_source_code(node_data, var_name)
            code += source_code + "\n\n"
            processed_nodes.add(node_id)
            
        elif node_type == 'transformation' and all(pred in processed_nodes for pred in get_predecessors(node_id, edges)):
            # Get the input dataframe from the predecessor
            predecessors = get_predecessors(node_id, edges)
            if not predecessors:
                continue
                
            input_df = dataframe_vars.get(predecessors[0])
            if not input_df:
                continue
                
            # Generate transformation code
            transformation_code = generate_transformation_code(
                node_data.get('transformation', {}),
                input_df,
                var_name
            )
            code += transformation_code + "\n\n"
            processed_nodes.add(node_id)
            
        elif node_type == 'destination' and all(pred in processed_nodes for pred in get_predecessors(node_id, edges)):
            # Get the input dataframe from the predecessor
            predecessors = get_predecessors(node_id, edges)
            if not predecessors:
                continue
                
            input_df = dataframe_vars.get(predecessors[0])
            if not input_df:
                continue
                
            # Generate destination code
            destination_code = generate_destination_code(
                node_data,
                input_df
            )
            code += destination_code + "\n\n"
            processed_nodes.add(node_id)
            
        elif node_type == 'data-validation' and all(pred in processed_nodes for pred in get_predecessors(node_id, edges)):
            # Get the input dataframe from the predecessor
            predecessors = get_predecessors(node_id, edges)
            if not predecessors:
                continue
                
            input_df = dataframe_vars.get(predecessors[0])
            if not input_df:
                continue
                
            # Generate validation code
            validation_code = generate_validation_code_internal(
                node_data.get('validationRules', []),
                input_df,
                var_name
            )
            code += validation_code + "\n\n"
            processed_nodes.add(node_id)
            
        elif node_type == 'ml-training' and all(pred in processed_nodes for pred in get_predecessors(node_id, edges)):
            # Get the input dataframe from the predecessor
            predecessors = get_predecessors(node_id, edges)
            if not predecessors:
                continue
                
            input_df = dataframe_vars.get(predecessors[0])
            if not input_df:
                continue
                
            # Generate ML code
            ml_code = generate_ml_training_code(
                node_data.get('mlConfig', {}),
                input_df,
                var_name
            )
            code += ml_code + "\n\n"
            processed_nodes.add(node_id)
    
    # Add final code to display the last dataframe
    if dataframe_vars and node_order:
        last_df = dataframe_vars.get(node_order[-1])
        if last_df:
            code += f"# Display the final dataframe\n"
            code += f"print(\"Pipeline execution completed. Showing sample of final dataframe:\")\n"
            code += f"{last_df}.show(10, truncate=False)\n"
    
    return code

def generate_source_code(node_data: Dict[str, Any], var_name: str) -> str:
    """Generate PySpark code for a source node"""
    code = f"{var_name} = spark.read"
    
    file_format = node_data.get('fileFormat')
    if file_format == 'csv':
        code += '\n    .format("csv")'
        if node_data.get('options', {}).get('hasHeader'):
            code += '\n    .option("header", "true")'
        if node_data.get('options', {}).get('inferSchema'):
            code += '\n    .option("inferSchema", "true")'
    elif file_format == 'json':
        code += '\n    .format("json")'
        if node_data.get('options', {}).get('multiLine'):
            code += '\n    .option("multiLine", "true")'
    elif file_format == 'parquet':
        code += '\n    .format("parquet")'
    elif file_format == 'orc':
        code += '\n    .format("orc")'
    
    code += f'\n    .load("{node_data.get("filePath")}")'
    return code



def get_topological_order(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> List[str]:
    """Get nodes in topological order (sources first, destinations last)
    
    Args:
        nodes: List of pipeline nodes
        edges: List of pipeline edges
        
    Returns:
        List of node IDs in topological order
    """
    # Create a graph representation
    graph = {}
    in_degree = {}
    
    # Initialize graph
    for node in nodes:
        node_id = node.get('id')
        graph[node_id] = []
        in_degree[node_id] = 0
    
    # Add edges to graph
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in graph and target in graph:
            graph[source].append(target)
            in_degree[target] += 1
    
    # Find nodes with no incoming edges (sources)
    queue = []
    for node_id, degree in in_degree.items():
        if degree == 0:
            queue.append(node_id)
    
    # Perform topological sort
    result = []
    while queue:
        node_id = queue.pop(0)
        result.append(node_id)
        
        for neighbor in graph[node_id]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If not all nodes are included, there's a cycle
    # In that case, just return the nodes in their original order
    if len(result) != len(nodes):
        return [node.get('id') for node in nodes]
    
    return result

def get_predecessors(node_id: str, edges: List[Dict[str, Any]]) -> List[str]:
    """Get predecessor nodes for a given node
    
    Args:
        node_id: ID of the node
        edges: List of pipeline edges
        
    Returns:
        List of predecessor node IDs
    """
    return [edge.get('source') for edge in edges if edge.get('target') == node_id]

def get_successors(node_id: str, edges: List[Dict[str, Any]]) -> List[str]:
    """Get successor nodes for a given node
    
    Args:
        node_id: ID of the node
        edges: List of pipeline edges
        
    Returns:
        List of successor node IDs
    """
    return [edge.get('target') for edge in edges if edge.get('source') == node_id]

def generate_transformation_code(transformation: Dict[str, Any], input_df: str, output_df: str) -> str:
    """Generate PySpark code for a transformation node
    
    Args:
        transformation: Transformation configuration
        input_df: Input dataframe variable name
        output_df: Output dataframe variable name
        
    Returns:
        Generated PySpark code as a string
    """
    transformation_type = transformation.get('id')
    options = transformation.get('options', {})
    
    code = ""
    
    if transformation_type == "filter":
        condition = options.get('condition', 'col("id") > 0')
        code = f"{output_df} = {input_df}.filter({condition})"
    
    elif transformation_type == "select":
        columns = options.get('columns', [])
        columns_str = ", ".join([f'"' + col + '"' for col in columns])
        code = f"{output_df} = {input_df}.select({columns_str})"
    
    elif transformation_type == "join":
        right_dataframe = options.get('rightDataframe', 'right_df')
        join_type = options.get('joinType', 'inner')
        join_condition = options.get('joinCondition', f'{input_df}.id == {right_dataframe}.id')
        code = f"{output_df} = {input_df}.join({right_dataframe}, {join_condition}, \"{join_type}\")"
    
    elif transformation_type == "aggregate":
        group_by_cols = options.get('groupByCols', [])
        agg_expressions = options.get('aggExpressions', [])
        
        group_by_str = ", ".join([f'"' + col + '"' for col in group_by_cols])
        agg_str = ", ".join(agg_expressions)
        
        code = f"{output_df} = {input_df}.groupBy({group_by_str}).agg({agg_str})"
    
    elif transformation_type == "sort":
        sort_cols = options.get('sortCols', [])
        ascending = options.get('ascending', True)
        
        sort_cols_str = ", ".join([f'"' + col + '"' for col in sort_cols])
        code = f"{output_df} = {input_df}.orderBy({sort_cols_str}, ascending={str(ascending).lower()})"
        
    else:
        # Default case - just copy the dataframe
        code = f"{output_df} = {input_df}"
        
    return code

def generate_destination_code(node_data: Dict[str, Any], input_df: str) -> str:
    """Generate PySpark code for a destination node
    
    Args:
        node_data: Node data configuration
        input_df: Input dataframe variable name
        
    Returns:
        Generated PySpark code as a string
    """
    file_format = node_data.get('fileFormat', 'parquet')
    file_path = node_data.get('filePath', '/tmp/output')
    options = node_data.get('options', {})
    
    code = f"# Write the dataframe to {file_format} format\n"
    code += f"{input_df}.write"
    
    # Add format
    code += f"\n    .format(\"{file_format}\")"
    
    # Add mode
    save_mode = options.get('saveMode', 'overwrite')
    code += f"\n    .mode(\"{save_mode}\")"
    
    # Add options for specific formats
    if file_format == 'csv' and options.get('header', True):
        code += "\n    .option(\"header\", \"true\")"
    
    if file_format == 'parquet' and options.get('compression'):
        code += f"\n    .option(\"compression\", \"{options.get('compression')}\")"
    
    # Add partition columns if specified
    partition_cols = options.get('partitionBy', [])
    if partition_cols:
        partition_cols_str = ", ".join([f'"' + col + '"' for col in partition_cols])
        code += f"\n    .partitionBy({partition_cols_str})"
    
    # Add save path
    code += f"\n    .save(\"{file_path}\")"
    
    return code

def generate_validation_code_internal(validation_rules: List[Dict[str, Any]], input_df: str, output_df: str) -> str:
    """Generate PySpark code for data validation
    
    Args:
        validation_rules: List of validation rules
        input_df: Input dataframe variable name
        output_df: Output dataframe variable name
        
    Returns:
        Generated PySpark code as a string
    """
    if not validation_rules:
        return f"{output_df} = {input_df}"
    
    code = "# Data Validation\n"
    code += f"{output_df} = {input_df}\n\n"
    code += "# Create a validation report dataframe\n"
    code += "validation_report = []\n\n"
    
    for i, rule in enumerate(validation_rules):
        rule_type = rule.get('type')
        column = rule.get('column')
        condition = rule.get('condition')
        error_message = rule.get('errorMessage', f"Validation failed for rule {i+1}")
        
        if rule_type == 'null':
            code += f"# Check for null values in {column}\n"
            code += f"null_count = {output_df}.filter({output_df}[\"{column}\"].isNull()).count()\n"
            code += f"if null_count > 0:\n"
            code += f"    validation_report.append((\"Null check\", \"{column}\", f\"{null_count} null values found\", \"{error_message}\"))\n\n"
        
        elif rule_type == 'dataType':
            code += f"# Check data type for {column}\n"
            code += f"try:\n"
            code += f"    # This will fail if the data type is incorrect\n"
            code += f"    {output_df}.select(col(\"{column}\").cast(\"{condition}\"))\n"
            code += f"except Exception as e:\n"
            code += f"    validation_report.append((\"Data type check\", \"{column}\", f\"Failed to cast to {condition}\", \"{error_message}\"))\n\n"
        
        elif rule_type == 'range':
            min_val = rule.get('value', {}).get('min')
            max_val = rule.get('value', {}).get('max')
            
            if min_val is not None and max_val is not None:
                code += f"# Check range for {column}\n"
                code += f"out_of_range = {output_df}.filter(({output_df}[\"{column}\"] < {min_val}) | ({output_df}[\"{column}\"] > {max_val})).count()\n"
                code += f"if out_of_range > 0:\n"
                code += f"    validation_report.append((\"Range check\", \"{column}\", f\"{out_of_range} values outside range [{min_val}, {max_val}]\", \"{error_message}\"))\n\n"
        
        elif rule_type == 'regex':
            code += f"# Check regex pattern for {column}\n"
            code += f"non_matching = {output_df}.filter(~{output_df}[\"{column}\"].rlike(\"{condition}\")).count()\n"
            code += f"if non_matching > 0:\n"
            code += f"    validation_report.append((\"Regex check\", \"{column}\", f\"{non_matching} values don't match pattern\", \"{error_message}\"))\n\n"
        
        elif rule_type == 'custom' and condition:
            code += f"# Custom validation for {column}\n"
            code += f"invalid_count = {output_df}.filter(~({condition})).count()\n"
            code += f"if invalid_count > 0:\n"
            code += f"    validation_report.append((\"Custom check\", \"{column}\", f\"{invalid_count} invalid values\", \"{error_message}\"))\n\n"
    
    code += "# Create a validation summary dataframe\n"
    code += "if validation_report:\n"
    code += "    validation_df = spark.createDataFrame(validation_report, [\"check_type\", \"column\", \"result\", \"message\"])\n"
    code += "    print(\"Validation issues found:\")\n"
    code += "    validation_df.show(truncate=False)\n"
    code += "else:\n"
    code += "    print(\"All validation checks passed.\")\n"
    
    return code

def generate_ml_training_code(ml_config: Dict[str, Any], input_df: str, output_df: str) -> str:
    """Generate PySpark code for ML training
    
    Args:
        ml_config: ML configuration
        input_df: Input dataframe variable name
        output_df: Output dataframe variable name
        
    Returns:
        Generated PySpark code as a string
    """
    model_type = ml_config.get('modelType', 'regression')
    target_column = ml_config.get('targetColumn', 'target')
    feature_columns = ml_config.get('featureColumns', [])
    
    code = "# ML Training Pipeline\n"
    code += "from pyspark.ml import Pipeline\n"
    code += "from pyspark.ml.feature import VectorAssembler\n"
    
    # Import appropriate ML libraries based on model type
    if model_type == 'regression':
        code += "from pyspark.ml.regression import LinearRegression\n"
    elif model_type == 'classification':
        code += "from pyspark.ml.classification import LogisticRegression\n"
    elif model_type == 'clustering':
        code += "from pyspark.ml.clustering import KMeans\n"
    
    code += "\n# Prepare features\n"
    feature_cols_str = ", ".join([f'"' + col + '"' for col in feature_columns])
    code += f"feature_columns = [{feature_cols_str}]\n"
    code += "assembler = VectorAssembler(inputCols=feature_columns, outputCol=\"features\")\n\n"
    
    # Create the appropriate model based on type
    if model_type == 'regression':
        code += "# Create a regression model\n"
        code += f"lr = LinearRegression(featuresCol=\"features\", labelCol=\"{target_column}\")\n"
        code += "pipeline = Pipeline(stages=[assembler, lr])\n"
    elif model_type == 'classification':
        code += "# Create a classification model\n"
        code += f"lr = LogisticRegression(featuresCol=\"features\", labelCol=\"{target_column}\")\n"
        code += "pipeline = Pipeline(stages=[assembler, lr])\n"
    elif model_type == 'clustering':
        code += "# Create a clustering model\n"
        code += "kmeans = KMeans(featuresCol=\"features\", k=3)\n"
        code += "pipeline = Pipeline(stages=[assembler, kmeans])\n"
    
    code += "\n# Split the data\n"
    code += f"train_data, test_data = {input_df}.randomSplit([0.8, 0.2], seed=42)\n\n"
    
    code += "# Train the model\n"
    code += "model = pipeline.fit(train_data)\n\n"
    
    code += "# Make predictions\n"
    code += f"{output_df} = model.transform(test_data)\n\n"
    
    # Evaluate the model based on type
    if model_type == 'regression':
        code += "# Evaluate the model\n"
        code += "from pyspark.ml.evaluation import RegressionEvaluator\n"
        code += f"evaluator = RegressionEvaluator(labelCol=\"{target_column}\", predictionCol=\"prediction\")\n"
        code += f"rmse = evaluator.evaluate({output_df}, {{evaluator.metricName: \"rmse\"}})\n"
        code += "print(f\"Root Mean Squared Error (RMSE): {rmse}\")\n"
    elif model_type == 'classification':
        code += "# Evaluate the model\n"
        code += "from pyspark.ml.evaluation import MulticlassClassificationEvaluator\n"
        code += f"evaluator = MulticlassClassificationEvaluator(labelCol=\"{target_column}\", predictionCol=\"prediction\")\n"
        code += f"accuracy = evaluator.evaluate({output_df})\n"
        code += "print(f\"Accuracy: {accuracy}\")\n"
    
    return code

def get_cloud_provider_short_name(provider):
    """Get short name for cloud provider"""
    providers = {
        's3': 'S3',
        'adls': 'ADLS',
        'gcs': 'GCS',
        'azure-blob': 'Azure Blob',
        'aws': 'AWS',
        'azure': 'Azure',
        'gcp': 'GCP'
    }
    return providers.get(provider, '')

def generate_notebook_code(values):
    """Generate Databricks notebook content"""
    notebook_content = f"# Databricks Notebook Generated by Pipeline Designer\n\n"
    notebook_content += f"# Data Source Configuration\n"
    notebook_content += f"# Format: {values.get('fileFormat', '').upper()}\n"
    notebook_content += f"# Path: {values.get('filePath', '')}\n"
    
    if values.get('cloudProvider') != 'local':
        notebook_content += f"# Cloud Provider: {values.get('cloudProvider', '')}\n"
        
        if values.get('cloudProvider') == 'azure-blob':
            notebook_content += "\n# For Azure Blob Storage, you might need to mount first:\n"
            notebook_content += "# dbutils.fs.mount(\n"
            notebook_content += "#   source = \"wasbs://<container>@<storage-account>.blob.core.windows.net\",\n"
            notebook_content += "#   mount_point = \"/mnt/<mount-name>\"\n"
            notebook_content += "# )\n"
    
    notebook_content += "\n# PySpark Code\n"
    notebook_content += generate_spark_code(values)
    
    notebook_content += "\n\n# Display the dataframe\ndisplay(df)"
    
    return notebook_content