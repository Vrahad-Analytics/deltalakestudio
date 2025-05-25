import base64
import requests
import time

def generate_mount_code(values):
    """Generate code for mounting S3 bucket in Databricks"""
    # Use bucket name as mount name if mount_name is empty
    effective_mount_name = values.get('mount_name') or values.get('aws_bucket_name')
    
    code = f"""access_key = "{values.get('access_key')}"
secret_key = "{values.get('secret_key')}"
encoded_secret_key = secret_key.replace("/", "%2F")
aws_bucket_name = "{values.get('aws_bucket_name')}"
mount_name = "{effective_mount_name}"

dbutils.fs.mount("s3a://%s:%s@%s" % (access_key, encoded_secret_key, aws_bucket_name), "/mnt/%s" % mount_name)"""

    # Add display command based on user preference
    if values.get('show_display_command'):
        code += "\n\n# Display mounted files\ndisplay(dbutils.fs.ls('/mnt/' + mount_name))"
        
    return code

def deploy_mount_notebook(values, workspace_url, token):
    """Deploy an S3 mount notebook to Databricks"""
    try:
        # Generate notebook content for S3 mounting
        notebook_content = generate_mount_code(values)
        
        # Create a notebook name for the S3 mount
        notebook_name = f"S3_Mount_{values.get('aws_bucket_name')}_{int(time.time())}"
        
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
            return {"success": True, "message": f"Mount notebook {notebook_name} created successfully"}
        else:
            return {"success": False, "message": f"Failed to create mount notebook: {response.text}"}
            
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}