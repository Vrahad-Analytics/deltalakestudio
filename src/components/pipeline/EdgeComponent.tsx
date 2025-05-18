
import React from 'react';
import { Edge, Node } from './types';

interface EdgeComponentProps {
  edges: Edge[];
  nodes: Node[];
}

export const EdgeComponent: React.FC<EdgeComponentProps> = ({ edges, nodes }) => {
  const renderEdges = () => {
    return edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const sourceX = sourceNode.position.x + 150; // end of source node
      const sourceY = sourceNode.position.y + 40; // middle of source node
      const targetX = targetNode.position.x; // start of target node
      const targetY = targetNode.position.y + 40; // middle of target node
      
      // Calculate control points for curved lines
      const midX = (sourceX + targetX) / 2;
      
      const path = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
      
      // Get label from either the edge directly or the edge.data.label
      const edgeLabel = edge.label || (edge.data && edge.data.label);
      
      return (
        <g key={edge.id}>
          <path 
            d={path} 
            stroke="#aaa" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          {edgeLabel && (
            <text 
              x={midX} 
              y={(sourceY + targetY) / 2 - 10} 
              fill="#666" 
              fontSize="12" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="bg-white px-1 rounded"
            >
              {edgeLabel}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <defs>
        <marker 
          id="arrowhead" 
          markerWidth="10" 
          markerHeight="7" 
          refX="9" 
          refY="3.5" 
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#aaa" />
        </marker>
      </defs>
      {renderEdges()}
    </svg>
  );
};
