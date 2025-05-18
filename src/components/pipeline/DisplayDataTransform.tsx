
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { TableIcon } from "lucide-react";

interface DisplayDataTransformProps {
  workspaceUrl: string;
  token: string;
}

export const DisplayDataTransform: React.FC<DisplayDataTransformProps> = ({
  workspaceUrl,
  token
}) => {
  const [dataframeName, setDataframeName] = useState('df');
  const [numRows, setNumRows] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);

  const handleDisplayData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would make an API call to the workspace
      // to fetch dataframe data. For now, we'll simulate a response.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast({
        title: "Data preview requested",
        description: `Displaying first ${numRows} rows of dataframe '${dataframeName}'`,
      });
      
      // Simulated data preview - in a real app, this would come from an API call
      setPreviewData([
        { id: 1, name: "Sample Data 1", value: 123 },
        { id: 2, name: "Sample Data 2", value: 456 },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data preview",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Data Preview</CardTitle>
        <CardDescription className="text-xs">
          Display a preview of your dataframe
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              className="h-8 text-xs"
              placeholder="DataFrame name"
              value={dataframeName}
              onChange={(e) => setDataframeName(e.target.value)}
            />
            
            <Input
              className="h-8 text-xs w-24"
              placeholder="Rows"
              type="number"
              min={1}
              max={100}
              value={numRows}
              onChange={(e) => setNumRows(parseInt(e.target.value) || 10)}
            />
          </div>
          
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs flex items-center justify-center gap-1 mt-1"
            onClick={handleDisplayData}
            disabled={isLoading}
          >
            <TableIcon className="h-3 w-3" />
            {isLoading ? 'Loading...' : 'Preview Data'}
          </Button>
        </div>
        
        {previewData && (
          <div className="mt-3 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    {Object.keys(previewData[0]).map(key => (
                      <th key={key} className="p-1 text-xs font-medium">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-700">
                      {Object.values(row).map((value: any, vidx) => (
                        <td key={vidx} className="p-1">{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
