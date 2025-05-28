
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MoreHorizontal } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { EntityManager } from "@/components/mdm/EntityManager";
import { DataQualityDashboard } from "@/components/mdm/DataQualityDashboard";
import { DeduplicationManager } from "@/components/mdm/DeduplicationManager";
import { DataGovernance } from "@/components/mdm/DataGovernance";
import { DataIntegration } from "@/components/mdm/DataIntegration";
import { DataModelingStudio } from "@/components/mdm/DataModelingStudio";
import { AuditTrail } from "@/components/mdm/AuditTrail";
import { SecurityPermissions } from "@/components/mdm/SecurityPermissions";

const MasterDataManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("entities");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Mock data for demonstration
  const entities = [
    { id: 1, name: "Products", type: "Catalog", records: 15420, lastSync: "2025-01-27 14:30", status: "Active", attributes: 24, relationships: 3 },
    { id: 2, name: "Customers", type: "CRM", records: 8750, lastSync: "2025-01-27 15:15", status: "Active", attributes: 18, relationships: 2 },
    { id: 3, name: "Suppliers", type: "Supply Chain", records: 1250, lastSync: "2025-01-27 13:45", status: "Syncing", attributes: 15, relationships: 1 },
    { id: 4, name: "Categories", type: "Catalog", records: 450, lastSync: "2025-01-27 16:00", status: "Active", attributes: 8, relationships: 1 },
  ];

  const duplicates = [
    { id: 1, entity: "Products", field: "SKU", count: 23, confidence: 95, action: "Merge" },
    { id: 2, entity: "Customers", field: "Email", count: 15, confidence: 89, action: "Review" },
    { id: 3, entity: "Suppliers", field: "Company Name", count: 8, confidence: 92, action: "Merge" },
  ];

  const dataQuality = [
    { entity: "Products", completeness: 85, accuracy: 92, consistency: 78, validity: 95 },
    { entity: "Customers", completeness: 92, accuracy: 88, consistency: 85, validity: 90 },
    { entity: "Suppliers", completeness: 78, accuracy: 85, consistency: 82, validity: 88 },
  ];

  const auditEntries = [
    { id: 1, timestamp: "2025-01-27 15:30:22", user: "john.doe", action: "UPDATE", entity: "Customer", recordId: "CUST-001", changes: 3, status: "Success" as const },
    { id: 2, timestamp: "2025-01-27 15:28:15", user: "jane.smith", action: "CREATE", entity: "Product", recordId: "PROD-542", changes: 12, status: "Success" as const },
    { id: 3, timestamp: "2025-01-27 15:25:08", user: "mike.wilson", action: "DELETE", entity: "Supplier", recordId: "SUPP-089", changes: 1, status: "Failed" as const },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('databricks_url');
    sessionStorage.removeItem('databricks_token');
    sessionStorage.removeItem('guest_mode');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const handleEntityAction = (entityId: number, action: string) => {
    toast({
      title: "Entity Action",
      description: `${action} action triggered for entity ${entityId}`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
                <MoreHorizontal size={20} />
              </Button>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetContent side="right" className="w-[250px] sm:max-w-none py-8">
                  <div className="flex flex-col space-y-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-start gap-2"
                    >
                      <Home size={18} />
                      <span>Dashboard</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Master Data Management</h1>
          <p className="text-slate-600 dark:text-slate-300">
            AtroCore-powered unified data governance, quality management, and integration platform
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="modeling">Modeling</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="deduplication">De-duplication</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="entities">
            <EntityManager entities={entities} onEntityAction={handleEntityAction} />
          </TabsContent>

          <TabsContent value="modeling">
            <DataModelingStudio />
          </TabsContent>

          <TabsContent value="quality">
            <DataQualityDashboard qualityMetrics={dataQuality} />
          </TabsContent>

          <TabsContent value="deduplication">
            <DeduplicationManager duplicates={duplicates} />
          </TabsContent>

          <TabsContent value="governance">
            <DataGovernance />
          </TabsContent>

          <TabsContent value="integration">
            <DataIntegration />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTrail entries={auditEntries} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityPermissions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MasterDataManagement;
