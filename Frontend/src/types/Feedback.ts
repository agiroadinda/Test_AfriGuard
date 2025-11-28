export type FeedbackRating = 'positive' | 'negative';

export interface Feedback {
  id: string;
  caseId: string;
  rating: FeedbackRating;
  comment?: string;
  submittedAt: string;
}
