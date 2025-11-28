import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import CaseService from '@/services/CaseService';
import { CaseDetails as CaseDetailsType } from '@/types/Case';
import { cn } from '@/lib/utils';

export default function CaseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCase = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await CaseService.getCaseById(id);
        setCaseData(data);
      } catch (error) {
        console.error('Error loading case:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCase();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Case Not Found</h2>
        <Button onClick={() => navigate('/cases')}>Back to Cases</Button>
      </div>
    );
  }

  const getVerdictIcon = () => {
    if (caseData.confidence > 70) return <AlertTriangle className="h-6 w-6 text-destructive" />;
    if (caseData.confidence > 40) return <AlertTriangle className="h-6 w-6 text-warning" />;
    return <CheckCircle className="h-6 w-6 text-success" />;
  };

  const getConfidenceColor = (score: number) => {
    if (score > 70) return 'text-destructive';
    if (score > 40) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/cases')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Case Details</h1>
          <p className="text-muted-foreground mt-1 font-mono">{caseData.id}</p>
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "capitalize px-3 py-1",
            caseData.status === 'completed' ? "bg-success/20 text-success-foreground border-success/30" :
            caseData.status === 'analyzing' ? "bg-warning/20 text-warning-foreground border-warning/30" :
            "bg-destructive/20 text-destructive-foreground border-destructive/30"
          )}
        >
          {caseData.status}
        </Badge>
      </div>

      {/* Verdict Card */}
      <Card className="border-l-4" style={{ borderLeftColor: caseData.confidence > 70 ? 'hsl(var(--destructive))' : caseData.confidence > 40 ? 'hsl(var(--warning))' : 'hsl(var(--success))' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getVerdictIcon()}
            Final Verdict
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className={cn("text-3xl font-bold", getConfidenceColor(caseData.confidence))}>
              {caseData.verdict}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Combined Confidence Score: {caseData.confidence}%
            </p>
          </div>
          <Progress value={caseData.confidence} className="h-2" />
        </CardContent>
      </Card>

      {/* Analysis Scores */}
      <div className="grid gap-6 md:grid-cols-3">
        {caseData.faceScore !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Face Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-bold", getConfidenceColor(caseData.faceScore))}>
                {caseData.faceScore}%
              </p>
              <Progress value={caseData.faceScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
        )}
        
        {caseData.voiceScore !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Voice Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-bold", getConfidenceColor(caseData.voiceScore))}>
                {caseData.voiceScore}%
              </p>
              <Progress value={caseData.voiceScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
        )}
        
        {caseData.lipsyncScore !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lipsync Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-bold", getConfidenceColor(caseData.lipsyncScore))}>
                {caseData.lipsyncScore}%
              </p>
              <Progress value={caseData.lipsyncScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Explanation */}
      {caseData.explanation && (
        <Card>
          <CardHeader>
            <CardTitle>AI Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground leading-relaxed">{caseData.explanation}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Case Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Media Type</p>
            <p className="text-base font-medium text-card-foreground capitalize">{caseData.mediaType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Submitted At</p>
            <p className="text-base font-medium text-card-foreground">
              {new Date(caseData.submittedAt).toLocaleString()}
            </p>
          </div>
          {caseData.completedAt && (
            <div>
              <p className="text-sm text-muted-foreground">Completed At</p>
              <p className="text-base font-medium text-card-foreground">
                {new Date(caseData.completedAt).toLocaleString()}
              </p>
            </div>
          )}
          {caseData.workerId && (
            <div>
              <p className="text-sm text-muted-foreground">Worker ID</p>
              <p className="text-base font-medium text-card-foreground font-mono">{caseData.workerId}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Preview Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Media Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-12 text-center">
            <p className="text-muted-foreground">Media preview component placeholder</p>
            <p className="text-sm text-muted-foreground mt-2">Backend integration required</p>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-12 text-center">
            <p className="text-muted-foreground">Heatmap visualization placeholder</p>
            <p className="text-sm text-muted-foreground mt-2">Backend integration required</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
