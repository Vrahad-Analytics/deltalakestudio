
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, Save, Code, Pencil, ExternalLink, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { CodeGenerator } from './CodeGenerator';
import { Node, Edge } from './types';
import { Logo } from '@/components/Logo';
import { Input } from "@/components/ui/input";

interface PipelineHeaderProps {
  pipelineName: string;
  workspaceUrl: string | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  nodes: Node[];
  edges: Edge[];
  token: string | null;
  savePipeline: () => void;
  setPipelineName: (name: string) => void;
  isMobile?: boolean;
}

export const PipelineHeader: React.FC<PipelineHeaderProps> = ({
  pipelineName,
  workspaceUrl,
  zoom,
  onZoomIn,
  onZoomOut,
  nodes,
  edges,
  token,
  savePipeline,
  setPipelineName,
  isMobile
}) => {
  const navigate = useNavigate();
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(pipelineName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  // Handle name edit
  const handleNameEdit = () => {
    setTempName(pipelineName);
    setIsEditingName(true);
  };

  // Handle name save
  const handleNameSave = () => {
    if (tempName.trim()) {
      setPipelineName(tempName.trim());
    }
    setIsEditingName(false);
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setTempName(pipelineName);
    }
  };

  // Function to open Databricks workspace
  const openDatabricksWorkspace = () => {
    if (workspaceUrl) {
      window.open(workspaceUrl, '_blank');
    }
  };

  // Function to download the generated code as a .py file
  const handleDownloadPipeline = () => {
    // Generate the pipeline code
    const code = generatePipelineCode(nodes, edges, pipelineName);
    
    // Create a blob for the file
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pipelineName.replace(/\s+/g, '_').toLowerCase()}_pipeline.py`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Also save to local storage as before
    savePipeline();
  };

  // Generate code for the entire pipeline
  const generatePipelineCode = (nodes: Node[], edges: Edge[], pipelineName: string): string => {
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
    <>
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="container mx-auto px-2 sm:px-4 py-4 flex justify-between items-center">
          {isMobile ? (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="mr-2">
                <ArrowLeft size={20} />
              </Button>
              <Logo />
            </div>
          ) : (
            <Logo />
          )}
          
          {!isMobile && (
            <div className="flex items-center space-x-4">
              {workspaceUrl && (
                <Button 
                  variant="outline" 
                  onClick={openDatabricksWorkspace}
                  className="flex items-center gap-2"
                >
                  <span>Databricks Home</span>
                  <ExternalLink size={16} />
                </Button>
              )}
              <Button variant="ghost" onClick={() => window.open('https://github.com/Vrahad-Analytics/deltalakestudio', '_blank')}>
                Contribute on GitHub
              </Button>
              <Button variant="ghost" onClick={() => window.open('https://chat.whatsapp.com/DXEemF4EvLn7Wt7121yqEt', '_blank')}>
                Join Us on WhatsApp
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-lg shadow-md mb-4">
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center'}`}>
            <div className="flex items-center">
              {isEditingName ? (
                <Input
                  ref={inputRef}
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleKeyPress}
                  className="text-xl font-semibold w-64"
                />
              ) : (
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold mr-2">{pipelineName}</h2>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="p-1 h-auto" 
                    onClick={handleNameEdit}
                  >
                    <Pencil size={14} />
                  </Button>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500 mt-1">Connected to Databricks Asset Bundles</p>
            </div>
            <div className={`${isMobile ? 'mt-2' : 'ml-6'} flex space-x-2`}>
              <Button size="sm" variant="ghost" onClick={onZoomIn}><PlusIcon /></Button>
              <Button size="sm" variant="ghost" onClick={onZoomOut}><MinusIcon /></Button>
            </div>
          </div>
          <div className={`flex ${isMobile ? 'w-full justify-between' : 'space-x-3'}`}>
            <Button variant="outline" onClick={handleDownloadPipeline} className="flex items-center gap-2">
              <Save size={16} /> {!isMobile && "Save Pipeline"}
            </Button>
            <Button className="flex items-center gap-2" onClick={() => setShowGeneratedCode(true)}>
              <Code size={16} /> {!isMobile && "Generate Code"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 mb-4 overflow-x-auto">
        <div className="flex space-x-4 border-b pb-2">
          <Button variant="ghost" className="text-sm font-bold border-b-2 border-purple-500">Tasks</Button>
        </div>
      </div>
      
      <CodeGenerator 
        showGeneratedCode={showGeneratedCode}
        setShowGeneratedCode={setShowGeneratedCode}
        nodes={nodes}
        edges={edges}
        pipelineName={pipelineName}
        workspaceUrl={workspaceUrl}
        token={token}
        savePipeline={savePipeline}
      />
    </>
  );
};
