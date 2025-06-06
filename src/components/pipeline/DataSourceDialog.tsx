
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataSourceFormValues, CloudStorageProvider } from './types';

interface DataSourceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DataSourceFormValues) => void;
  defaultValues?: DataSourceFormValues;
  setUploadedFilename?: (filename: string | null) => void;
}

export const DataSourceDialog: React.FC<DataSourceDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit,
  defaultValues = {
    fileFormat: 'csv',
    filePath: 'path/to/file.csv',
    hasHeader: true,
    inferSchema: true,
    multiLine: false,
    cloudProvider: 'local'
  },
  setUploadedFilename
}) => {
  // --- Added state for upload ---
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const form = useForm<DataSourceFormValues>({
    defaultValues
  });

  // Get the currently selected cloud provider
  const cloudProvider = form.watch("cloudProvider");
  const fileFormat = form.watch("fileFormat");
  
  // Update file path placeholder based on selected cloud provider
  useEffect(() => {
    const currentPath = form.getValues("filePath");
    const isDefaultOrEmpty = !currentPath || currentPath === 'path/to/file.csv';
    
    if (isDefaultOrEmpty) {
      let placeholder = '';
      const extension = fileFormat || 'csv';
      
      switch(cloudProvider) {
        case 's3':
          placeholder = `s3a://bucket/path/file.${extension}`;
          break;
        case 'adls':
          placeholder = `abfss://container@account.dfs.core.windows.net/path/file.${extension}`;
          break;
        case 'gcs':
          placeholder = `gs://bucket/path/file.${extension}`;
          break;
        case 'azure-blob':
          placeholder = `/mnt/mount-name/path/file.${extension}`;
          break;
        default:
          placeholder = `path/to/file.${extension}`;
          break;
      }
      
      form.setValue("filePath", placeholder);
    }
  }, [cloudProvider, fileFormat, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Data Source</DialogTitle>
          <DialogDescription>
            Select the data format and configure options for your data source.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cloudProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cloud Storage Provider</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cloud provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="local">Local File System</SelectItem>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="adls">Azure Data Lake Storage Gen2</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      <SelectItem value="azure-blob">Azure Blob Storage (Mounted)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose where your data is stored
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fileFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Format</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select file format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="parquet">Parquet</SelectItem>
                      <SelectItem value="orc">ORC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the format of your data file
                  </FormDescription>
                </FormItem>
              )}
            />
            
            {cloudProvider === 'local' && fileFormat === 'csv' ? (
  <FormItem>
    <FormLabel>Upload CSV File</FormLabel>
    <FormControl>
      <>
        <input
          type="file"
          accept=".csv"
          onChange={async (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              setUploadedFile(file);
              setUploadStatus('Uploading...');
              const formData = new FormData();
              formData.append('file', file);
              try {
                const response = await fetch('/api/upload-csv', {
                  method: 'POST',
                  body: formData
                });
                if (response.ok) {
                  const data = await response.json();
                  setUploadStatus('Uploaded: ' + file.name);
                  form.setValue('filePath', data.filename);
                  if (typeof setUploadedFilename === 'function') {
                    setUploadedFilename(data.filename);
                  }
                } else {
                  setUploadStatus('Upload failed');
                }
              } catch (err) {
                setUploadStatus('Upload failed');
              }
            }
          }}
        />
        {uploadStatus && (
          <div className="text-green-600 text-sm mt-2">{uploadStatus}</div>
        )}
      </>
    </FormControl>
    <FormDescription>
      Select a local CSV file to upload.
    </FormDescription>
  </FormItem>
) : (
  <FormField
    control={form.control}
    name="filePath"
    render={({ field }) => (
      <FormItem>
        <FormLabel>File Path</FormLabel>
        <FormControl>
          <Input placeholder="path/to/file.csv" {...field} />
        </FormControl>
        <FormDescription>
          {cloudProvider === 's3' && "Enter S3 path (e.g., s3a://bucket/path/file.csv)"}
          {cloudProvider === 'adls' && "Enter ADLS Gen2 path (e.g., abfss://container@account.dfs.core.windows.net/path/)"}
          {cloudProvider === 'gcs' && "Enter GCS path (e.g., gs://bucket/path/file.csv)"}
          {cloudProvider === 'azure-blob' && "Enter mounted path (e.g., /mnt/mount-name/path/file.csv)"}
          {cloudProvider === 'local' && "Enter local file path (e.g., /path/to/file.csv)"}
        </FormDescription>
      </FormItem>
    )}
  />
)}
            
            {form.watch("fileFormat") === "csv" && (
              <>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="hasHeader"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium leading-none">
                          Has Header
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inferSchema"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium leading-none">
                          Infer Schema
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            
            {form.watch("fileFormat") === "json" && (
              <FormField
                control={form.control}
                name="multiLine"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Multi-line JSON</FormLabel>
                      <FormDescription>
                        Enable for JSON records that span multiple lines
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                Save Configuration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
