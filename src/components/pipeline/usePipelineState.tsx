
import { useState, useEffect } from 'react';
import { Node, Edge, DataSourceFormValues } from './types';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { generateSparkCode, generateCodeSummary } from './SparkCodeGenerator';

export interface PipelineState {
  nodes: Node[];
  edges: Edge[];
  pipelineName: string;
  workspaceUrl: string | null;
  token: string | null;
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
  const handleDataSourceSubmit = (values: DataSourceFormValues, selectedNodeId: string | null) => {
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
  };

  // Save the current pipeline to localStorage
  const savePipeline = () => {
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
  };

  // Update node details (used after cluster creation)
  const updateNodeDetails = (nodeId: string, details: string) => {
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
  };

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
    updateNodeDetails
  };
}
