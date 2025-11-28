import { apiClient } from './AuthService';
import { Feedback } from '@/types/Feedback';

class FeedbackService {
  async getFeedback(rating?: string): Promise<Feedback[]> {
    const params = new URLSearchParams();
    if (rating && rating !== 'all') {
      params.append('rating', rating);
    }
    
    const response = await apiClient.get(`/feedback?${params.toString()}`);
    return response.data;
  }

  async submitFeedback(caseId: string, rating: 'positive' | 'negative', comment?: string): Promise<Feedback> {
    const response = await apiClient.post('/feedback', {
      caseId,
      rating,
      comment,
    });
    return response.data;
  }
}

export default new FeedbackService();
