
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataframeColumnsSelector } from "./DataframeColumnsSelector";

interface TransformationOption {
  name: string;
  syntax: string;
  description: string;
  category: 'column' | 'row' | 'join' | 'aggregation' | 'other';
  needsColumns?: boolean;
}

interface TransformationSelectorProps {
  onSelectTransformation: (transformation: TransformationOption, columns?: string[]) => void;
  onCancel: () => void;
  workspaceUrl?: string | null;
  token?: string | null;
  prevDataframeName?: string;
}

const transformations: TransformationOption[] = [
  // Column Operations
  { name: 'select', syntax: 'df.select("col1", "col2")', description: 'Select specific columns', category: 'column', needsColumns: true },
  { name: 'withColumn', syntax: 'df.withColumn("new", col("old")+1)', description: 'Add or update a column', category: 'column' },
  { name: 'drop', syntax: 'df.drop("col")', description: 'Drop a column', category: 'column', needsColumns: true },
  { name: 'withColumnRenamed', syntax: 'df.withColumnRenamed("old", "new")', description: 'Rename a column', category: 'column', needsColumns: true },
  { name: 'alias', syntax: 'df.select(col("col").alias("alias"))', description: 'Create an alias for a column', category: 'column', needsColumns: true },

  // Row Operations
  { name: 'filter/where', syntax: 'df.filter(df.age > 21)', description: 'Filter rows based on condition', category: 'row', needsColumns: true },
  { name: 'dropDuplicates', syntax: 'df.dropDuplicates()', description: 'Remove duplicate rows', category: 'row', needsColumns: true },
  { name: 'orderBy/sort', syntax: 'df.orderBy("col")', description: 'Sort rows by column', category: 'row', needsColumns: true },
  { name: 'limit', syntax: 'df.limit(10)', description: 'Limit the number of rows', category: 'row' },
  { name: 'sample', syntax: 'df.sample(False, 0.1)', description: 'Sample a fraction of rows', category: 'row' },
  { name: 'fillna/dropna', syntax: 'df.fillna(0), df.dropna()', description: 'Handle missing values', category: 'row', needsColumns: true },

  // Aggregation
  { name: 'groupBy', syntax: 'df.groupBy("col").agg(avg("col2"))', description: 'Group and aggregate data', category: 'aggregation', needsColumns: true },
  { name: 'agg', syntax: 'df.agg(max("col"))', description: 'Perform aggregation operations', category: 'aggregation', needsColumns: true },
  { name: 'pivot', syntax: 'df.groupBy().pivot().sum()', description: 'Create a pivot table', category: 'aggregation', needsColumns: true },

  // Join Operations
  { name: 'join', syntax: 'df1.join(df2, "key", "inner")', description: 'Join two DataFrames', category: 'join', needsColumns: true },
  { name: 'union/unionByName', syntax: 'df1.union(df2)', description: 'Combine two DataFrames', category: 'join' },

  // Other Operations
  { name: 'repartition/coalesce', syntax: 'df.repartition(10)', description: 'Change the number of partitions', category: 'other' },
  { name: 'explode', syntax: 'df.select(explode(df.col))', description: 'Flatten arrays or maps', category: 'other', needsColumns: true },
  { name: 'melt', syntax: 'df.selectExpr("stack(...)")', description: 'Unpivot columns to rows', category: 'other', needsColumns: true },
  { name: 'cache/persist', syntax: 'df.cache()', description: 'Cache DataFrame in memory', category: 'other' },
];

export const TransformationSelector: React.FC<TransformationSelectorProps> = ({
  onSelectTransformation,
  onCancel,
  workspaceUrl,
  token,
  prevDataframeName = "df"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransformation, setSelectedTransformation] = useState<TransformationOption | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const filteredTransformations = searchTerm 
    ? transformations.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transformations;

  const getTransformationsByCategory = (category: string) => {
    return filteredTransformations.filter(t => t.category === category);
  };

  const handleTransformationClick = (transformation: TransformationOption) => {
    setSelectedTransformation(transformation);
    
    if (transformation.needsColumns) {
      setShowColumnSelector(true);
    } else {
      onSelectTransformation(transformation);
    }
  };

  const handleColumnsSelected = (columns: string[]) => {
    if (selectedTransformation) {
      onSelectTransformation(selectedTransformation, columns);
    }
    setShowColumnSelector(false);
    setSelectedTransformation(null);
  };

  if (showColumnSelector && selectedTransformation) {
    return (
      <Card className="w-[550px] max-w-full">
        <CardHeader>
          <CardTitle className="text-lg">Select Columns for {selectedTransformation.name}</CardTitle>
          <CardDescription>Choose the columns to use with this transformation</CardDescription>
        </CardHeader>
        <CardContent>
          <DataframeColumnsSelector 
            workspaceUrl={workspaceUrl || null}
            token={token || null}
            dataframeName={prevDataframeName}
            onColumnsSelected={handleColumnsSelected}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowColumnSelector(false);
              setSelectedTransformation(null);
            }}
          >
            Back
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-[550px] max-w-full">
      <CardHeader>
        <CardTitle className="text-lg">Select Transformation</CardTitle>
        <CardDescription>Choose a Spark transformation to apply to your DataFrame</CardDescription>
        <Input
          placeholder="Search transformations..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="column">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="column">Column</TabsTrigger>
            <TabsTrigger value="row">Row</TabsTrigger>
            <TabsTrigger value="aggregation">Aggregation</TabsTrigger>
            <TabsTrigger value="join">Joins</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          {(['column', 'row', 'aggregation', 'join', 'other'] as const).map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {getTransformationsByCategory(category).map((transformation) => (
                    <div 
                      key={transformation.name}
                      className="border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      onClick={() => handleTransformationClick(transformation)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-sm">{transformation.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{transformation.description}</p>
                      <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-x-auto">
                        {transformation.syntax}
                      </pre>
                    </div>
                  ))}
                  
                  {getTransformationsByCategory(category).length === 0 && (
                    <div className="py-8 text-center text-sm text-slate-500">
                      No matching transformations found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end w-full">
          <Button variant="outline" onClick={onCancel} className="mr-2">
            Cancel
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
