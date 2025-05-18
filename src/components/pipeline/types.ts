
// Using specific imports instead of importing from 'reactflow'
export interface XYPosition {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: NodeType;
  position: XYPosition;
  data: NodeData;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string; // Adding label property
  data?: EdgeData;
}

export interface DragState {
  isDragging: boolean;
  draggedNodeId: string | null;
  initialMousePos: { x: number; y: number };
  initialNodePos: { x: number; y: number };
}

export type NodeType =
  | 'source'
  | 'transformation'
  | 'condition'
  | 'task'
  | 'destination'
  | 'cluster'
  | 'display-data'
  | 's3-mount'
  | 'warehouse'
  | 'api-connector'
  | 'streaming-data'
  | 'data-validation'
  | 'data-profiling'
  | 'duplicate-detection'
  | 'data-security'
  | 'custom-code'
  | 'feature-engineering'
  | 'data-enrichment'
  | 'ml-training'
  | 'ml-deployment'
  | 'scheduler'
  | 'monitoring';

export type FileFormat = 'csv' | 'json' | 'parquet' | 'orc';

// Updated CloudStorageProvider to include all the provider types being used
export type CloudStorageProvider = 
  | 'aws' 
  | 'azure' 
  | 'gcp' 
  | 'local'
  | 's3'
  | 'adls'
  | 'gcs'
  | 'azure-blob';

export interface DataSourceFormValues {
  fileFormat: FileFormat;
  filePath: string;
  cloudProvider: CloudStorageProvider;
  hasHeader: boolean;
  inferSchema: boolean;
  multiLine: boolean;
}

// Renamed from MountS3FormValues to S3MountFormValues for consistency
export interface S3MountFormValues {
  access_key: string;
  secret_key: string;
  aws_bucket_name: string;
  mount_name: string;
}

// New interface for Warehouse configuration
export interface WarehouseFormValues {
  name: string;
  cluster_size: string;
  max_num_clusters: number;
  auto_stop_mins: number;
  enable_photon: boolean;
  spot_instance_policy: string;
  warehouse_type: string;
}

interface EdgeData {
  label?: string;
}

// Node data interface
export interface NodeData {
  label: string;
  details: string;
  fileFormat?: FileFormat;
  filePath?: string;
  options?: Record<string, string | boolean>;
  code?: string;
  codeSummary?: string;
  cloudProvider?: CloudStorageProvider;
  transformation?: any;
  selectedColumns?: string[];
  outputDataframeName?: string;
  warehouseConfig?: WarehouseFormValues;
  // New fields for additional features
  apiConfig?: ApiConnectorConfig;
  validationRules?: ValidationRule[];
  securityConfig?: SecurityConfig;
  customCode?: string;
  codeLanguage?: 'python' | 'sql' | 'scala';
  mlConfig?: MLConfig;
  scheduleConfig?: ScheduleConfig;
}

// New interfaces for additional features
export interface ApiConnectorConfig {
  type: 'rest' | 'graphql' | 'soap';
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  authentication?: 'none' | 'basic' | 'oauth' | 'apiKey';
  authDetails?: Record<string, string>;
}

export interface ValidationRule {
  type: 'schema' | 'null' | 'dataType' | 'range' | 'regex' | 'custom';
  column?: string;
  condition?: string;
  value?: any;
  errorMessage?: string;
}

export interface SecurityConfig {
  masking?: boolean;
  encryption?: boolean;
  columns?: string[];
  method?: string;
}

export interface MLConfig {
  modelType?: string;
  targetColumn?: string;
  featureColumns?: string[];
  hyperparameters?: Record<string, any>;
  evaluationMetrics?: string[];
}

export interface ScheduleConfig {
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  startTime?: string;
  endTime?: string;
  cronExpression?: string;
}
