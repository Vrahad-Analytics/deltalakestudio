import base64
import requests
import time

def deploy_to_databricks(node, workspace_url, token):
    """Deploy a notebook to Databricks workspace"""
    if not workspace_url or not token or not node.get('data', {}).get('fileFormat') or not node.get('data', {}).get('filePath'):
        return {"success": False, "message": "Missing required information for deployment"}
    
    try:
        # Generate notebook content based on the node data
        from services.spark_code_generator import generate_notebook_code
        
        notebook_content = generate_notebook_code({
            "fileFormat": node.get('data', {}).get('fileFormat'),
            "filePath": node.get('data', {}).get('filePath'),
            "hasHeader": node.get('data', {}).get('options', {}).get('hasHeader', False),
            "inferSchema": node.get('data', {}).get('options', {}).get('inferSchema', False),
            "multiLine": node.get('data', {}).get('options', {}).get('multiLine', False),
            "cloudProvider": node.get('data', {}).get('cloudProvider', 'local')
        })
        
        # Create a notebook name based on the source type
        notebook_name = f"Pipeline_{node.get('data', {}).get('fileFormat', '').upper()}_Source_{int(time.time())}"
        
        # Create the notebook in Databricks workspace
        response = requests.post(
            f"{workspace_url}/api/2.0/workspace/import",
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json',
            },
            json={
                'path': f'/Users/{notebook_name}',
                'format': 'SOURCE',
                'language': 'PYTHON',
                'content': base64.b64encode(notebook_content.encode()).decode(),
                'overwrite': True
            }
        )
        
        if response.status_code == 200:
            return {"success": True, "message": f"Notebook {notebook_name} created successfully"}
        else:
            return {"success": False, "message": f"Failed to create notebook: {response.text}"}
            
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}