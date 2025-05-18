import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowRight, 
  UploadCloud, 
  Database, 
  ArrowRightLeft, 
  FileCheck, 
  Settings,
  Layers,
  FileSpreadsheet,
  File,
  Server,
  Cpu,
  Network,
  RefreshCw,
  History,
  CheckCircle2,
  Shield,
  Activity,
  Code
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DataFlow = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("source");
  const [progress, setProgress] = useState(0);
  const [sourceType, setSourceType] = useState("");
  const [targetType, setTargetType] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cdcMethod, setCdcMethod] = useState("log");
  const [architecture, setArchitecture] = useState("hub-spoke");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if user is logged in with credentials
    const url = sessionStorage.getItem('databricks_url');
    const token = sessionStorage.getItem('databricks_token');
    
    if (!url || !token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the data flow feature",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    setIsLoading(false);
  }, [navigate]);
  
  useEffect(() => {
    // Update progress based on which steps are completed
    let newProgress = 0;
    
    if (activeTab === "source" && sourceType) {
      newProgress = 25;
    } else if (activeTab === "target" && sourceType && targetType) {
      newProgress = 50;
    } else if (activeTab === "mapping" && sourceType && targetType) {
      newProgress = 75;
    } else if (activeTab === "run" && sourceType && targetType) {
      newProgress = 100;
    }
    
    setProgress(newProgress);
  }, [activeTab, sourceType, targetType]);

  const handleSelectSource = (type: string) => {
    setSourceType(type);
    toast({
      title: "Source selected",
      description: `${type} selected as data source`,
    });
    setActiveTab("target");
  };
  
  const handleSelectTarget = (type: string) => {
    setTargetType(type);
    toast({
      title: "Target selected",
      description: `${type} selected as data target`,
    });
    setActiveTab("mapping");
  };

  const handleRunFlow = () => {
    toast({
      title: "Data flow initiated",
      description: "Your data migration has started running",
    });
    // In a real implementation, this would kick off an actual data flow job
  };

  // New method to render the hub and spoke architecture visualization
  const renderHubSpoke = () => {
    return (
      <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 my-4">
        <h3 className="text-lg font-semibold mb-4">Hub-and-Spoke Architecture</h3>
        <div className="relative h-64 md:h-80 mb-4">
          {/* Central Hub */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg border-2 border-blue-500 shadow-lg w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center z-10">
            <Server className="h-8 w-8 text-blue-700 dark:text-blue-300" />
            <span className="mt-2 text-xs text-center font-medium">Hub Machine</span>
          </div>
          
          {/* Spokes */}
          <div className="absolute top-1/3 left-1/4 bg-green-100 dark:bg-green-900 p-2 rounded-lg border-2 border-green-500 w-20 h-20 flex flex-col items-center justify-center">
            <Cpu className="h-6 w-6 text-green-700 dark:text-green-300" />
            <span className="mt-1 text-xs text-center">Agent 1</span>
          </div>
          
          <div className="absolute top-2/3 left-1/5 bg-green-100 dark:bg-green-900 p-2 rounded-lg border-2 border-green-500 w-20 h-20 flex flex-col items-center justify-center">
            <Cpu className="h-6 w-6 text-green-700 dark:text-green-300" />
            <span className="mt-1 text-xs text-center">Agent 2</span>
          </div>
          
          <div className="absolute top-1/4 right-1/4 bg-purple-100 dark:bg-purple-900 p-2 rounded-lg border-2 border-purple-500 w-20 h-20 flex flex-col items-center justify-center">
            <Network className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            <span className="mt-1 text-xs text-center">Connector 1</span>
          </div>
          
          <div className="absolute bottom-1/4 right-1/4 bg-purple-100 dark:bg-purple-900 p-2 rounded-lg border-2 border-purple-500 w-20 h-20 flex flex-col items-center justify-center">
            <Network className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            <span className="mt-1 text-xs text-center">Connector 2</span>
          </div>
          
          {/* Lines connecting hub to spokes */}
          <svg className="absolute inset-0 w-full h-full" style={{zIndex: 0}}>
            <line x1="50%" y1="50%" x2="25%" y2="33%" stroke="#4ade80" strokeWidth="2" />
            <line x1="50%" y1="50%" x2="20%" y2="66%" stroke="#4ade80" strokeWidth="2" />
            <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#a855f7" strokeWidth="2" />
            <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#a855f7" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  };

  const renderAdvancedSettings = () => {
    if (!showAdvanced) return null;
    
    return (
      <div className="space-y-6 mt-6 p-6 border rounded-lg bg-slate-50 dark:bg-slate-800">
        <h3 className="text-lg font-semibold mb-4">Advanced Data Flow Settings</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="architecture">Architecture Model</Label>
            <Select value={architecture} onValueChange={setArchitecture}>
              <SelectTrigger id="architecture">
                <SelectValue placeholder="Select architecture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hub-spoke">Hub-and-Spoke Model</SelectItem>
                <SelectItem value="distributed">Distributed Processing</SelectItem>
                <SelectItem value="lambda">Lambda Architecture</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              Hub-and-Spoke uses a central orchestrator with lightweight agents
            </p>
          </div>
          
          <div>
            <Label htmlFor="cdc-method">Change Data Capture Method</Label>
            <Select value={cdcMethod} onValueChange={setCdcMethod}>
              <SelectTrigger id="cdc-method">
                <SelectValue placeholder="Select CDC method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="log">Log-Based CDC</SelectItem>
                <SelectItem value="query">Query-Based CDC</SelectItem>
                <SelectItem value="trigger">Trigger-Based CDC</SelectItem>
                <SelectItem value="api">API-Based CDC</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              {cdcMethod === 'log' && 'Tails database binary logs (MySQL binlogs, PostgreSQL WAL)'}
              {cdcMethod === 'query' && 'Uses timestamp-based queries to detect changes'}
              {cdcMethod === 'trigger' && 'Uses database triggers to capture changes'}
              {cdcMethod === 'api' && 'Uses API webhooks or polling to capture changes'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch-size">Processing Batch Size</Label>
              <Select defaultValue="10000">
                <SelectTrigger id="batch-size">
                  <SelectValue placeholder="Select batch size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1,000 records</SelectItem>
                  <SelectItem value="10000">10,000 records</SelectItem>
                  <SelectItem value="100000">100,000 records</SelectItem>
                  <SelectItem value="adaptive">Adaptive Sizing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="consistency">Transaction Consistency</Label>
              <Select defaultValue="eventual">
                <SelectTrigger id="consistency">
                  <SelectValue placeholder="Select consistency model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eventual">Eventual Consistency</SelectItem>
                  <SelectItem value="read-committed">Read Committed</SelectItem>
                  <SelectItem value="serializable">Serializable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Label htmlFor="encryption">Enable AES-256 Encryption</Label>
              <Switch id="encryption" defaultChecked />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="checkpoints">Enable Checkpointing</Label>
              <Switch id="checkpoints" defaultChecked />
            </div>
          </div>
          
          {architecture === 'hub-spoke' && renderHubSpoke()}
          
          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">SQL Template for Initial Sync</h4>
            <pre className="text-xs overflow-x-auto p-2 bg-white dark:bg-slate-800 border rounded">
              {`/* B-Tree databases (MySQL) */
SELECT * FROM {table} WHERE {pk} > ? ORDER BY {pk} LIMIT {page_size}

/* Heap databases (PostgreSQL) */
SELECT ctid,* FROM {table} WHERE ctid > ? ORDER BY ctid`}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse text-slate-700 dark:text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Data Flow</h1>
            <p className="text-slate-600 dark:text-slate-400">Enterprise-grade data integration engine</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <CardTitle>Data Migration Flow</CardTitle>
                <CardDescription>Progress: {progress}%</CardDescription>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                <Label htmlFor="advanced-toggle" className="cursor-pointer">Advanced Mode</Label>
                <Switch
                  id="advanced-toggle"
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
              </div>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="source">1. Source</TabsTrigger>
                <TabsTrigger value="target" disabled={!sourceType}>2. Target</TabsTrigger>
                <TabsTrigger value="mapping" disabled={!sourceType || !targetType}>3. Mapping</TabsTrigger>
                <TabsTrigger value="run" disabled={!sourceType || !targetType}>4. Run</TabsTrigger>
              </TabsList>
              
              <TabsContent value="source" className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Select Data Source</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectSource("database")}>
                    <CardHeader>
                      <Database className="h-8 w-8 text-blue-500 mb-2"/>
                      <CardTitle>Database</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Connect to SQL, PostgreSQL, MySQL or other database sources</CardDescription>
                      {showAdvanced && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">CDC Support</Badge>
                          <Badge variant="outline">Schema Tracking</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectSource("cloud-storage")}>
                    <CardHeader>
                      <UploadCloud className="h-8 w-8 text-blue-500 mb-2"/>
                      <CardTitle>Cloud Storage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Use files from AWS S3, Azure Blob Storage, or Google Cloud Storage</CardDescription>
                      {showAdvanced && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">Event Notifications</Badge>
                          <Badge variant="outline">Object Versioning</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectSource("file-upload")}>
                    <CardHeader>
                      <File className="h-8 w-8 text-blue-500 mb-2"/>
                      <CardTitle>File Upload</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Upload local CSV, Parquet, or JSON files</CardDescription>
                      {showAdvanced && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">Type Inference</Badge>
                          <Badge variant="outline">Schema Validation</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {showAdvanced && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectSource("api")}>
                      <CardHeader>
                        <Network className="h-8 w-8 text-blue-500 mb-2"/>
                        <CardTitle>API Connector</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>Connect to REST, GraphQL, or SOAP APIs</CardDescription>
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">OAuth 2.0</Badge>
                          <Badge variant="outline">Webhook Support</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectSource("streaming")}>
                      <CardHeader>
                        <RefreshCw className="h-8 w-8 text-blue-500 mb-2"/>
                        <CardTitle>Streaming</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>Connect to Kafka, Kinesis, or other streaming platforms</CardDescription>
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">Exactly-once</Badge>
                          <Badge variant="outline">Low Latency</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectSource("custom")}>
                      <CardHeader>
                        <Code className="h-8 w-8 text-blue-500 mb-2"/>
                        <CardTitle>Custom Source</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>Implement a custom data source connector</CardDescription>
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">Python SDK</Badge>
                          <Badge variant="outline">JavaScript SDK</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {renderAdvancedSettings()}
              </TabsContent>
              
              {/* Target Tab Content - Keeping existing structure but adding advanced badges */}
              <TabsContent value="target" className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Select Data Target</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectTarget("database")}>
                    <CardHeader>
                      <Database className="h-8 w-8 text-green-500 mb-2"/>
                      <CardTitle>Database</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Write to SQL, PostgreSQL, MySQL or other database targets</CardDescription>
                      {showAdvanced && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">UPSERT Support</Badge>
                          <Badge variant="outline">Transaction Safety</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectTarget("delta-lake")}>
                    <CardHeader>
                      <Layers className="h-8 w-8 text-green-500 mb-2"/>
                      <CardTitle>Delta Lake</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Write to Delta Lake format on your data lake</CardDescription>
                      {showAdvanced && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">ACID Transactions</Badge>
                          <Badge variant="outline">Time Travel</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => handleSelectTarget("data-warehouse")}>
                    <CardHeader>
                      <FileSpreadsheet className="h-8 w-8 text-green-500 mb-2"/>
                      <CardTitle>Data Warehouse</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Write to Snowflake, BigQuery, or Redshift</CardDescription>
                      {showAdvanced && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          <Badge variant="outline">Bulk Loading</Badge>
                          <Badge variant="outline">Auto-Optimization</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {showAdvanced && renderAdvancedSettings()}
              </TabsContent>
              
              {/* Keep existing mapping tab with minor enhancements */}
              <TabsContent value="mapping" className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Column Mapping</h3>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-5/12">
                      <Label htmlFor="source-column-1">Source Column</Label>
                      <Select defaultValue="id">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">ID</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="created_at">Created At</SelectItem>
                        </SelectContent>
                      </Select>
                      {showAdvanced && (
                        <div className="text-xs text-slate-500 mt-1">
                          Type: INTEGER, Primary Key: Yes
                        </div>
                      )}
                    </div>
                    <div className="flex items-end justify-center w-full md:w-2/12 py-2">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="w-full md:w-5/12">
                      <Label htmlFor="target-column-1">Target Column</Label>
                      <Select defaultValue="id">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">ID</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="created_at">Created At</SelectItem>
                        </SelectContent>
                      </Select>
                      {showAdvanced && (
                        <div className="text-xs text-slate-500 mt-1">
                          Type: BIGINT, Primary Key: Yes
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ... keep existing code for other mapping rows ... */}

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-5/12">
                      <Select defaultValue="name">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">ID</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="created_at">Created At</SelectItem>
                        </SelectContent>
                      </Select>
                      {showAdvanced && (
                        <div className="text-xs text-slate-500 mt-1">
                          Type: VARCHAR(255), Nullable: No
                        </div>
                      )}
                    </div>
                    <div className="flex items-end justify-center w-full md:w-2/12 py-2">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="w-full md:w-5/12">
                      <Select defaultValue="name">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">ID</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="created_at">Created At</SelectItem>
                        </SelectContent>
                      </Select>
                      {showAdvanced && (
                        <div className="text-xs text-slate-500 mt-1">
                          Type: STRING, Nullable: No
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-5/12">
                      <Select defaultValue="email">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">ID</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="created_at">Created At</SelectItem>
                        </SelectContent>
                      </Select>
                      {showAdvanced && (
                        <div className="text-xs text-slate-500 mt-1">
                          Type: VARCHAR(320), Unique: Yes
                        </div>
                      )}
                    </div>
                    <div className="flex items-end justify-center w-full md:w-2/12 py-2">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="w-full md:w-5/12">
                      <Select defaultValue="email">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">ID</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="created_at">Created At</SelectItem>
                        </SelectContent>
                      </Select>
                      {showAdvanced && (
                        <div className="text-xs text-slate-500 mt-1">
                          Type: STRING, Unique: Yes
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {showAdvanced && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Transformations</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded">
                          <div className="text-sm">Type Conversion: VARCHAR to STRING</div>
                          <Badge>Auto</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded">
                          <div className="text-sm">Date Format: ISO 8601</div>
                          <Badge>Auto</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab("run")}>
                      Continue to Run <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {showAdvanced && renderAdvancedSettings()}
              </TabsContent>
              
              {/* Run tab with enhanced configuration */}
              <TabsContent value="run" className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Run Configuration</h3>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1 text-slate-500">Type</h4>
                          <p>{sourceType}</p>
                        </div>
                        {showAdvanced && (
                          <>
                            <div>
                              <h4 className="text-sm font-medium mb-1 text-slate-500">CDC Method</h4>
                              <p>{cdcMethod === 'log' ? 'Log-based CDC' : 
                                 cdcMethod === 'query' ? 'Query-based CDC' : 
                                 cdcMethod === 'trigger' ? 'Trigger-based CDC' : 'API-based CDC'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1 text-slate-500">Isolation Level</h4>
                              <p>Read Committed</p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Target</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1 text-slate-500">Type</h4>
                          <p>{targetType}</p>
                        </div>
                        {showAdvanced && (
                          <>
                            <div>
                              <h4 className="text-sm font-medium mb-1 text-slate-500">Write Strategy</h4>
                              <p>Merge (UPSERT)</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1 text-slate-500">Consistency</h4>
                              <p>Transactional</p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="job-name">Job Name</Label>
                          <Input id="job-name" placeholder="Data Migration Job" />
                        </div>
                        <div>
                          <Label htmlFor="job-description">Description</Label>
                          <Input id="job-description" placeholder="Migrating data from source to target" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="write-mode">Write Mode</Label>
                            <Select defaultValue="append">
                              <SelectTrigger id="write-mode">
                                <SelectValue placeholder="Select write mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="append">Append</SelectItem>
                                <SelectItem value="overwrite">Overwrite</SelectItem>
                                <SelectItem value="merge">Merge</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="batch-size">Batch Size</Label>
                            <Select defaultValue="10000">
                              <SelectTrigger id="batch-size">
                                <SelectValue placeholder="Select batch size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1000">1,000 records</SelectItem>
                                <SelectItem value="10000">10,000 records</SelectItem>
                                <SelectItem value="100000">100,000 records</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {showAdvanced && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label htmlFor="retry-strategy">Retry Strategy</Label>
                              <Select defaultValue="exponential">
                                <SelectTrigger id="retry-strategy">
                                  <SelectValue placeholder="Select retry strategy" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="exponential">Exponential Backoff</SelectItem>
                                  <SelectItem value="fixed">Fixed Interval</SelectItem>
                                  <SelectItem value="none">No Retry</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="notification">Notifications</Label>
                              <Select defaultValue="errors">
                                <SelectTrigger id="notification">
                                  <SelectValue placeholder="Select notification level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Events</SelectItem>
                                  <SelectItem value="errors">Errors Only</SelectItem>
                                  <SelectItem value="none">Disabled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        
                        {showAdvanced && (
                          <div className="mt-4">
                            <Label className="mb-2 block">Processing Features</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center justify-between p-3 border rounded">
                                      <div className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                        <span className="text-sm">Checkpointing</span>
                                      </div>
                                      <Badge variant="outline">Enabled</Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Stores Log Sequence Numbers for fault tolerance</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center justify-between p-3 border rounded">
                                      <div className="flex items-center">
                                        <Shield className="h-4 w-4 text-green-500 mr-2" />
                                        <span className="text-sm">AES-256 Encryption</span>
                                      </div>
                                      <Badge variant="outline">Enabled</Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">End-to-end encryption for all data transfers</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center justify-between p-3 border rounded">
                                      <div className="flex items-center">
                                        <History className="h-4 w-4 text-green-500 mr-2" />
                                        <span className="text-sm">Dead Letter Queue</span>
                                      </div>
                                      <Badge variant="outline">Enabled</Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Stores failed records for later processing</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center justify-between p-3 border rounded">
                                      <div className="flex items-center">
                                        <Activity className="h-4 w-4 text-green-500 mr-2" />
                                        <span className="text-sm">Telemetry</span>
                                      </div>
                                      <Badge variant="outline">Enabled</Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Performance and health metrics collection</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {showAdvanced && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Merge Operation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md">
                          <h4 className="text-sm font-medium mb-2">Generated SQL</h4>
                          <pre className="text-xs overflow-x-auto p-2 bg-white dark:bg-slate-800 border rounded">
                            {`MERGE target USING staging 
ON target.pk = staging.pk
WHEN MATCHED THEN UPDATE SET 
  target.name = staging.name,
  target.email = staging.email,
  target.updated_at = CURRENT_TIMESTAMP
WHEN NOT MATCHED THEN INSERT (id, name, email, created_at)
VALUES (staging.id, staging.name, staging.email, CURRENT_TIMESTAMP)`}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button onClick={() => setActiveTab("mapping")} variant="outline">
                      Back to Mapping
                    </Button>
                    <Button onClick={handleRunFlow} className="flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4" />
                      Run Data Flow
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataFlow;
