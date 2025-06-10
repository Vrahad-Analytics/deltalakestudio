import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from "@/components/ui/form";
import { DataframeTable } from './DataframeTable';
import { useForm } from "react-hook-form";

interface DataframeDisplayFormValues {
  dataframeName: string;
  rows: number;
}

interface DataframeDisplayDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filename: string | null;
}

export const DataframeDisplayDialog: React.FC<DataframeDisplayDialogProps> = ({
  isOpen,
  onOpenChange,
  filename
}) => {
  const form = useForm<DataframeDisplayFormValues>({
    defaultValues: {
      dataframeName: "df",
      rows: 20
    }
  });

  const onSubmit = (data: DataframeDisplayFormValues) => {
    // This just keeps the dialog open, as the table will display inside the dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Display DataFrame</DialogTitle>
          <DialogDescription>
            Enter the name of the DataFrame and number of rows to display
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dataframeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DataFrame Name</FormLabel>
                  <FormControl>
                    <Input placeholder="df" {...field} onClick={e => e.stopPropagation()} />
                  </FormControl>
                  <FormDescription>
                    Enter the variable name of your DataFrame (e.g., df)
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Rows</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={1000}
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 20)}
                      onClick={e => e.stopPropagation()}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of rows to show (1-1000)
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <DataframeTable
                dataframeName={form.watch('dataframeName')}
                rows={form.watch('rows')}
                filename={filename}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
