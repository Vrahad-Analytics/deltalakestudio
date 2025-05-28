
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, GitMerge } from "lucide-react";

interface DuplicateGroup {
  id: number;
  entity: string;
  field: string;
  count: number;
  confidence: number;
  action: string;
}

interface DeduplicationManagerProps {
  duplicates: DuplicateGroup[];
}

export const DeduplicationManager = ({ duplicates }: DeduplicationManagerProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Duplicate Detection & Resolution</h2>
        <Button size="sm">
          <RefreshCw size={16} className="mr-2" />
          Run Detection
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Duplicates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">46</div>
            <p className="text-xs text-slate-600">Across all entities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Auto-Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">23</div>
            <p className="text-xs text-slate-600">High confidence matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <p className="text-xs text-slate-600">Manual review required</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Duplicate Groups</CardTitle>
          <CardDescription>Potential duplicates requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity</TableHead>
                <TableHead>Matching Field</TableHead>
                <TableHead>Duplicate Count</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Suggested Action</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {duplicates.map((duplicate) => (
                <TableRow key={duplicate.id}>
                  <TableCell className="font-medium">{duplicate.entity}</TableCell>
                  <TableCell>{duplicate.field}</TableCell>
                  <TableCell>{duplicate.count}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      duplicate.confidence > 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {duplicate.confidence}%
                    </span>
                  </TableCell>
                  <TableCell>{duplicate.action}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <GitMerge size={14} className="mr-1" />
                        Merge
                      </Button>
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </div>
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
