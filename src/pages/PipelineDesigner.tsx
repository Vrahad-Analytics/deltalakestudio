
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TransformationSelector } from '@/components/pipeline/TransformationSelector';
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

// Component imports
import { Canvas } from '@/components/pipeline/Canvas';
import { ComponentPalette } from '@/components/pipeline/ComponentPalette';
import { DataSourceDialog } from '@/components/pipeline/DataSourceDialog';
import { MountS3Dialog } from '@/components/pipeline/MountS3Dialog';
import { WarehouseDialog } from '@/components/pipeline/WarehouseDialog';
import { PipelineHeader } from '@/components/pipeline/PipelineHeader';
import { ChatInterface } from '@/components/chat/ChatInterface';

// Custom hooks imports
import { usePipelineState } from '@/components/pipeline/usePipelineState';
import { useDragAndDrop } from '@/components/pipeline/useDragAndDrop';
import { useNodeActions } from '@/components/pipeline/NodeActions';
import { useS3Mount } from '@/components/pipeline/useS3Mount';
import { useWarehouse } from '@/components/pipeline/useWarehouse';
import { Node, NodeType } from '@/components/pipeline/types';

// Generate a unique node ID
const generateNodeId = (type: string) => `${type}-${Date.now()}`;

const PipelineDesigner = () => {
  // Check if on mobile
  const isMobile = useIsMobile();
  
  // State for mobile menu
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  // State for chat interface
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Pipeline state management
  const {
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
    handleS3MountSubmit: pipelineHandleS3MountSubmit,
    updateNodeDetails
  } = usePipelineState();
  
  // S3 Mount management
  const {
    isS3MountDialogOpen,
    setIsS3MountDialogOpen,
    selectedNodeId: selectedS3NodeId,
    form: s3MountForm,
    handleConfigureS3Mount,
    handleS3MountSubmit
  } = useS3Mount({ workspaceUrl, token, nodes });

  // Warehouse management
  const {
    isWarehouseDialogOpen,
    setIsWarehouseDialogOpen,
    selectedNodeId: selectedWarehouseNodeId,
    handleConfigureWarehouse,
    handleWarehouseSubmit,
    isCreating: isCreatingWarehouse
  } = useWarehouse(workspaceUrl, token);

  // Define handleConfigureDataSource here to resolve the reference error
  const handleConfigureDataSource = (nodeId: string) => {
    // This function will be passed to useNodeActions but needs to be defined first
    if (selectedNodeId) {
      setIsDataSourceDialogOpen(true);
    }
  };

  // Node actions (click, delete, configure)
  const {
    selectedNodeId,
    isDataSourceDialogOpen,
    setIsDataSourceDialogOpen,
    dataSourceForm,
    handleNodeClick,
    handleCreateCluster,
    handleDeleteNode,
    handleConfigureDataSource: nodeActionsConfigureDataSource
  } = useNodeActions({
    nodes,
    onDeleteNode: (nodeId) => {
      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
      setEdges(prevEdges => 
        prevEdges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    onConfigureDataSource: handleConfigureDataSource,
    updateNodeDetails,
    workspaceUrl,
    token
  });

  // Drag and drop handlers
  const {
    handlePaletteItemDragStart,
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasDrop,
    handleCanvasDragOver,
    showTransformationSelector,
    handleTransformationSelect,
    handleTransformationCancel,
    workspaceUrl: dragDropWorkspaceUrl,
    token: dragDropToken
  } = useDragAndDrop({
    nodes,
    setNodes,
    edges,
    setEdges,
    zoom,
    handleCreateCluster,
    workspaceUrl,
    token
  });

  // Handle zooming in and out
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev * 0.9, 0.5));
  };

  // Form submission handler for data source configuration
  const onDataSourceSubmit = (values: any) => {
    handleDataSourceSubmit(values, selectedNodeId);
    setIsDataSourceDialogOpen(false);
  };

  // Form submission handler for S3 mount configuration
  const onS3MountSubmit = (values: any) => {
    // Use the handleS3MountSubmit from usePipelineState
    pipelineHandleS3MountSubmit(values, selectedS3NodeId);
    
    // Also update the s3MountConfig in the node data
    if (selectedS3NodeId) {
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === selectedS3NodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  s3MountConfig: values
                }
              }
            : node
        )
      );
    }
    
    setIsS3MountDialogOpen(false);
  };

  // Form submission handler for warehouse configuration
  const onWarehouseSubmit = async (values: any) => {
    const result = await handleWarehouseSubmit(values);
    if (result && selectedWarehouseNodeId) {
      setNodes(prevNodes => 
        prevNodes.map(node => 
          node.id === selectedWarehouseNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  details: result.details,
                  code: result.code,
                  codeSummary: result.codeSummary,
                  warehouseConfig: values
                }
              }
            : node
        )
      );
    }
    setIsWarehouseDialogOpen(false);
  };

  // New handler for renaming nodes
  const handleRenameNode = (nodeId: string, newLabel: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                label: newLabel
              }
            }
          : node
      )
    );
  };

  // Handle AI assistant creating nodes
  const handleAICreateNode = (nodeType: string, details: any) => {
    // Generate a unique ID for the new node
    const newId = generateNodeId(nodeType);
    
    // Default position for AI-created nodes
    const position = { x: 150, y: nodes.length * 100 + 50 };
    
    // Fixed: Cast the nodeType string to NodeType
    const validNodeType = nodeType as NodeType;
    
    // Create a new node based on the type
    const newNode: Node = {
      id: newId,
      type: validNodeType,
      position,
      data: { 
        label: details.label || `New ${nodeType}`, 
        details: details.details || `Configuration for ${nodeType}`
      },
    };

    // Add the new node to the nodes array
    setNodes(prevNodes => [...prevNodes, newNode]);
    
    // Connect to the last node if there are any nodes
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const newEdge = {
        id: `edge-${lastNode.id}-${newId}`,
        source: lastNode.id,
        target: newId,
      };
      setEdges(prevEdges => [...prevEdges, newEdge]);
    }
    
    // If this is a specific type that needs configuration, trigger that
    if (nodeType === 'cluster') {
      handleCreateCluster(newId);
    }
  };

  // Toggle palette sidebar (for mobile)
  const togglePalette = () => {
    setIsPaletteOpen(!isPaletteOpen);
  };

  // Close palette when click happens on canvas (for mobile)
  const handleCanvasClick = () => {
    if (isMobile && isPaletteOpen) {
      setIsPaletteOpen(false);
    }
  };

  if (!workspaceUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <PipelineHeader 
        pipelineName={pipelineName}
        setPipelineName={setPipelineName}
        workspaceUrl={workspaceUrl}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        nodes={nodes}
        edges={edges}
        token={token}
        savePipeline={savePipeline}
        isMobile={isMobile}
      />

      <main className="container mx-auto p-2 sm:p-4 flex flex-col h-[calc(100vh-64px)]">
        <div className="flex flex-grow relative">
          {/* Mobile menu toggle button */}
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 left-2 z-20"
              onClick={togglePalette}
            >
              <Menu size={20} />
            </Button>
          )}

          {/* Component Palette - Desktop */}
          {!isMobile && (
            <ComponentPalette onDragStart={handlePaletteItemDragStart} />
          )}

          {/* Component Palette - Mobile */}
          {isMobile && (
            <Sheet open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
              <SheetContent side="left" className="w-[250px] p-0 sm:max-w-none">
                <div className="p-4">
                  <h3 className="font-medium mb-4">Component Palette</h3>
                  <ComponentPalette 
                    onDragStart={handlePaletteItemDragStart} 
                    isMobile={true}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Canvas */}
          <Canvas
            nodes={nodes}
            edges={edges}
            zoom={zoom}
            onNodeMouseDown={handleNodeMouseDown}
            onNodeClick={handleNodeClick}
            onDeleteNode={handleDeleteNode}
            onCreateCluster={handleCreateCluster}
            onConfigureDataSource={nodeActionsConfigureDataSource}
            onConfigureS3Mount={handleConfigureS3Mount}
            onConfigureWarehouse={handleConfigureWarehouse}
            onRenameNode={handleRenameNode}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
            workspaceUrl={workspaceUrl}
            token={token}
            isMobile={isMobile}
          />
          
          {/* AI Chat Interface */}
          {isChatOpen && (
            <div className={`${isMobile ? 'absolute inset-0 z-20' : 'absolute bottom-4 right-4 w-80 h-[500px] z-10'}`}>
              <ChatInterface 
                onClose={() => setIsChatOpen(false)}
                onCreateNode={handleAICreateNode}
              />
            </div>
          )}
          
          {/* Chat Toggle Button */}
          <Button
            className={`absolute ${isMobile ? 'bottom-4 right-4' : 'bottom-4 right-4'} rounded-full shadow-lg`}
            size="icon"
            onClick={() => setIsChatOpen(!isChatOpen)}
            style={{ display: isChatOpen ? 'none' : 'flex' }}
          >
            <MessageSquare size={20} />
          </Button>
        </div>
      </main>

      {/* Data Source Configuration Dialog */}
      <DataSourceDialog
        isOpen={isDataSourceDialogOpen}
        onOpenChange={setIsDataSourceDialogOpen}
        onSubmit={onDataSourceSubmit}
        defaultValues={dataSourceForm.getValues()}
      />

      {/* S3 Mount Configuration Dialog */}
      <MountS3Dialog
        isOpen={isS3MountDialogOpen}
        onOpenChange={setIsS3MountDialogOpen}
        onMount={onS3MountSubmit}
      />

      {/* Warehouse Configuration Dialog */}
      <WarehouseDialog
        isOpen={isWarehouseDialogOpen}
        onOpenChange={setIsWarehouseDialogOpen}
        onSubmit={onWarehouseSubmit}
        isLoading={isCreatingWarehouse}
      />

      {/* Transformation Selector Dialog */}
      <Dialog open={showTransformationSelector} onOpenChange={() => handleTransformationCancel()}>
        <DialogContent className="sm:max-w-[600px] p-0 w-[95%] max-w-[95%] sm:w-auto">
          <TransformationSelector
            onSelectTransformation={handleTransformationSelect}
            onCancel={handleTransformationCancel}
            workspaceUrl={workspaceUrl}
            token={token}
            prevDataframeName="df" // This would be dynamically determined in a real implementation
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelineDesigner;
