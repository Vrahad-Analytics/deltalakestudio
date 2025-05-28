
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export const DataGovernance = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Governance</h2>
        <Button size="sm">
          <Shield size={16} className="mr-2" />
          New Policy
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Lineage</CardTitle>
            <CardDescription>Track data flow and transformations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="font-medium">Source Systems</span>
                <span className="text-sm text-slate-600">12 connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="font-medium">Data Pipelines</span>
                <span className="text-sm text-slate-600">8 active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="font-medium">Target Systems</span>
                <span className="text-sm text-slate-600">5 connected</span>
              </div>
              <Button variant="outline" className="w-full">View Lineage Map</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Policies</CardTitle>
            <CardDescription>Active governance policies and rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <div>
                  <div className="font-medium">PII Protection</div>
                  <div className="text-sm text-slate-600">Personal data masking</div>
                </div>
                <span className="text-green-600 text-sm">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <div>
                  <div className="font-medium">Data Retention</div>
                  <div className="text-sm text-slate-600">7-year retention policy</div>
                </div>
                <span className="text-green-600 text-sm">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
                <div>
                  <div className="font-medium">Access Control</div>
                  <div className="text-sm text-slate-600">Role-based permissions</div>
                </div>
                <span className="text-green-600 text-sm">Active</span>
              </div>
              <Button variant="outline" className="w-full">Manage Policies</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Dashboard</CardTitle>
          <CardDescription>Monitor regulatory compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-slate-600">GDPR Compliance</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-slate-600">SOX Compliance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="text-2xl font-bold text-purple-600">92%</div>
              <div className="text-sm text-slate-600">HIPAA Compliance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
