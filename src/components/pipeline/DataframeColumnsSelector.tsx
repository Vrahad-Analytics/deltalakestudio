
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckIcon } from "lucide-react";

interface DataframeColumnsSelectorProps {
  workspaceUrl: string | null;
  token: string | null;
  dataframeName: string;
  onColumnsSelected: (columns: string[]) => void;
  initialSelectedColumns?: string[];
}

export const DataframeColumnsSelector: React.FC<DataframeColumnsSelectorProps> = ({
  workspaceUrl,
  token,
  dataframeName,
  onColumnsSelected,
  initialSelectedColumns = []
}) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(initialSelectedColumns);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceUrl && token && dataframeName) {
      fetchColumns();
    }
  }, [workspaceUrl, token, dataframeName]);

  const fetchColumns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, this would make an API call to the workspace
      // to fetch column names from the dataframe
      // For now, we'll simulate a response with sample column names
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulated columns - in a real app, these would come from an API call
      const sampleColumns = [
        'id', 'name', 'age', 'gender', 'city', 'state', 
        'country', 'email', 'phone', 'date', 'amount', 
        'category', 'status', 'created_at', 'updated_at'
      ];
      
      setColumns(sampleColumns);
    } catch (err) {
      setError("Failed to fetch dataframe columns");
      toast({
        title: "Error",
        description: "Failed to fetch dataframe columns",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleApply = () => {
    onColumnsSelected(selectedColumns);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Select Columns from {dataframeName}</h3>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      
      {error && (
        <div className="text-xs text-red-500">{error}</div>
      )}
      
      <ScrollArea className="h-[200px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : columns.length > 0 ? (
          <div className="space-y-2">
            {columns.map(column => (
              <div key={column} className="flex items-center space-x-2">
                <Checkbox 
                  id={`column-${column}`}
                  checked={selectedColumns.includes(column)} 
                  onCheckedChange={() => toggleColumn(column)}
                />
                <label 
                  htmlFor={`column-${column}`}
                  className="text-sm cursor-pointer"
                >
                  {column}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-slate-500">
            No columns found. Please verify the dataframe exists.
          </div>
        )}
      </ScrollArea>
      
      <div className="flex justify-between">
        <div className="text-xs text-slate-500">
          {selectedColumns.length} column{selectedColumns.length !== 1 ? 's' : ''} selected
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleApply}
          disabled={isLoading || selectedColumns.length === 0}
          className="text-xs"
        >
          <CheckIcon className="h-3 w-3 mr-1" />
          Apply Selection
        </Button>
      </div>
    </div>
  );
};
