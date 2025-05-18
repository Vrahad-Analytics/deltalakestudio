import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { S3MountFormValues, Node } from './types';
import { toast } from "@/hooks/use-toast";
import { generateMountCode, deployMountToDatabricks } from './S3MountService';

const mountS3Schema = z.object({
  access_key: z.string().min(1, "AWS Access Key is required"),
  secret_key: z.string().min(1, "AWS Secret Key is required"),
  aws_bucket_name: z.string().min(1, "S3 Bucket name is required"),
  mount_name: z.string().optional(),
  show_display_command: z.boolean().default(false)
});

interface UseS3MountProps {
  workspaceUrl: string | null;
  token: string | null;
  nodes: Node[];
}

export function useS3Mount({ workspaceUrl, token, nodes }: UseS3MountProps) {
  const [isS3MountDialogOpen, setIsS3MountDialogOpen] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const form = useForm<S3MountFormValues>({
    resolver: zodResolver(mountS3Schema),
    defaultValues: {
      access_key: "",
      secret_key: "",
      aws_bucket_name: "",
      mount_name: "",
      show_display_command: false
    }
  });
  
  // Reset form when dialog is closed
  useEffect(() => {
    if (!isS3MountDialogOpen) {
      form.reset();
    }
  }, [isS3MountDialogOpen, form]);
  
  const handleConfigureS3Mount = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    
    // Find the node in the nodes array
    const node = nodes.find(n => n.id === nodeId);
    
    if (node && node.data.s3MountConfig) {
      // If the node has existing S3 mount configuration, load it into the form
      form.reset({
        access_key: node.data.s3MountConfig.access_key || '',
        secret_key: node.data.s3MountConfig.secret_key || '',
        aws_bucket_name: node.data.s3MountConfig.aws_bucket_name || '',
        mount_name: node.data.s3MountConfig.mount_name || '',
        show_display_command: node.data.s3MountConfig.show_display_command || false
      });
    } else {
      // Reset form if no existing configuration
      form.reset({
        access_key: '',
        secret_key: '',
        aws_bucket_name: '',
        mount_name: '',
        show_display_command: false
      });
    }
    
    setIsS3MountDialogOpen(true);
  };
  
  const handleS3MountSubmit = async (values: S3MountFormValues) => {
    if (!selectedNodeId) return;
    
    // If mount_name is empty, use bucket name
    const effectiveMountName = values.mount_name || values.aws_bucket_name;
    
    // Generate the mount code
    const code = generateMountCode(values);
    const codeSummary = `S3 Mount: ${values.aws_bucket_name} → /mnt/${effectiveMountName}`;
    
    // Deploy to Databricks if credentials are available
    if (workspaceUrl && token) {
      await deployMountToDatabricks(values, workspaceUrl, token);
    }
    
    // Return the values to update the node data
    return {
      code,
      codeSummary,
      details: `Mount: /mnt/${effectiveMountName}`,
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
