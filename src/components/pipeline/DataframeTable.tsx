
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { TableIcon } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface DataframeTableProps {
  dataframeName: string;
  workspaceUrl: string | null;
  token: string | null;
  rows?: number;
}

export const DataframeTable: React.FC<DataframeTableProps> = ({
  dataframeName,
  workspaceUrl,
  token,
  rows = 20,
}) => {
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableData, setTableData] = useState<{ columns: string[], rows: any[][] } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDataframeData = async () => {
    if (!workspaceUrl || !token) {
      toast({
        title: "Connection error",
        description: "Missing Databricks connection information",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would make an API call to Databricks
      // to execute a command like df.limit(rows).toPandas().to_dict('records')
      // and return the data in a structured format
      
      // For demo purposes, we'll simulate a response with random data
      const mockColumns = ['id', 'name', 'age', 'city', 'country'];
      const mockRows = Array(Math.min(rows, 100)).fill(0).map((_, i) => [
        i + 1,
        `Person ${i + 1}`,
        20 + Math.floor(Math.random() * 50),
        ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'][Math.floor(Math.random() * 5)],
        ['USA', 'UK', 'Japan', 'France', 'Australia'][Math.floor(Math.random() * 5)]
      ]);

      // Simulate API delay
      setTimeout(() => {
        setTableData({
          columns: mockColumns,
          rows: mockRows
        });
        setLoading(false);
      }, 800);
      
      // In a real implementation, you would use code like this:
      /*
      const notebook_path = "/Users/temp_notebook_for_api_" + Date.now();
      
      // Create a temporary notebook
      await fetch(`${workspaceUrl}/api/2.0/workspace/import`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: notebook_path,
          format: 'SOURCE',
          language: 'PYTHON',
          content: Buffer.from(`
            result = ${dataframeName}.limit(${rows}).toPandas().to_dict('records')
            dbutils.notebook.exit(result)
          `).toString('base64'),
          overwrite: true
        }),
      });
      
      // Run the notebook to get the data
      const response = await fetch(`${workspaceUrl}/api/2.0/jobs/runs/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_name: `Show DataFrame ${dataframeName}`,
          tasks: [{
            task_key: "show_dataframe",
            notebook_task: {
              notebook_path: notebook_path
            },
            existing_cluster_id: "your_cluster_id"
          }]
        }),
      });
      
      // Process the response...
      */
    } catch (error) {
      console.error('Error fetching dataframe:', error);
      toast({
        title: "Failed to fetch data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowDataframe = () => {
    fetchDataframeData();
    setIsTableDialogOpen(true);
  };

  return (
    <>
      <Button 
        onClick={handleShowDataframe} 
        className="flex items-center gap-2"
        size="sm"
      >
        <TableIcon size={16} />
        {loading ? "Loading..." : `display(${dataframeName})`}
      </Button>
      
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>DataFrame: {dataframeName}</DialogTitle>
            <DialogDescription>
              Displaying up to {rows} rows of data
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : tableData ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableData.columns.map((column, index) => (
                      <TableHead key={index}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{String(cell)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsTableDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
