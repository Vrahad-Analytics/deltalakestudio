
import { toast } from "@/hooks/use-toast";

export const createCluster = async (
  nodeId: string, 
  workspaceUrl: string, 
  token: string,
  updateNodeCallback: (nodeId: string, details: string) => void
): Promise<void> => {
  if (!workspaceUrl || !token) {
    toast({
      title: "Authentication required",
      description: "Missing workspace URL or token",
      variant: "destructive",
    });
    return;
  }

  try {
    const response = await fetch(`${workspaceUrl}/api/2.0/clusters/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cluster_name: `Pipeline-Cluster-${Date.now()}`,
        spark_version: "11.3.x-scala2.12",
        node_type_id: "Standard_DS3_v2",
        num_workers: 1,
        autotermination_minutes: 30,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      // Update the node with cluster info
      updateNodeCallback(nodeId, `Cluster ID: ${data.cluster_id}`);

      toast({
        title: "Cluster created",
        description: `Cluster ID: ${data.cluster_id}`,
      });
    } else {
      throw new Error(data.message || 'Failed to create cluster');
    }
  } catch (error) {
    console.error('Error creating cluster:', error);
    toast({
      title: "Cluster creation failed",
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: "destructive",
    });
  }
};
