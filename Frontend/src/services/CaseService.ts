import { apiClient } from './AuthService';
import { Case, CaseDetails } from '@/types/Case';
import { DashboardStats, ChartData } from '@/types/Stats';

class CaseService {
  async getCases(filters?: { mediaType?: string; status?: string }): Promise<Case[]> {
    const params = new URLSearchParams();
    if (filters?.mediaType && filters.mediaType !== 'all') {
      params.append('mediaType', filters.mediaType);
    }
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    
    const response = await apiClient.get(`/cases?${params.toString()}`);
    return response.data;
  }

  async getCaseById(id: string): Promise<CaseDetails> {
    const response = await apiClient.get(`/cases/${id}`);
    return response.data;
  }

  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/stats');
    return response.data;
  }

  async getChartData(): Promise<ChartData[]> {
    const response = await apiClient.get('/stats/chart');
    return response.data;
  }

  async getRecentCases(limit: number = 5): Promise<Case[]> {
    const cases = await this.getCases();
    return cases.slice(0, limit);
  }
}

export default new CaseService();
