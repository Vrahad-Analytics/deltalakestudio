import React from 'react';
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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Code } from "lucide-react";
import { S3MountFormValues } from './types';

// Define the form schema
const mountS3Schema = z.object({
  access_key: z.string().min(1, "AWS Access Key is required"),
  secret_key: z.string().min(1, "AWS Secret Key is required"),
  aws_bucket_name: z.string().min(1, "S3 Bucket name is required"),
  mount_name: z.string().min(1, "Mount name is required"),
});

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
      mount_name: ""
    }
  });

  // Handle form submission
  const onSubmit = (values: S3MountFormValues) => {
    try {
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
    if (!values.access_key || !values.secret_key || !values.aws_bucket_name || !values.mount_name) {
      return "# Please fill all fields to generate mount code";
    }

    return `# Mount S3 bucket
access_key = "${values.access_key}"
secret_key = "${values.secret_key}"
encoded_secret_key = secret_key.replace("/", "%2F")
aws_bucket_name = "${values.aws_bucket_name}"
mount_name = "${values.mount_name}"

# Create the mount
dbutils.fs.mount("s3a://%s:%s@%s" % (access_key, encoded_secret_key, aws_bucket_name), "/mnt/%s" % mount_name)

# List files in the mounted bucket
# display(dbutils.fs.ls("/mnt/%s" % mount_name))`;
  };

  // Preview code based on current form values
  const previewCode = generateMountCode(form.watch());

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mount AWS S3 Bucket</DialogTitle>
          <DialogDescription>
            Configure AWS S3 credentials and mounting options
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="access_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AWS Access Key</FormLabel>
                  <FormControl>
                    <Input placeholder="AKIAIOSFODNN7EXAMPLE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secret_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AWS Secret Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" {...field} />
                  </FormControl>
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
                  <FormLabel>Mount Name</FormLabel>
                  <FormControl>
                    <Input placeholder="my-mount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md border">
              <div className="flex items-center mb-2">
                <Code size={16} className="mr-2" />
                <h3 className="text-sm font-medium">Generated Mount Code</h3>
              </div>
              <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto">
                {previewCode}
              </pre>
            </div>

            <DialogFooter>
              <Button type="submit">Create Mount Configuration</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
