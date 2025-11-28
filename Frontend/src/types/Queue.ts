export type QueueStatus = 'preprocessing' | 'analyzing' | 'llm_explaining' | 'sending_result';

export interface QueueItem {
  id: string;
  mediaType: 'image' | 'video' | 'audio';
  submittedAt: string;
  progress: number;
  status: QueueStatus;
  workerId?: string;
}
