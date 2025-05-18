import { useState } from 'react';
import { Node, Edge, DragState, NodeType, XYPosition } from './types';
import { toast } from "@/hooks/use-toast";

interface DragAndDropProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  zoom: number;
  handleCreateCluster: (nodeId: string) => void;
  workspaceUrl?: string | null;
  token?: string | null;
}

export function useDragAndDrop({
  nodes,
  setNodes,
  edges,
  setEdges,
  zoom,
  handleCreateCluster,
  workspaceUrl,
  token
}: DragAndDropProps) {
  // Drag state management
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedNodeId: null,
    initialMousePos: { x: 0, y: 0 },
    initialNodePos: { x: 0, y: 0 },
  });

  // New state for handling component palette drag operations
  const [draggedPaletteItem, setDraggedPaletteItem] = useState<null | {
    type: NodeType;
    label: string;
  }>(null);

  // New state for transformation selection
  const [showTransformationSelector, setShowTransformationSelector] = useState(false);
  const [newNodeId, setNewNodeId] = useState<string | null>(null);

  // Handle palette item drag start
  const handlePaletteItemDragStart = (
    e: React.DragEvent,
    type: NodeType,
    label: string
  ) => {
    setDraggedPaletteItem({ type, label });
    e.dataTransfer.setData('text/plain', `${type}:${label}`);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle node dragging
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDragState({
      isDragging: true,
      draggedNodeId: nodeId,
      initialMousePos: { x: e.clientX, y: e.clientY },
      initialNodePos: { ...node.position },
    });
  };

  // Handle mouse move during node dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.draggedNodeId) return;
    
    const dx = (e.clientX - dragState.initialMousePos.x) / zoom;
    const dy = (e.clientY - dragState.initialMousePos.y) / zoom;
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === dragState.draggedNodeId
          ? {
              ...node,
              position: {
                x: dragState.initialNodePos.x + dx,
                y: dragState.initialNodePos.y + dy,
              },
            }
          : node
      )
    );
  };

  // Reset drag state on mouse up
  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      draggedNodeId: null,
      initialMousePos: { x: 0, y: 0 },
      initialNodePos: { x: 0, y: 0 },
    });
  };

  // Handle canvas drop for new components
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const canvasElement = e.currentTarget;
    if (!canvasElement || !draggedPaletteItem) return;

    const canvasRect = canvasElement.getBoundingClientRect();
    const dropX = (e.clientX - canvasRect.left) / zoom;
    const dropY = (e.clientY - canvasRect.top) / zoom;

    // Generate a unique ID for the new node
    const newId = `${draggedPaletteItem.type}-${Date.now()}`;

    // Find source node for transformation if this is a transformation node
    // We'll get the dataframe name from the previous node in the pipeline
    let prevDataframeName = "df";
    if (draggedPaletteItem.type === 'transformation' && nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      // In a real implementation, we'd get the actual output dataframe name from the node
      if (lastNode.data && lastNode.data.outputDataframeName) {
        prevDataframeName = lastNode.data.outputDataframeName;
      }
    }

    // If this is a transformation node, show the transformation selector
    if (draggedPaletteItem.type === 'transformation') {
      setNewNodeId(newId);
      
      // Create a placeholder node
      const placeholderNode: Node = {
        id: newId,
        type: 'transformation',
        position: { x: dropX, y: dropY },
        data: { 
          label: `New Transformation`, 
          details: `Select a transformation type...`,
        },
      };
      
      // Add the placeholder node
      setNodes(prevNodes => [...prevNodes, placeholderNode]);
      
      // Connect the new node to the last added node if there are any nodes
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        const newEdge: Edge = {
          id: `edge-${lastNode.id}-${newId}`,
          source: lastNode.id,
          target: newId,
        };
        setEdges(prevEdges => [...prevEdges, newEdge]);
      }
      
      // Show the transformation selector
      setShowTransformationSelector(true);
    } else {
      // Create a new node for other types
      const newNode: Node = {
        id: newId,
        type: draggedPaletteItem.type,
        position: { x: dropX, y: dropY },
        data: { 
          label: `New ${draggedPaletteItem.label}`, 
          details: `Configuration for ${draggedPaletteItem.label}` 
        },
      };

      // Add the new node to the nodes array
      setNodes(prevNodes => [...prevNodes, newNode]);
      
      // Connect the new node to the last added node if there are any nodes
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        const newEdge: Edge = {
          id: `edge-${lastNode.id}-${newId}`,
          source: lastNode.id,
          target: newId,
        };
        setEdges(prevEdges => [...prevEdges, newEdge]);
      }
      
      // If this is a cluster node, initiate cluster creation
      if (draggedPaletteItem.type === 'cluster') {
        handleCreateCluster(newId);
      }
      else {
        toast({
          title: "Component added",
          description: `Added new ${draggedPaletteItem.label} component to the canvas.`,
        });
      }
    }
    
    // Reset the dragged palette item
    setDraggedPaletteItem(null);
  };

  // Handle transformation selection
  const handleTransformationSelect = (transformation: any, selectedColumns?: string[]) => {
    if (newNodeId) {
      // Build code syntax with selected columns if any
      let codeSyntax = transformation.syntax;
      let transformationDetails = transformation.description;
      
      if (selectedColumns && selectedColumns.length > 0) {
        // Format the column selection into the code
        if (transformation.name === 'select') {
          codeSyntax = `df.select("${selectedColumns.join('", "')}")`;
        } else if (transformation.name === 'drop') {
          codeSyntax = `df.drop("${selectedColumns.join('", "')}")`;
        } else if (['groupBy', 'orderBy', 'sort'].includes(transformation.name)) {
          codeSyntax = `df.${transformation.name}("${selectedColumns.join('", "')}")`;
        }
        
        // Update the description with selected columns
        transformationDetails = `${transformation.description} on columns: ${selectedColumns.join(', ')}`;
      }
      
      // Update the node with the selected transformation
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === newNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: `Transform: ${transformation.name}`,
                  details: transformationDetails,
                  code: codeSyntax,
                  codeSummary: codeSyntax,
                  transformation: transformation,
                  selectedColumns: selectedColumns,
                  // Add this property to the data object
                  outputDataframeName: "df_transformed", 
                },
              }
            : node
        )
      );

      toast({
        title: "Transformation added",
        description: selectedColumns 
          ? `Added ${transformation.name} transformation with ${selectedColumns.length} selected columns.` 
          : `Added ${transformation.name} transformation to the canvas.`,
      });
    }
    
    // Close the selector
    setShowTransformationSelector(false);
    setNewNodeId(null);
  };

  // Handle cancellation of transformation selection
  const handleTransformationCancel = () => {
    if (newNodeId) {
      // Remove the placeholder node
      setNodes(prevNodes => prevNodes.filter(node => node.id !== newNodeId));
      // Remove any edges connected to the node
      setEdges(prevEdges => prevEdges.filter(edge => 
        edge.source !== newNodeId && edge.target !== newNodeId
      ));
    }
    
    // Close the selector
    setShowTransformationSelector(false);
    setNewNodeId(null);
  };

  // Enable canvas to receive drops
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return {
    draggedPaletteItem,
    handlePaletteItemDragStart,
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasDrop,
    handleCanvasDragOver,
    showTransformationSelector,
    handleTransformationSelect,
    handleTransformationCancel,
    workspaceUrl,
    token
  };
}
