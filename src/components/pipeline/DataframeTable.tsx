
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
  filename: string | null;
  rows?: number;
}

export const DataframeTable: React.FC<DataframeTableProps> = ({
  dataframeName,
  filename,
  rows = 20,
}) => {
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [tableData, setTableData] = useState<{ columns: string[], rows: any[][] } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDataframeData = async () => {
    if (!filename) {
      toast({
        title: "No file uploaded",
        description: "Please upload a CSV file first.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/display-dataframe', {
        method: 'POST',
        body: new URLSearchParams({
          filename: filename,
          df_name: dataframeName,
          nrows: String(rows)
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTableData({
          columns: data.columns,
          rows: data.data.map(row => data.columns.map(col => row[col]))
        });
      } else {
        toast({
          title: "Failed to fetch data",
          description: "Backend error.",
          variant: "destructive",
        });
      }
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
