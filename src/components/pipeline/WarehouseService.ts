
import axios from 'axios';
import { WarehouseFormValues } from './types';
import { toast } from "@/hooks/use-toast";

// Function to create a new warehouse
export async function createWarehouse(
  workspaceUrl: string,
  token: string,
  warehouseConfig: WarehouseFormValues
): Promise<{ details: string; code: string; codeSummary: string }> {
  try {
    // Extract hostname from workspace URL (remove https:// and trailing slashes)
    let hostname = workspaceUrl;
    if (hostname.startsWith('https://')) {
      hostname = hostname.substring(8);
    }
    if (hostname.endsWith('/')) {
      hostname = hostname.slice(0, -1);
    }
    
    // Construct API endpoint URL
    const url = `https://${hostname}/api/2.0/sql/warehouses`;
    
    console.log("Making warehouse API request to:", url);
    
    // Format the request payload according to Databricks API requirements
    const payload = {
      name: warehouseConfig.name,
      cluster_size: warehouseConfig.cluster_size,
      min_num_clusters: 1,
      max_num_clusters: warehouseConfig.max_num_clusters,
      auto_stop_mins: warehouseConfig.auto_stop_mins,
      enable_serverless_compute: true,
      tags: {
        custom_tags: [
          { key: "CreatedBy", value: "deltalakestudio.com" }
        ]
      }
    };

    console.log("Warehouse creation payload:", JSON.stringify(payload));

    // Call the API using axios
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Warehouse API response status:", response.status);
    console.log("Warehouse API response data:", response.data);
    
    // Generate Python code that uses the warehouse
    const code = generateWarehouseCode(warehouseConfig, response.data.id);
    
    // Create a summary for display
    const codeSummary = `Warehouse "${warehouseConfig.name}" created successfully with ID: ${response.data.id}`;
    
    // Return the warehouse details, code, and summary
    return {
      details: `Warehouse ID: ${response.data.id}, Type: ${warehouseConfig.warehouse_type}, Size: ${warehouseConfig.cluster_size}`,
      code,
      codeSummary
    };
  } catch (error) {
    console.error('Error creating warehouse:', error);
    
    // Enhanced error handling for axios errors
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error Response:", error.response.status, error.response.data);
      const errorMessage = error.response.data.message || error.response.data.error || `Failed with status: ${error.response.status}`;
      toast({
        title: "Warehouse Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } else {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to Databricks API";
      toast({
        title: "Warehouse Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }
}

// Function to generate Python code for using the warehouse
function generateWarehouseCode(config: WarehouseFormValues, warehouseId: string): string {
  return `# Python code to connect to Databricks SQL Warehouse
from pyspark.sql import SparkSession

# Initialize SparkSession with warehouse connection
spark = SparkSession.builder \\
    .appName("${config.name}") \\
    .config("spark.databricks.warehouse.id", "${warehouseId}") \\
    .getOrCreate()

# Example query
df = spark.sql("SELECT * FROM your_table_name LIMIT 10")

# Display results
display(df)
`;
}

// Function to generate explanatory text for the warehouse
export function generateWarehouseExplanation(config: WarehouseFormValues): string {
  return `Warehouse Configuration:
- Name: ${config.name}
- Type: ${config.warehouse_type}
- Size: ${config.cluster_size}
- Max Clusters: ${config.max_num_clusters}
- Auto Stop: ${config.auto_stop_mins} minutes
- Photon Enabled: ${config.enable_photon ? "Yes" : "No"}
- Instance Policy: ${config.spot_instance_policy}`;
}

// Function to fetch existing warehouses
export async function listWarehouses(
  workspaceUrl: string, 
  token: string
): Promise<Array<{id: string, name: string, type: string}>> {
  try {
    // Extract hostname from workspace URL
    let hostname = workspaceUrl;
    if (hostname.startsWith('https://')) {
      hostname = hostname.substring(8);
    }
    if (hostname.endsWith('/')) {
      hostname = hostname.slice(0, -1);
    }
    
    const url = `https://${hostname}/api/2.0/sql/warehouses`;
    
    console.log("Fetching warehouses from:", url);
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Available warehouses:", response.data);
    
    return response.data.warehouses.map((warehouse: any) => ({
      id: warehouse.id,
      name: warehouse.name,
      type: warehouse.warehouse_type
    }));
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error Response:", error.response.status, error.response.data);
      const errorMessage = error.response.data.message || error.response.data.error || `Failed with status: ${error.response.status}`;
      toast({
        title: "Failed to Fetch Warehouses",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    } else {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to Databricks API";
      toast({
        title: "Failed to Fetch Warehouses",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }
}

// Function to connect to an existing warehouse
export async function connectToWarehouse(
  workspaceUrl: string,
  token: string,
  warehouseId: string,
  warehouseName: string,
  warehouseType: string
): Promise<{ details: string; code: string; codeSummary: string }> {
  try {
    // Generate Python code for connecting to the existing warehouse
    const code = `# Python code to connect to Databricks SQL Warehouse
from pyspark.sql import SparkSession

# Initialize SparkSession with warehouse connection
spark = SparkSession.builder \\
    .appName("${warehouseName}") \\
    .config("spark.databricks.warehouse.id", "${warehouseId}") \\
    .getOrCreate()

# Example query
df = spark.sql("SELECT * FROM your_table_name LIMIT 10")

# Display results
display(df)
`;
    
    const codeSummary = `Connected to warehouse "${warehouseName}" with ID: ${warehouseId}`;
    
    return {
      details: `Connected to Warehouse: ${warehouseName} (ID: ${warehouseId}, Type: ${warehouseType})`,
      code,
      codeSummary
    };
  } catch (error) {
    console.error('Error connecting to warehouse:', error);
    const errorMessage = error instanceof Error ? error.message : "Failed to connect to Databricks warehouse";
    toast({
      title: "Connection Failed",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
}
