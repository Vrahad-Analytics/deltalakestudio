
import { toast } from "@/hooks/use-toast";
import { generateNotebookCode } from "./SparkCodeGenerator";
import { Node } from "./types";

export const deployToDatabricks = async (
  node: Node, 
  workspaceUrl: string,
  token: string,
): Promise<void> => {
  if (!workspaceUrl || !token || !node.data.fileFormat || !node.data.filePath) {
    toast({
      title: "Deployment failed",
      description: "Missing required information for deployment",
      variant: "destructive",
    });
    return;
  }

  try {
    // Generate notebook content based on the node data
    const notebookContent = generateNotebookCode({
      fileFormat: node.data.fileFormat,
      filePath: node.data.filePath,
      hasHeader: node.data.options?.hasHeader as boolean || false,
      inferSchema: node.data.options?.inferSchema as boolean || false,
      multiLine: node.data.options?.multiLine as boolean || false,
      cloudProvider: node.data.cloudProvider || 'local' // Add the cloudProvider property
    });
    
    // Create a notebook name based on the source type
    const notebookName = `Pipeline_${node.data.fileFormat.toUpperCase()}_Source_${Date.now()}`;
    
    // Create the notebook in Databricks workspace
    const response = await fetch(`${workspaceUrl}/api/2.0/workspace/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: `/Users/${notebookName}`,
        format: 'SOURCE',
        language: 'PYTHON',
        content: Buffer.from(notebookContent).toString('base64'),
        overwrite: true
      }),
    });

    if (response.ok) {
      toast({
        title: "Notebook deployed successfully",
        description: `Created notebook: ${notebookName}`,
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to deploy notebook');
    }
  } catch (error) {
    console.error('Error deploying to Databricks:', error);
    toast({
      title: "Deployment failed",
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: "destructive",
    });
  }
};
