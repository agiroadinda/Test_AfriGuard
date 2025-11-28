import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import FeedbackService from '@/services/FeedbackService';
import { Feedback, FeedbackRating } from '@/types/Feedback';
import { TableLoadingSkeleton } from '@/components/LoadingSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<FeedbackRating | 'all'>('all');

  useEffect(() => {
    const loadFeedback = async () => {
      setIsLoading(true);
      try {
        const data = await FeedbackService.getFeedback();
        setFeedback(data);
        setFilteredFeedback(data);
      } catch (error) {
        console.error('Error loading feedback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, []);

  useEffect(() => {
    if (ratingFilter === 'all') {
      setFilteredFeedback(feedback);
    } else {
      setFilteredFeedback(feedback.filter(f => f.rating === ratingFilter));
    }
  }, [feedback, ratingFilter]);

  const positiveCount = feedback.filter(f => f.rating === 'positive').length;
  const negativeCount = feedback.filter(f => f.rating === 'negative').length;
  const satisfactionRate = feedback.length > 0 
    ? Math.round((positiveCount / feedback.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Feedback</h1>
        <p className="text-muted-foreground mt-1">Review user responses to verification results</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <ThumbsUp className="h-5 w-5 text-success" />
            <p className="text-sm text-muted-foreground">Positive Feedback</p>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{positiveCount}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <ThumbsDown className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">Negative Feedback</p>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{negativeCount}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{satisfactionRate}%</p>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-6">
        <div className="w-full md:w-64">
          <Label htmlFor="rating">Filter by Rating</Label>
          <Select value={ratingFilter} onValueChange={(value: any) => setRatingFilter(value)}>
            <SelectTrigger id="rating" className="mt-2">
              <SelectValue placeholder="All ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Feedback Table */}
      {isLoading ? (
        <TableLoadingSkeleton />
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {filteredFeedback.length} of {feedback.length} feedback items
          </div>
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Case ID</TableHead>
                  <TableHead className="text-muted-foreground">Rating</TableHead>
                  <TableHead className="text-muted-foreground">Comment</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map((item) => (
                  <TableRow key={item.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-mono text-sm text-card-foreground">
                      {item.caseId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1.5",
                          item.rating === 'positive' 
                            ? "bg-success/20 text-success-foreground border-success/30"
                            : "bg-destructive/20 text-destructive-foreground border-destructive/30"
                        )}
                      >
                        {item.rating === 'positive' ? (
                          <ThumbsUp className="h-3 w-3" />
                        ) : (
                          <ThumbsDown className="h-3 w-3" />
                        )}
                        {item.rating === 'positive' ? 'Positive' : 'Negative'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md text-card-foreground">
                      {item.comment || (
                        <span className="text-muted-foreground italic">No comment</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.submittedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
