
import React from 'react';
import { Code } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Node, Edge } from './types';
import { toast } from "@/hooks/use-toast";

interface CodeGeneratorProps {
  showGeneratedCode: boolean;
  setShowGeneratedCode: React.Dispatch<React.SetStateAction<boolean>>;
  nodes: Node[];
  edges: Edge[];
  pipelineName: string;
  workspaceUrl: string | null;
  token: string | null;
  savePipeline: () => void;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({
  showGeneratedCode,
  setShowGeneratedCode,
  nodes,
  edges,
  pipelineName,
  workspaceUrl,
  token,
  savePipeline
}) => {
  // Generate code for the entire pipeline
  const generatePipelineCode = (): string => {
    let code = "# PySpark Pipeline Code\n";
    code += "from pyspark.sql import SparkSession\n\n";
    code += "# Initialize Spark Session\n";
    code += "spark = SparkSession.builder.appName(\"" + pipelineName + "\").getOrCreate()\n\n";
    
    // Add code from each node
    nodes.forEach(node => {
      if (node.data.code) {
        code += `# ${node.data.label}\n`;
        code += `${node.data.code}\n\n`;
      }
    });
    
    // Add relationship code based on edges
    if (edges.length > 0) {
      code += "# Processing Pipeline\n";
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          code += `# Connect ${sourceNode.data.label} to ${targetNode.data.label}\n`;
        }
      });
    }
    
    return code;
  };

  return (
    <Dialog open={showGeneratedCode} onOpenChange={setShowGeneratedCode}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generated PySpark Pipeline Code</DialogTitle>
          <DialogDescription>
            This code represents the entire pipeline and can be run in a Databricks notebook
          </DialogDescription>
        </DialogHeader>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md mt-4">
          <pre className="text-xs font-mono overflow-auto whitespace-pre-wrap max-h-[50vh]">
            {generatePipelineCode()}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

