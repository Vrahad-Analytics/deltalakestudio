
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export const DataIntegration = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Integration</h2>
        <Button size="sm">
          <Database size={16} className="mr-2" />
          New Connection
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Connections</CardTitle>
            <CardDescription>Connected data sources and targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Database size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Databricks Delta Lake</div>
                    <div className="text-sm text-slate-600">Primary data warehouse</div>
                  </div>
                </div>
                <span className="text-green-600 text-sm">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <Database size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Salesforce CRM</div>
                    <div className="text-sm text-slate-600">Customer data source</div>
                  </div>
                </div>
                <span className="text-green-600 text-sm">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                    <Database size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">SAP ERP</div>
                    <div className="text-sm text-slate-600">Enterprise resource planning</div>
                  </div>
                </div>
                <span className="text-yellow-600 text-sm">Syncing</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Flows</CardTitle>
            <CardDescription>Real-time and batch data flows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Customer Master Sync</span>
                  <span className="text-green-600 text-sm">Running</span>
                </div>
                <div className="text-sm text-slate-600">Salesforce → Delta Lake</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Product Catalog Sync</span>
                  <span className="text-blue-600 text-sm">Scheduled</span>
                </div>
                <div className="text-sm text-slate-600">SAP ERP → Delta Lake</div>
                <div className="mt-2 text-sm text-slate-500">Next run: 2025-01-28 02:00</div>
              </div>
              <div className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Financial Data Export</span>
                  <span className="text-purple-600 text-sm">Completed</span>
                </div>
                <div className="text-sm text-slate-600">Delta Lake → Analytics Platform</div>
                <div className="mt-2 text-sm text-slate-500">Last run: 2025-01-27 23:30</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Management</CardTitle>
          <CardDescription>Manage data APIs and endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-slate-600">Active APIs</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-slate-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="text-2xl font-bold text-purple-600">2.3M</div>
              <div className="text-sm text-slate-600">Requests/month</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded">
              <div className="text-2xl font-bold text-orange-600">145ms</div>
              <div className="text-sm text-slate-600">Avg Response</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
