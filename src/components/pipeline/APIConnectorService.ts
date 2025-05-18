
import { ApiConnectorConfig } from './types';

/**
 * Generates PySpark code for API connection and data retrieval
 * @param config API connector configuration
 * @returns Generated code for API connectivity
 */
export const generateAPIConnectorCode = (config: ApiConnectorConfig): string => {
  if (!config.endpoint) {
    return `# API endpoint not specified`;
  }
  
  let code = `# API Connector - ${config.type.toUpperCase()} Endpoint\n`;
  
  // Add necessary imports
  code += `import requests\nimport json\n`;
  if (config.type === 'graphql') {
    code += `import pandas as pd\n`;
  }
  code += `from pyspark.sql.types import *\n`;
  code += `from pyspark.sql.functions import *\n\n`;
  
  // Authentication setup
  if (config.authentication && config.authentication !== 'none') {
    code += `# Set up authentication\n`;
    switch(config.authentication) {
      case 'basic':
        code += `auth = ("${config.authDetails?.username || 'username'}", "${config.authDetails?.password || 'password'}")\n\n`;
        break;
      case 'apiKey':
        const keyName = config.authDetails?.keyName || 'api_key';
        const keyValue = config.authDetails?.keyValue || 'your_api_key';
        const keyIn = config.authDetails?.keyIn || 'header';
        
        if (keyIn === 'header') {
          code += `headers = {"${keyName}": "${keyValue}"}\n\n`;
        } else {
          code += `params = {"${keyName}": "${keyValue}"}\n\n`;
        }
        break;
      case 'oauth':
        code += `# OAuth token setup - placeholder for actual implementation\n`;
        code += `token = "${config.authDetails?.token || 'your_oauth_token'}"\n`;
        code += `headers = {"Authorization": f"Bearer {token}"}\n\n`;
        break;
    }
  } else {
    code += `# No authentication\n`;
    code += `headers = {}\n\n`;
  }
  
  // API request setup and execution
  code += `# API request configuration\n`;
  code += `url = "${config.endpoint}"\n`;
  
  switch(config.type) {
    case 'rest':
      code += `method = "${config.method || 'GET'}"\n\n`;
      
      code += `# Execute the API request\n`;
      code += `try:\n`;
      code += `    if method == "GET":\n`;
      if (config.authentication === 'apiKey' && config.authDetails?.keyIn === 'query') {
        code += `        response = requests.get(url, headers=headers, params=params)\n`;
      } else {
        code += `        response = requests.get(url, headers=headers)\n`;
      }
      code += `    elif method == "POST":\n`;
      if (config.body) {
        code += `        payload = ${config.body}\n`;
        code += `        response = requests.post(url, headers=headers, json=payload)\n`;
      } else {
        code += `        response = requests.post(url, headers=headers)\n`;
      }
      code += `    # Add other HTTP methods as needed\n`;
      code += `    \n`;
      code += `    response.raise_for_status()  # Raise an exception for HTTP errors\n`;
      code += `    json_data = response.json()\n`;
      code += `    \n`;
      code += `    # Convert the JSON response to a Spark DataFrame\n`;
      code += `    # This assumes the JSON has a simple structure; complex structures may need custom parsing\n`;
      code += `    pandas_df = pd.json_normalize(json_data)\n`;
      code += `    api_df = spark.createDataFrame(pandas_df)\n`;
      code += `except Exception as e:\n`;
      code += `    print(f"API request failed: {str(e)}")\n`;
      code += `    # Create an empty dataframe with error information\n`;
      code += `    api_df = spark.createDataFrame([(str(e),)], ["error"])\n\n`;
      break;
    
    case 'graphql':
      code += `# GraphQL query\n`;
      if (config.body) {
        code += `query = """${config.body}"""\n`;
      } else {
        code += `query = """{\\n  # Your GraphQL query here\\n}"""\n`;
      }
      code += `payload = {"query": query}\n\n`;
      
      code += `# Execute the GraphQL request\n`;
      code += `try:\n`;
      code += `    response = requests.post(url, headers=headers, json=payload)\n`;
      code += `    response.raise_for_status()\n`;
      code += `    json_data = response.json()\n`;
      code += `    \n`;
      code += `    # Extract data from the GraphQL response\n`;
      code += `    if "data" in json_data:\n`;
      code += `        # Find the first data field in the response\n`;
      code += `        first_field = next(iter(json_data["data"]))\n`;
      code += `        data = json_data["data"][first_field]\n`;
      code += `        \n`;
      code += `        # Convert to DataFrame\n`;
      code += `        pandas_df = pd.json_normalize(data)\n`;
      code += `        api_df = spark.createDataFrame(pandas_df)\n`;
      code += `    else:\n`;
      code += `        error_msg = json_data.get("errors", "Unknown GraphQL error")\n`;
      code += `        api_df = spark.createDataFrame([(str(error_msg),)], ["error"])\n`;
      code += `except Exception as e:\n`;
      code += `    print(f"GraphQL request failed: {str(e)}")\n`;
      code += `    api_df = spark.createDataFrame([(str(e),)], ["error"])\n\n`;
      break;
    
    case 'soap':
      code += `# SOAP request\n`;
      code += `# Set Content-Type for SOAP\n`;
      code += `headers["Content-Type"] = "text/xml;charset=UTF-8"\n\n`;
      
      if (config.body) {
        code += `soap_envelope = """${config.body}"""\n`;
      } else {
        code += `soap_envelope = """<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">\n`;
        code += `  <soap:Header>\n`;
        code += `  </soap:Header>\n`;
        code += `  <soap:Body>\n`;
        code += `    <!-- Your SOAP request here -->\n`;
        code += `  </soap:Body>\n`;
        code += `</soap:Envelope>"""\n`;
      }
      
      code += `\n# Execute the SOAP request\n`;
      code += `try:\n`;
      code += `    response = requests.post(url, headers=headers, data=soap_envelope)\n`;
      code += `    response.raise_for_status()\n`;
      code += `    \n`;
      code += `    # SOAP responses are XML, need to parse\n`;
      code += `    from lxml import etree\n`;
      code += `    \n`;
      code += `    # Parse XML response\n`;
      code += `    root = etree.fromstring(response.content)\n`;
      code += `    \n`;
      code += `    # Example extraction (highly simplified, real XML parsing will be more complex)\n`;
      code += `    # This is a placeholder - actual implementation would depend on XML structure\n`;
      code += `    data = []\n`;
      code += `    # Extract data from XML nodes\n`;
      code += `    # data.append({...})\n`;
      code += `    \n`;
      code += `    # Convert extracted data to DataFrame\n`;
      code += `    if data:\n`;
      code += `        pandas_df = pd.DataFrame(data)\n`;
      code += `        api_df = spark.createDataFrame(pandas_df)\n`;
      code += `    else:\n`;
      code += `        # Create an empty dataframe with a message\n`;
      code += `        api_df = spark.createDataFrame([("No data extracted from SOAP response",)], ["message"])\n`;
      code += `except Exception as e:\n`;
      code += `    print(f"SOAP request failed: {str(e)}")\n`;
      code += `    api_df = spark.createDataFrame([(str(e),)], ["error"])\n\n`;
      break;
  }
  
  // Display the resulting dataframe
  code += `# Display the resulting dataframe\n`;
  code += `display(api_df)\n`;
  
  return code;
};

/**
 * Generates a simplified code summary for API connector
 * @param config API connector configuration
 * @returns Simplified code summary
 */
export const generateAPIConnectorSummary = (config: ApiConnectorConfig): string => {
  if (!config.endpoint) {
    return "# API Connector not configured";
  }
  
  const endpointPreview = config.endpoint.length > 30 
    ? config.endpoint.substring(0, 27) + '...' 
    : config.endpoint;
  
  return `# ${config.type.toUpperCase()} API Connector\n` + 
    `# Endpoint: ${endpointPreview}\n` +
    `# Auth: ${config.authentication || 'none'}`;
};
