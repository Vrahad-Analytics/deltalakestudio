
import { useState } from 'react';
import { 
  Database, 
  Columns2, 
  Layers, 
  FileCode, 
  Settings, 
  FileJson,
  FileText,
  File,
  Trash2,
  Cloud,
  Table as TableIcon,
  Edit,
  Plug,
  Radio,
  CheckSquare as Check,
  BarChart as ChartBar,
  Copy as Duplicate,
  Copy,
  Shield,
  ShieldCheck,
  Lock,
  Code,
  Layers3,
  TrendingUp,
  Rocket,
  Calendar,
  GitBranch,
  Bell,
  History,
  GitPullRequest,
  Users,
  MessageSquare,
  Folder,
  Component,
  Download,
  Upload,
  CloudUpload,
  FileText as FileExport,
  PieChart as ChartPie,
  Presentation,
  Book,
  Globe,
  Accessibility
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Node, NodeType, FileFormat } from './types';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DataframeDisplayDialog } from "./DataframeDisplayDialog";
import { DisplayDataTransform } from "./DisplayDataTransform";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface NodeComponentProps {
  node: Node;
  onNodeMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onNodeClick: (e: React.MouseEvent, nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onCreateCluster: (nodeId: string) => void;
  onConfigureDataSource: (nodeId: string) => void;
  onConfigureS3Mount?: (nodeId: string) => void;
  onConfigureWarehouse?: (nodeId: string) => void;
  onRenameNode?: (nodeId: string, newLabel: string) => void;
  workspaceUrl?: string | null;
  token?: string | null;
  isMobile?: boolean;
}

export const NodeComponent = ({
  node,
  onNodeMouseDown,
  onNodeClick,
  onDeleteNode,
  onCreateCluster,
  onConfigureDataSource,
  onConfigureS3Mount,
  onConfigureWarehouse,
  onRenameNode,
  workspaceUrl,
  token,
  isMobile
}: NodeComponentProps) => {
  const [showFullCode, setShowFullCode] = useState(false);
  const [isDataframeDialogOpen, setIsDataframeDialogOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newLabel, setNewLabel] = useState(node.data.label);
  
  // Get file format icon
  const getFileFormatIcon = (format?: FileFormat) => {
    switch(format) {
      case 'csv':
        return <FileText className="h-4 w-4" />;
      case 'json':
        return <FileJson className="h-4 w-4" />;
      case 'parquet':
        return <File className="h-4 w-4" />;
      case 'orc':
        return <File className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  // Get node type icon
  const getNodeTypeIcon = (type: NodeType, fileFormat?: FileFormat) => {
    if (type === 'source' && fileFormat) {
      return getFileFormatIcon(fileFormat);
    }
    
    switch (type) {
      case 'source':
        return <Database className="mr-2" />;
      case 'condition':
        return <GitBranch className="mr-2" />;
      case 'transformation':
        return <Layers className="mr-2" />;
      case 'task':
        return <FileCode className="mr-2" />;
      case 'destination':
        return <Settings className="mr-2" />;
      case 'cluster':
        return <Database className="mr-2" />;
      case 's3-mount':
        return <Cloud className="mr-2" />;
      case 'display-data':
        return <TableIcon className="mr-2" />;
      case 'warehouse':
        return <Database className="mr-2" />;
      case 'api-connector':
        return <Plug className="mr-2" />;
      case 'streaming-data':
        return <Radio className="mr-2" />;
      case 'data-validation':
        return <Check className="mr-2" />;
      case 'data-profiling':
        return <ChartBar className="mr-2" />;
      case 'duplicate-detection':
        return <Duplicate className="mr-2" />;
      case 'data-security':
        return <Shield className="mr-2" />;
      case 'custom-code':
        return <Code className="mr-2" />;
      case 'feature-engineering':
        return <Layers className="mr-2" />;
      case 'data-enrichment':
        return <Layers3 className="mr-2" />;
      case 'ml-training':
        return <TrendingUp className="mr-2" />;
      case 'ml-deployment':
        return <Rocket className="mr-2" />;
      case 'scheduler':
        return <Calendar className="mr-2" />;
      case 'monitoring':
        return <Bell className="mr-2" />;
      default:
        return <Component className="mr-2" />;
    }
  };

  // Get node background color based on type
  const getNodeBackgroundColor = () => {
    switch (node.type) {
      case 'source':
      case 'api-connector':
      case 'streaming-data':
      case 's3-mount':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'transformation':
      case 'condition':
      case 'duplicate-detection':
      case 'custom-code':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'data-validation':
      case 'data-profiling':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'feature-engineering':
      case 'data-enrichment':
      case 'ml-training':
      case 'ml-deployment':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case 'task':
      case 'scheduler':
      case 'monitoring':
      case 'cluster':
        return 'bg-rose-50 dark:bg-rose-900/20';
      case 'data-security':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'display-data':
      case 'warehouse':
      case 'destination':
        return 'bg-teal-50 dark:bg-teal-900/20';
      default:
        return 'bg-white dark:bg-slate-700';
    }
  };

  // Determine if node can display a dataframe
  const canDisplayDataframe = () => {
    return ['transformation', 'source', 'task', 'destination', 'data-validation', 'data-profiling', 'duplicate-detection', 'feature-engineering', 'data-enrichment', 'ml-training'].includes(node.type);
  };

  // Check if this is a display-data transform node
  const isDisplayDataNode = node.type === 'display-data';

  // Handle rename button click
  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewLabel(node.data.label);
    setIsRenaming(true);
  };

  // Handle rename submission
  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (newLabel.trim() && onRenameNode) {
      onRenameNode(node.id, newLabel.trim());
      toast({
        title: "Node renamed",
        description: "The node has been successfully renamed.",
      });
    }
    
    setIsRenaming(false);
  };

  // Get node configuration button based on type
  const getNodeConfigButton = () => {
    switch (node.type) {
      case 'source':
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onConfigureDataSource(node.id);
            }}
          >
            Configure Data Source
          </Button>
        );
      case 'cluster':
        if (!node.data.details.includes('Cluster ID')) {
          return (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onCreateCluster(node.id);
              }}
            >
              Create Cluster
            </Button>
          );
        }
        return null;
      case 's3-mount':
        if (onConfigureS3Mount) {
          return (
            <div className="space-y-2 w-full">
              {node.data.code && (
                <div className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded max-h-24 overflow-auto font-mono border border-slate-200 dark:border-slate-700">
                  {node.data.code.split('\n').slice(0, 5).join('\n')}
                  {node.data.code.split('\n').length > 5 && '\n...'}                  
                </div>
              )}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfigureS3Mount(node.id);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit Mount
                </Button>
                {node.data.code && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(node.data.code || '');
                      toast({
                        title: "Code copied",
                        description: "Mount code copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          );
        }
        return null;
      case 'warehouse':
        if (onConfigureWarehouse) {
          return (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onConfigureWarehouse(node.id);
              }}
            >
              Create New Warehouse
            </Button>
          );
        }
        return null;
      case 'custom-code':
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // Would normally open a code editor dialog
              toast({
                title: "Feature Coming Soon",
                description: "Custom code editor will be available in the next update.",
              });
            }}
          >
            Edit Code
          </Button>
        );
      case 'data-validation':
      case 'data-profiling':
      case 'duplicate-detection':
      case 'feature-engineering':
      case 'data-enrichment':
      case 'ml-training':
      case 'ml-deployment':
      case 'scheduler':
      case 'api-connector':
      case 'streaming-data':
      case 'data-security':
      case 'monitoring':
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              toast({
                title: "Feature Coming Soon",
                description: `${node.data.label} configuration will be available in the next update.`,
              });
            }}
          >
            Configure {node.data.label}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`absolute border border-slate-200 dark:border-slate-600 shadow-md rounded-md p-3 w-[300px] ${getNodeBackgroundColor()}`}
      style={{ 
        left: node.position.x, 
        top: node.position.y,
      }}
      onMouseDown={(e) => onNodeMouseDown(e, node.id)}
      onClick={(e) => onNodeClick(e, node.id)}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {getNodeTypeIcon(node.type, node.data.fileFormat)}
          {isRenaming ? (
            <form onSubmit={handleRenameSubmit} className="flex items-center" onClick={(e) => e.stopPropagation()}>
              <Input 
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="h-7 py-1 text-sm"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <Button 
                type="submit" 
                size="sm" 
                variant="ghost" 
                className="ml-1 p-1 h-6"
              >
                ✓
              </Button>
            </form>
          ) : (
            <div className="flex items-center">
              <span className="font-medium">{node.data.label}</span>
              <button
                className="ml-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                onClick={handleRenameClick}
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <button 
          className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
          onClick={(e) => {
            e.stopPropagation(); 
            onDeleteNode(node.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="text-xs text-slate-500">{node.data.details}</div>
      
      {node.data.codeSummary && !isDisplayDataNode && (
        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono overflow-x-auto">
          <pre>{node.data.codeSummary}</pre>
        </div>
      )}
      
      {/* Special case for display-data node type */}
      {isDisplayDataNode && workspaceUrl && token && (
        <div className="mt-2">
          <DisplayDataTransform 
            workspaceUrl={workspaceUrl} 
            token={token} 
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-2">
        {getNodeConfigButton()}
        
        {canDisplayDataframe() && (
          <Button 
            size="sm" 
            variant="outline"
            className="w-full text-xs flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsDataframeDialogOpen(true);
            }}
          >
            <TableIcon className="h-4 w-4" />
            Display DataFrame
          </Button>
        )}
      </div>
      
      {/* DataFrame Display Dialog */}
      <DataframeDisplayDialog 
        isOpen={isDataframeDialogOpen}
        onOpenChange={setIsDataframeDialogOpen}
        workspaceUrl={workspaceUrl || null}
        token={token || null}
      />
    </div>
  );
};
