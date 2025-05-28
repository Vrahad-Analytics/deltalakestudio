
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Database, Link, Code } from "lucide-react";

export const DataModelingStudio = () => {
  const entityTypes = [
    { id: 1, name: "Customer", attributes: 15, relationships: 3, status: "Active" },
    { id: 2, name: "Product", attributes: 22, relationships: 5, status: "Active" },
    { id: 3, name: "Supplier", attributes: 12, relationships: 2, status: "Draft" },
    { id: 4, name: "Category", attributes: 8, relationships: 1, status: "Active" },
  ];

  const relationships = [
    { from: "Customer", to: "Order", type: "One-to-Many", status: "Active" },
    { from: "Product", to: "Category", type: "Many-to-One", status: "Active" },
    { from: "Supplier", to: "Product", type: "One-to-Many", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Modeling Studio</h2>
        <Button size="sm">
          <Plus size={16} className="mr-2" />
          New Entity Type
        </Button>
      </div>

      <Tabs defaultValue="entities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entities">Entity Types</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="schema">Schema View</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entityTypes.map((entity) => (
              <Card key={entity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{entity.name}</CardTitle>
                    <Badge variant={entity.status === 'Active' ? 'default' : 'secondary'}>
                      {entity.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Attributes</span>
                      <span className="font-medium">{entity.attributes}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Relationships</span>
                      <span className="font-medium">{entity.relationships}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Database size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Code size={14} className="mr-1" />
                        Schema
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entity Relationships</CardTitle>
              <CardDescription>Define how entities connect to each other</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {relationships.map((rel, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{rel.from}</span>
                      <Link size={16} className="text-gray-400" />
                      <span className="font-medium">{rel.to}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{rel.type}</Badge>
                      <Badge variant={rel.status === 'Active' ? 'default' : 'secondary'}>
                        {rel.status}
                      </Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schema Visualization</CardTitle>
              <CardDescription>Visual representation of your data model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Database size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Schema Diagram</p>
                  <p className="text-sm">Interactive data model visualization will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
