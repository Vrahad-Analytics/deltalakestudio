import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Code, Eye, EyeOff, Key, Copy, Check, Edit, Play, Database } from "lucide-react";
import { S3MountFormValues } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the form schema
const mountS3Schema = z.object({
  access_key: z.string().min(1, "AWS Access Key is required"),
  secret_key: z.string().min(1, "AWS Secret Key is required"),
  aws_bucket_name: z.string().min(1, "S3 Bucket name is required"),
  mount_name: z.string().optional(),
  show_display_command: z.boolean().default(false)
});

// Define a type for the code action buttons
type CodeAction = 'copy' | 'edit' | 'execute';

interface MountS3DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMount: (values: S3MountFormValues) => void;
}

export const MountS3Dialog: React.FC<MountS3DialogProps> = ({
  isOpen,
  onOpenChange,
  onMount
}) => {
  // Initialize the form
  const form = useForm<S3MountFormValues>({
    resolver: zodResolver(mountS3Schema),
    defaultValues: {
      access_key: "",
      secret_key: "",
      aws_bucket_name: "",
      mount_name: "",
      show_display_command: false
    }
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("form");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const editableCodeRef = useRef<HTMLTextAreaElement>(null);

  // Update mount_name when bucket name changes
  const bucketName = form.watch('aws_bucket_name');
  const mountName = form.watch('mount_name');

  useEffect(() => {
    if (bucketName && !mountName) {
      form.setValue('mount_name', bucketName);
    }
  }, [bucketName, mountName, form]);

  // Handle form submission
  const onSubmit = (values: S3MountFormValues) => {
    try {
      // If mount_name is empty, use bucket name
      if (!values.mount_name) {
        values.mount_name = values.aws_bucket_name;
      }
      
      onMount(values);
      toast({
        title: "S3 Mount Configuration",
        description: `Mount configuration for ${values.aws_bucket_name} created successfully`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create mount configuration",
        variant: "destructive",
      });
    }
  };

  // Generate mount code snippet
  const generateMountCode = (values: S3MountFormValues): string => {
    if (!values.access_key || !values.secret_key || !values.aws_bucket_name) {
      return "# Please fill all required fields to generate mount code";
    }

    const effectiveMountName = values.mount_name || values.aws_bucket_name;
    
    let code = `access_key = "${values.access_key}"
secret_key = "${values.secret_key}"
encoded_secret_key = secret_key.replace("/", "%2F")
aws_bucket_name = "${values.aws_bucket_name}"
mount_name = "${effectiveMountName}"

dbutils.fs.mount("s3a://%s:%s@%s" % (access_key, encoded_secret_key, aws_bucket_name), "/mnt/%s" % mount_name)`;

    if (values.show_display_command) {
      code += `

display(dbutils.fs.ls("/mnt/%s" % mount_name))`;
    } else {
      code += `

#display(dbutils.fs.ls("/mnt/%s" % mount_name))`;
    }
    
    return code;
  };
  
  // Handle code actions (copy, edit, execute)
  const handleCodeAction = (action: CodeAction) => {
    switch (action) {
      case 'copy':
        if (codeRef.current) {
          navigator.clipboard.writeText(codeRef.current.textContent || '');
          setCopiedCode(true);
          setTimeout(() => setCopiedCode(false), 2000);
          toast({
            title: "Code copied",
            description: "Mount code copied to clipboard",
          });
        }
        break;
      case 'edit':
        setIsEditing(true);
        setActiveTab("code");
        if (editableCodeRef.current) {
          editableCodeRef.current.value = previewCode;
        }
        break;
      case 'execute':
        // Submit the form with current values
        form.handleSubmit(onSubmit)();
        toast({
          title: "Executing mount code",
          description: "Preparing to execute the S3 mount code",
        });
        break;
    }
  };
  
  // Save edited code
  const saveEditedCode = () => {
    if (editableCodeRef.current) {
      // Here you would parse the edited code and update form values
      // For simplicity, we'll just show a toast
      toast({
        title: "Code updated",
        description: "Your changes have been saved",
      });
      setIsEditing(false);
    }
  };

  // Preview code based on current form values
  const previewCode = generateMountCode(form.watch());

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Mount AWS S3 Bucket
          </DialogTitle>
          <DialogDescription>
            Configure AWS S3 credentials and mounting options
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Configuration</TabsTrigger>
            <TabsTrigger value="code">Code Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4 mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="access_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Key size={16} className="text-slate-500" />
                    AWS Access Key
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showAccessKey ? "text" : "password"} 
                        placeholder="AKIAIOSFODNN7EXAMPLE" 
                        {...field} 
                        className="pr-10"
                      />
                    </FormControl>
                    <button 
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowAccessKey(!showAccessKey)}
                    >
                      {showAccessKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FormDescription>
                    Your AWS IAM Access Key ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secret_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Key size={16} className="text-slate-500" />
                    AWS Secret Key
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showSecretKey ? "text" : "password"} 
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" 
                        {...field} 
                        className="pr-10"
                      />
                    </FormControl>
                    <button 
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                    >
                      {showSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FormDescription>
                    Your AWS IAM Secret Access Key
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aws_bucket_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>S3 Bucket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="my-spark-bucket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mount_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mount Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Leave blank to use bucket name" {...field} />
                  </FormControl>
                  <FormDescription>
                    If left blank, the bucket name will be used as the mount name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="show_display_command"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Include display command
                    </FormLabel>
                    <FormDescription>
                      Show the contents of the mounted directory after mounting
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

                <DialogFooter className="mt-4">
                  <Button 
                    type="submit" 
                    className="flex items-center gap-2"
                  >
                    <Key size={16} />
                    Create Mount with Credentials
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4 mt-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Code size={18} className="mr-2 text-blue-500" />
                  <h3 className="text-sm font-medium">S3 Mount Code</h3>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCodeAction('copy')}
                    className="flex items-center gap-1 h-8"
                  >
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode ? 'Copied' : 'Copy'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCodeAction('edit')}
                    className="flex items-center gap-1 h-8"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCodeAction('execute')}
                    className="flex items-center gap-1 h-8"
                  >
                    <Play size={14} />
                    Execute
                  </Button>
                </div>
              </div>
              
              {isEditing ? (
                <div className="relative">
                  <textarea
                    ref={editableCodeRef}
                    className="w-full h-64 font-mono text-xs p-3 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre-wrap overflow-x-auto"
                    defaultValue={previewCode}
                    style={{ maxWidth: '100%', wordBreak: 'break-word' }}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={saveEditedCode}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-64 overflow-hidden">
                  <pre 
                    ref={codeRef}
                    className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-x-auto h-full font-mono border border-slate-200 dark:border-slate-700 whitespace-pre-wrap"
                    style={{ maxWidth: '100%', wordBreak: 'break-word' }}
                  >
                    {previewCode}
                  </pre>
                </div>
              )}
              
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                <p>This code will mount your S3 bucket to the specified mount point in Databricks.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("form")}
              >
                Back to Configuration
              </Button>
              <Button 
                type="button" 
                onClick={() => form.handleSubmit(onSubmit)()}
                className="flex items-center gap-2"
              >
                <Key size={16} />
                Create Mount
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
