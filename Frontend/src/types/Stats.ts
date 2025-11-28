export interface DashboardStats {
  totalVerificationsToday: number;
  deepfakePercentage: number;
  averageConfidence: number;
  totalCases: number;
}

export interface ChartData {
  date: string;
  verifications: number;
  deepfakes: number;
}
