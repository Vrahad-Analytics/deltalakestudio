
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WarehouseFormValues } from "./types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  cluster_size: z.string(),
  max_num_clusters: z.number().int().min(1).max(30),
  auto_stop_mins: z.number().int().min(0).max(120),
  enable_photon: z.boolean().default(true),
  spot_instance_policy: z.enum(["RELIABILITY_OPTIMIZED", "COST_OPTIMIZED"]),
  warehouse_type: z.enum(["PRO", "CLASSIC", "SERVERLESS"])
});

interface WarehouseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: WarehouseFormValues) => void;
  isLoading?: boolean;
  defaultValues?: Partial<WarehouseFormValues>;
}

export const WarehouseDialog: React.FC<WarehouseDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading = false,
  defaultValues = {
    name: "my-warehouse",
    cluster_size: "SMALL",
    max_num_clusters: 1,
    auto_stop_mins: 30,
    enable_photon: true,
    spot_instance_policy: "RELIABILITY_OPTIMIZED",
    warehouse_type: "PRO"
  }
}) => {
  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const handleSubmit = (values: WarehouseFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configure Databricks Warehouse</DialogTitle>
          <DialogDescription>
            Configure your SQL warehouse for interactive data analytics.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>A unique name for your SQL warehouse</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="warehouse_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PRO">Pro</SelectItem>
                      <SelectItem value="CLASSIC">Classic</SelectItem>
                      <SelectItem value="SERVERLESS">Serverless</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Type of SQL warehouse to create</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cluster_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cluster Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cluster size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2X-SMALL">2X-Small</SelectItem>
                      <SelectItem value="X-SMALL">X-Small</SelectItem>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LARGE">Large</SelectItem>
                      <SelectItem value="X-LARGE">X-Large</SelectItem>
                      <SelectItem value="2X-LARGE">2X-Large</SelectItem>
                      <SelectItem value="3X-LARGE">3X-Large</SelectItem>
                      <SelectItem value="4X-LARGE">4X-Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Size of the clusters used in the SQL warehouse</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_num_clusters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Clusters</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription>Maximum number of clusters (1-30)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="auto_stop_mins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auto Stop (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription>Time before auto-stopping when idle</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="spot_instance_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spot Instance Policy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RELIABILITY_OPTIMIZED">Reliability Optimized</SelectItem>
                      <SelectItem value="COST_OPTIMIZED">Cost Optimized</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Prioritize reliability or cost savings</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enable_photon"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Photon</FormLabel>
                    <FormDescription>
                      Photon is a vectorized query engine for accelerated performance
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Warehouse'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
