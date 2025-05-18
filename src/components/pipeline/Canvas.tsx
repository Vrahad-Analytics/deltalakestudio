
import React, { useRef } from 'react';
import { NodeComponent } from './NodeComponent';
import { EdgeComponent } from './EdgeComponent';
import { Node, Edge } from './types';

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  zoom: number;
  onNodeMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onNodeClick: (e: React.MouseEvent, nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onCreateCluster: (nodeId: string) => void;
  onConfigureDataSource: (nodeId: string) => void;
  onConfigureS3Mount?: (nodeId: string) => void;
  onConfigureWarehouse?: (nodeId: string) => void;
  onRenameNode: (nodeId: string, newLabel: string) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick?: () => void;
  workspaceUrl?: string | null;
  token?: string | null;
  isMobile?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  zoom,
  onNodeMouseDown,
  onNodeClick,
  onDeleteNode,
  onCreateCluster,
  onConfigureDataSource,
  onConfigureS3Mount,
  onConfigureWarehouse,
  onRenameNode,
  onDrop,
  onDragOver,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick,
  workspaceUrl,
  token,
  isMobile
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="relative flex-grow border border-slate-200 dark:border-slate-700 rounded-lg shadow-inner bg-slate-50 dark:bg-slate-800 overflow-auto"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={onClick}
    >
      <div 
        className="min-h-[1200px] min-w-[1200px] relative"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        ref={canvasRef}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        <EdgeComponent edges={edges} nodes={nodes} />
        
        {nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            onNodeMouseDown={onNodeMouseDown}
            onNodeClick={onNodeClick}
            onDeleteNode={onDeleteNode}
            onCreateCluster={onCreateCluster}
            onConfigureDataSource={onConfigureDataSource}
            onConfigureS3Mount={onConfigureS3Mount}
            onConfigureWarehouse={onConfigureWarehouse}
            onRenameNode={onRenameNode}
            workspaceUrl={workspaceUrl}
            token={token}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
};
