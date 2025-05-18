
import { useState, useEffect, useCallback } from 'react';
import { Node, Edge, DataSourceFormValues, S3MountFormValues, WarehouseFormValues } from './types';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { generateSparkCode, generateCodeSummary } from './SparkCodeGenerator';
import { generateMountCode } from './S3MountService';

export interface PipelineStateReturn {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  pipelineName: string;
  setPipelineName: React.Dispatch<React.SetStateAction<string>>;
  workspaceUrl: string | null;
  token: string | null;
  savePipeline: () => void;
  handleDataSourceSubmit: (values: DataSourceFormValues, selectedNodeId: string | null) => void;
  handleS3MountSubmit: (values: S3MountFormValues, selectedNodeId: string | null) => void;
  updateNodeDetails: (nodeId: string, details: string) => void;
}

export function usePipelineState() {
  const navigate = useNavigate();
  const [workspaceUrl, setWorkspaceUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pipelineName, setPipelineName] = useState<string>('My Pipeline');
  
  // State for nodes and edges
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  // Load workspace credentials and saved pipeline on component mount
  useEffect(() => {
    // Check if user is logged in
    const url = sessionStorage.getItem('databricks_url');
    const storedToken = sessionStorage.getItem('databricks_token');
    
    if (!url) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the pipeline designer",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setWorkspaceUrl(url);
    setToken(storedToken);
    
    // Load saved pipeline from localStorage if it exists
    const savedPipeline = localStorage.getItem('saved_pipeline');
    if (savedPipeline) {
      try {
        const { nodes: savedNodes, edges: savedEdges, name } = JSON.parse(savedPipeline);
        setNodes(savedNodes || []);
        setEdges(savedEdges || []);
        if (name) setPipelineName(name);
        toast({
          title: "Pipeline loaded",
          description: "Successfully loaded saved pipeline from browser storage",
        });
      } catch (error) {
        console.error('Error loading saved pipeline:', error);
      }
    }
  }, [navigate]);

  // Handle data source form submission
  const handleDataSourceSubmit = useCallback((values: DataSourceFormValues, selectedNodeId: string | null) => {
    if (!selectedNodeId) return;

    const code = generateSparkCode(values);
    const codeSummary = generateCodeSummary(values);
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                label: `${values.cloudProvider !== 'local' ? 
                  `${values.fileFormat.toUpperCase()} Data (${values.cloudProvider.toUpperCase()})` : 
                  `${values.fileFormat.toUpperCase()} Data Source`}`,
                details: `File: ${values.filePath}`,
                fileFormat: values.fileFormat,
                filePath: values.filePath,
                cloudProvider: values.cloudProvider,
                options: {
                  hasHeader: values.hasHeader,
                  inferSchema: values.inferSchema,
                  multiLine: values.multiLine
                },
                code,
                codeSummary
              }
            }
          : node
      )
    );

    toast({
      title: "Data source configured",
      description: `Successfully configured ${values.fileFormat.toUpperCase()} data source${
        values.cloudProvider !== 'local' ? ` from ${values.cloudProvider.toUpperCase()}` : ''
      }`,
    });
  }, [setNodes]);
  
  // Handle S3 mount form submission
  const handleS3MountSubmit = useCallback((values: S3MountFormValues, selectedNodeId: string | null) => {
    if (!selectedNodeId) return;
    
    // If mount_name is empty, use bucket name
    const effectiveMountName = values.mount_name || values.aws_bucket_name;
    
    // Generate the mount code
    const code = generateMountCode(values);
    const codeSummary = `S3 Mount: ${values.aws_bucket_name} → /mnt/${effectiveMountName}`;
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                label: `S3 Mount: ${values.aws_bucket_name}`,
                details: `Mount: /mnt/${effectiveMountName}`,
                code,
                codeSummary,
                // Store the S3 mount configuration for persistence
                s3MountConfig: {
                  access_key: values.access_key,
                  secret_key: values.secret_key,
                  aws_bucket_name: values.aws_bucket_name,
                  mount_name: effectiveMountName,
                  show_display_command: values.show_display_command
                }
              }
            }
          : node
      )
    );

    toast({
      title: "S3 Mount configured",
      description: `Successfully configured S3 mount for bucket ${values.aws_bucket_name}`,
    });
  }, [setNodes]);

  // Save the current pipeline to localStorage
  const savePipeline = useCallback(() => {
    try {
      const pipelineData = { 
        nodes, 
        edges, 
        name: pipelineName,
        savedAt: new Date().toISOString() 
      };
      localStorage.setItem('saved_pipeline', JSON.stringify(pipelineData));
      toast({
        title: "Pipeline saved",
        description: "Your pipeline has been saved to browser storage",
      });
    } catch (error) {
      console.error('Error saving pipeline:', error);
      toast({
        title: "Save failed",
        description: "Could not save pipeline to browser storage",
        variant: "destructive",
      });
    }
  }, [nodes, edges, pipelineName]);

  // Update node details (used after cluster creation)
  const updateNodeDetails = useCallback((nodeId: string, details: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                details,
              },
            }
          : node
      )
    );
  }, [setNodes]);

  // Create a stable reference to the returned object
  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    zoom,
    setZoom,
    pipelineName,
    setPipelineName,
    workspaceUrl,
    token,
    savePipeline,
    handleDataSourceSubmit,
    handleS3MountSubmit,
    updateNodeDetails
  };
}
