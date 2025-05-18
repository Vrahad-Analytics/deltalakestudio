import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { S3MountFormValues } from './types';
import { toast } from "@/hooks/use-toast";
import { generateMountCode, deployMountToDatabricks } from './S3MountService';

const mountS3Schema = z.object({
  access_key: z.string().min(1, "AWS Access Key is required"),
  secret_key: z.string().min(1, "AWS Secret Key is required"),
  aws_bucket_name: z.string().min(1, "S3 Bucket name is required"),
  mount_name: z.string().min(1, "Mount name is required"),
});

export function useS3Mount(workspaceUrl: string | null, token: string | null) {
  const [isS3MountDialogOpen, setIsS3MountDialogOpen] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const form = useForm<S3MountFormValues>({
    resolver: zodResolver(mountS3Schema),
    defaultValues: {
      access_key: "",
      secret_key: "",
      aws_bucket_name: "",
      mount_name: ""
    }
  });
  
  const handleConfigureS3Mount = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsS3MountDialogOpen(true);
  };
  
  const handleS3MountSubmit = async (values: S3MountFormValues) => {
    if (!selectedNodeId) return;
    
    // Generate the mount code
    const code = generateMountCode(values);
    const codeSummary = `S3 Mount: ${values.aws_bucket_name} → /mnt/${values.mount_name}`;
    
    // Deploy to Databricks if credentials are available
    if (workspaceUrl && token) {
      await deployMountToDatabricks(values, workspaceUrl, token);
    }
    
    // Return the values to update the node data
    return {
      code,
      codeSummary,
      details: `Mount: /mnt/${values.mount_name}`,
      values
    };
  };
  
  return {
    isS3MountDialogOpen,
    setIsS3MountDialogOpen,
    selectedNodeId,
    setSelectedNodeId,
    form,
    handleConfigureS3Mount,
    handleS3MountSubmit
  };
}
