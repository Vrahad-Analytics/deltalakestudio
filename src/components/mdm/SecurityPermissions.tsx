
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Key, Lock, Plus } from "lucide-react";

export const SecurityPermissions = () => {
  const roles = [
    { id: 1, name: "Data Steward", users: 5, permissions: 8, status: "Active" },
    { id: 2, name: "Data Analyst", users: 12, permissions: 4, status: "Active" },
    { id: 3, name: "System Admin", users: 2, permissions: 15, status: "Active" },
    { id: 4, name: "Read Only", users: 25, permissions: 1, status: "Active" },
  ];

  const permissions = [
    { entity: "Customer", create: true, read: true, update: true, delete: false },
    { entity: "Product", create: true, read: true, update: true, delete: true },
    { entity: "Supplier", create: false, read: true, update: true, delete: false },
    { entity: "Category", create: true, read: true, update: false, delete: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Security & Access Control</h2>
        <Button size="sm">
          <Plus size={16} className="mr-2" />
          New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">4</div>
            <p className="text-xs text-slate-600">Configured roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">44</div>
            <p className="text-xs text-slate-600">With MDM access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <p className="text-xs text-slate-600">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">96%</div>
            <p className="text-xs text-slate-600">Security compliance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              User Roles
            </CardTitle>
            <CardDescription>Manage role-based access control</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.users}</TableCell>
                    <TableCell>{role.permissions}</TableCell>
                    <TableCell>
                      <Badge variant="default">{role.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Entity Permissions
            </CardTitle>
            <CardDescription>Configure access rights per entity type</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Create</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Update</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{perm.entity}</TableCell>
                    <TableCell>
                      {perm.create ? (
                        <Badge variant="default" className="text-xs">✓</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">✗</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {perm.read ? (
                        <Badge variant="default" className="text-xs">✓</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">✗</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {perm.update ? (
                        <Badge variant="default" className="text-xs">✓</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">✗</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {perm.delete ? (
                        <Badge variant="default" className="text-xs">✓</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">✗</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key size={20} />
            API Access Management
          </CardTitle>
          <CardDescription>Control programmatic access to master data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Lock size={20} className="text-blue-600" />
                <div>
                  <h4 className="font-medium">API Keys</h4>
                  <p className="text-sm text-gray-600">Active: 12</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">Manage Keys</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={20} className="text-green-600" />
                <div>
                  <h4 className="font-medium">Rate Limits</h4>
                  <p className="text-sm text-gray-600">1000/hour</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">Configure</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Users size={20} className="text-purple-600" />
                <div>
                  <h4 className="font-medium">Webhooks</h4>
                  <p className="text-sm text-gray-600">5 endpoints</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">Setup</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
