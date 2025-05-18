
import { toast } from "@/hooks/use-toast";
import { S3MountFormValues } from "./types";

export const generateMountCode = (values: S3MountFormValues): string => {
  return `# Mount S3 bucket
access_key = "${values.access_key}"
secret_key = "${values.secret_key}"
encoded_secret_key = secret_key.replace("/", "%2F")
aws_bucket_name = "${values.aws_bucket_name}"
mount_name = "${values.mount_name}"

# Create the mount
dbutils.fs.mount("s3a://%s:%s@%s" % (access_key, encoded_secret_key, aws_bucket_name), "/mnt/%s" % mount_name)

# List files in the mounted bucket
# display(dbutils.fs.ls("/mnt/%s" % mount_name))`;
};

export const deployMountToDatabricks = async (
  values: S3MountFormValues,
  workspaceUrl: string,
  token: string,
): Promise<void> => {
  if (!workspaceUrl || !token) {
    toast({
      title: "Deployment failed",
      description: "Missing Databricks workspace URL or access token",
      variant: "destructive",
    });
    return;
  }

  try {
    // Generate notebook content for S3 mounting
    const notebookContent = generateMountCode(values);
    
    // Create a notebook name for the S3 mount
    const notebookName = `S3_Mount_${values.aws_bucket_name}_${Date.now()}`;
    
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
        title: "S3 Mount notebook deployed",
        description: `Created notebook: ${notebookName}`,
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to deploy S3 mount notebook');
    }
  } catch (error) {
    console.error('Error deploying S3 mount notebook:', error);
    toast({
      title: "Deployment failed",
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: "destructive",
    });
  }
};
