import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { CaseTable } from '@/components/CaseTable';
import { StatsLoadingSkeleton, TableLoadingSkeleton, ChartLoadingSkeleton } from '@/components/LoadingSkeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import CaseService from '@/services/CaseService';
import { DashboardStats, ChartData } from '@/types/Stats';
import { Case } from '@/types/Case';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [statsData, chart, cases] = await Promise.all([
          CaseService.getStats(),
          CaseService.getChartData(),
          CaseService.getRecentCases(5),
        ]);
        setStats(statsData);
        setChartData(chart);
        setRecentCases(cases);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of verification activity</p>
        </div>
        <StatsLoadingSkeleton />
        <ChartLoadingSkeleton />
        <TableLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of verification activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Verifications Today"
          value={stats?.totalVerificationsToday || 0}
          description="Total cases processed"
          icon={Activity}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Deepfake Detection Rate"
          value={`${stats?.deepfakePercentage || 0}%`}
          description="Cases flagged as manipulated"
          icon={AlertTriangle}
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Average Confidence"
          value={`${stats?.averageConfidence || 0}%`}
          description="Mean confidence score"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Total Cases"
          value={stats?.totalCases || 0}
          description="All-time verifications"
          icon={CheckCircle}
        />
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Verifications Last 7 Days
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--card-foreground))'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="verifications" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Total Verifications"
            />
            <Line 
              type="monotone" 
              dataKey="deepfakes" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              name="Deepfakes Detected"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Cases */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Cases</h2>
        <CaseTable cases={recentCases} />
      </div>
    </div>
  );
}
