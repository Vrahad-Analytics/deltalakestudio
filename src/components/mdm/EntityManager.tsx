
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Upload, Settings, RefreshCw, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Entity {
  id: number;
  name: string;
  type: string;
  records: number;
  lastSync: string;
  status: string;
  attributes?: number;
  relationships?: number;
}

interface EntityManagerProps {
  entities: Entity[];
  onEntityAction?: (entityId: number, action: string) => void;
}

export const EntityManager = ({ entities, onEntityAction }: EntityManagerProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Master Data Entities</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search entities..." className="pl-10 w-64" />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Upload size={16} className="mr-2" />
            Import Entity
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell className="font-medium">{entity.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {entity.type}
                    </span>
                  </TableCell>
                  <TableCell>{entity.records.toLocaleString()}</TableCell>
                  <TableCell>{entity.attributes || '-'}</TableCell>
                  <TableCell className="text-sm text-gray-600">{entity.lastSync}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entity.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      entity.status === 'Syncing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entity.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEntityAction?.(entity.id, 'configure')}>
                          <Settings size={14} className="mr-2" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEntityAction?.(entity.id, 'sync')}>
                          <RefreshCw size={14} className="mr-2" />
                          Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEntityAction?.(entity.id, 'view')}>
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
