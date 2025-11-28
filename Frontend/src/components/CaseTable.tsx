import { Case } from '@/types/Case';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Image, Video, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CaseTableProps {
  cases: Case[];
}

const mediaIcons = {
  image: Image,
  video: Video,
  audio: Mic,
};

const statusColors = {
  analyzing: 'bg-warning/20 text-warning-foreground border-warning/30',
  completed: 'bg-success/20 text-success-foreground border-success/30',
  failed: 'bg-destructive/20 text-destructive-foreground border-destructive/30',
};

export function CaseTable({ cases }: CaseTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Case ID</TableHead>
            <TableHead className="text-muted-foreground">Media Type</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Confidence</TableHead>
            <TableHead className="text-muted-foreground">Submitted</TableHead>
            <TableHead className="text-muted-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((case_) => {
            const MediaIcon = mediaIcons[case_.mediaType];
            return (
              <TableRow 
                key={case_.id} 
                className="border-border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/cases/${case_.id}`)}
              >
                <TableCell className="font-mono text-sm text-card-foreground">
                  {case_.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MediaIcon className="h-4 w-4 text-primary" />
                    <span className="capitalize text-card-foreground">{case_.mediaType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusColors[case_.status])}>
                    {case_.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          case_.confidence > 70 ? "bg-destructive" : 
                          case_.confidence > 40 ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${case_.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-card-foreground">
                      {case_.confidence}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(case_.submittedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cases/${case_.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
