
import { useState } from 'react';
import { Node } from './types';
import { useForm } from "react-hook-form";
import { DataSourceFormValues } from './types';
import { createCluster } from './ClusterService';

interface NodeActionsProps {
  nodes: Node[];
  onDeleteNode: (nodeId: string) => void;
  onConfigureDataSource: (nodeId: string) => void;
  updateNodeDetails: (nodeId: string, details: string) => void;
  workspaceUrl: string | null;
  token: string | null;
}

export const useNodeActions = ({
  nodes,
  onDeleteNode,
  onConfigureDataSource,
  updateNodeDetails,
  workspaceUrl,
  token
}: NodeActionsProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDataSourceDialogOpen, setIsDataSourceDialogOpen] = useState(false);
  
  // Form for data source configuration
  const dataSourceForm = useForm<DataSourceFormValues>({
    defaultValues: {
      fileFormat: 'csv',
      filePath: 'path/to/file.csv',
      hasHeader: true,
      inferSchema: true,
      multiLine: false,
      cloudProvider: 'local'
    }
  });

  // Handle node click to open configuration dialogs
  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Open appropriate dialog based on node type
    if (node.type === 'source') {
      setSelectedNodeId(nodeId);
      
      // Pre-populate form with existing values if available
      if (node.data.fileFormat && node.data.filePath) {
        dataSourceForm.reset({
          fileFormat: node.data.fileFormat,
          filePath: node.data.filePath,
          hasHeader: node.data.options?.hasHeader as boolean || true,
          inferSchema: node.data.options?.inferSchema as boolean || true,
          multiLine: node.data.options?.multiLine as boolean || false,
          cloudProvider: node.data.cloudProvider || 'local'
        });
      }
      
      setIsDataSourceDialogOpen(true);
    }
  };
 
  // Handle cluster creation
  const handleCreateCluster = (nodeId: string) => {
    if (workspaceUrl && token) {
      createCluster(nodeId, workspaceUrl, token, updateNodeDetails);
    }
  };
  
  // Delete node and its connected edges
  const handleDeleteNode = (nodeId: string) => {
    onDeleteNode(nodeId);
  };

  // Configure data source node
  const handleConfigureDataSource = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    
    if (node?.data.fileFormat && node?.data.filePath) {
      dataSourceForm.reset({
        fileFormat: node.data.fileFormat,
        filePath: node.data.filePath,
        hasHeader: node.data.options?.hasHeader as boolean || true,
        inferSchema: node.data.options?.inferSchema as boolean || true,
        multiLine: node.data.options?.multiLine as boolean || false,
        cloudProvider: node.data.cloudProvider || 'local'
      });
    }
    
    setIsDataSourceDialogOpen(true);
  };

  return {
    selectedNodeId,
    setSelectedNodeId,
    isDataSourceDialogOpen,
    setIsDataSourceDialogOpen,
    dataSourceForm,
    handleNodeClick,
    handleCreateCluster,
    handleDeleteNode,
    handleConfigureDataSource
  };
};
