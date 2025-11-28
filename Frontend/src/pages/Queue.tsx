import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Image, Video, Mic, Loader2 } from 'lucide-react';
import QueueService from '@/services/QueueService';
import { QueueItem } from '@/types/Queue';
import { cn } from '@/lib/utils';

const mediaIcons = {
  image: Image,
  video: Video,
  audio: Mic,
};

const statusLabels = {
  preprocessing: 'Preprocessing',
  analyzing: 'Analyzing',
  llm_explaining: 'Generating Explanation',
  sending_result: 'Sending Result',
};

const statusColors = {
  preprocessing: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  analyzing: 'bg-warning/20 text-warning-foreground border-warning/30',
  llm_explaining: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  sending_result: 'bg-success/20 text-success-foreground border-success/30',
};

export default function Queue() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  useEffect(() => {
    QueueService.connect((items) => {
      setQueueItems(items);
    });

    return () => {
      QueueService.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Real-Time Queue</h1>
          <p className="text-muted-foreground mt-1">Live monitoring of verification processing</p>
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-foreground">Live Updates</span>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Items in Queue</p>
            <p className="text-3xl font-bold text-card-foreground mt-2">{queueItems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Average Progress</p>
            <p className="text-3xl font-bold text-card-foreground mt-2">
              {queueItems.length > 0 
                ? Math.round(queueItems.reduce((sum, item) => sum + item.progress, 0) / queueItems.length)
                : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Workers</p>
            <p className="text-3xl font-bold text-card-foreground mt-2">
              {new Set(queueItems.map(item => item.workerId).filter(Boolean)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {queueItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No items currently in queue</p>
            </CardContent>
          </Card>
        ) : (
          queueItems.map((item) => {
            const MediaIcon = mediaIcons[item.mediaType];
            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <MediaIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-card-foreground">{item.id}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.mediaType}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("capitalize", statusColors[item.status])}
                    >
                      {statusLabels[item.status]}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-card-foreground">{Math.round(item.progress)}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Submitted</p>
                      <p className="font-medium text-card-foreground">
                        {new Date(item.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {item.workerId && (
                      <div>
                        <p className="text-muted-foreground">Worker</p>
                        <p className="font-medium text-card-foreground font-mono">{item.workerId}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
