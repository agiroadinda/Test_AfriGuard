export type MediaType = 'image' | 'video' | 'audio';
export type CaseStatus = 'analyzing' | 'completed' | 'failed';

export interface Case {
  id: string;
  mediaType: MediaType;
  status: CaseStatus;
  confidence: number;
  submittedAt: string;
  completedAt?: string;
  faceScore?: number;
  voiceScore?: number;
  lipsyncScore?: number;
  verdict: string;
  explanation?: string;
  mediaUrl?: string;
  heatmapUrl?: string;
}

export interface CaseDetails extends Case {
  workerId?: string;
  processingTimeMs?: number;
  metadata?: Record<string, any>;
}
