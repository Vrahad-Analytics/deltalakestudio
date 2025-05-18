
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { WarehouseFormValues } from './types';
import { createWarehouse } from './WarehouseService';
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  cluster_size: z.string(),
  max_num_clusters: z.number().int().min(1).max(30),
  auto_stop_mins: z.number().int().min(0).max(120),
  enable_photon: z.boolean().default(true),
  spot_instance_policy: z.enum(["RELIABILITY_OPTIMIZED", "COST_OPTIMIZED"]),
  warehouse_type: z.enum(["PRO", "CLASSIC", "SERVERLESS"])
});

export function useWarehouse(workspaceUrl: string | null, token: string | null) {
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "my-warehouse",
      cluster_size: "SMALL",
      max_num_clusters: 1,
      auto_stop_mins: 30,
      enable_photon: true,
      spot_instance_policy: "RELIABILITY_OPTIMIZED",
      warehouse_type: "PRO"
    }
  });

  const handleConfigureWarehouse = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsWarehouseDialogOpen(true);
  };

  const handleWarehouseSubmit = async (values: WarehouseFormValues) => {
    if (!workspaceUrl || !token) {
      console.error("Workspace URL or token is missing");
      toast({
        title: "Configuration Error",
        description: "Workspace URL or token is missing. Please check your login details.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsCreating(true);
      console.log("Creating warehouse with values:", values);
      console.log("Using workspace URL:", workspaceUrl);
      
      const result = await createWarehouse(workspaceUrl, token, values);
      
      toast({
        title: "Warehouse Created",
        description: `Warehouse ${values.name} created successfully`,
      });
      
      return {
        ...result,
        warehouseConfig: values
      };
    } catch (error) {
      console.error("Error creating warehouse:", error);
      // Error toast is already handled in the service
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isWarehouseDialogOpen,
    setIsWarehouseDialogOpen,
    selectedNodeId,
    form,
    handleConfigureWarehouse,
    handleWarehouseSubmit,
    isCreating
  };
}
