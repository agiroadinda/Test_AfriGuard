import { useEffect, useState } from 'react';
import { CaseTable } from '@/components/CaseTable';
import { TableLoadingSkeleton } from '@/components/LoadingSkeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CaseService from '@/services/CaseService';
import { Case, MediaType, CaseStatus } from '@/types/Case';
import { Filter } from 'lucide-react';

export default function Cases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const loadCases = async () => {
      setIsLoading(true);
      try {
        const data = await CaseService.getCases();
        setCases(data);
        setFilteredCases(data);
      } catch (error) {
        console.error('Error loading cases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCases();
  }, []);

  useEffect(() => {
    let filtered = [...cases];

    if (mediaTypeFilter !== 'all') {
      filtered = filtered.filter(c => c.mediaType === mediaTypeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(c => 
        c.submittedAt.startsWith(dateFilter)
      );
    }

    setFilteredCases(filtered);
  }, [cases, mediaTypeFilter, statusFilter, dateFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Case History</h1>
        <p className="text-muted-foreground mt-1">View and manage all verification cases</p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Filters</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="mediaType">Media Type</Label>
            <Select value={mediaTypeFilter} onValueChange={(value: any) => setMediaTypeFilter(value)}>
              <SelectTrigger id="mediaType">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="analyzing">Analyzing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div>
        {isLoading ? (
          <TableLoadingSkeleton />
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredCases.length} of {cases.length} cases
            </div>
            <CaseTable cases={filteredCases} />
          </>
        )}
      </div>
    </div>
  );
}
