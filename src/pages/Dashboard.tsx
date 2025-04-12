
import { BarChart3, BookOpen, CheckSquare, Shield } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { AssessmentProgress } from "@/components/dashboard/AssessmentProgress";
import { dashboardStats, assessments } from "@/data/mockData";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Standards"
          value={dashboardStats.totalStandards}
          icon={<Shield size={20} />}
        />
        <StatsCard
          title="Total Requirements"
          value={dashboardStats.totalRequirements}
          icon={<BookOpen size={20} />}
        />
        <StatsCard
          title="Total Assessments"
          value={dashboardStats.totalAssessments}
          icon={<CheckSquare size={20} />}
        />
        <StatsCard
          title="Compliance Score"
          value={`${dashboardStats.complianceScore}%`}
          icon={<BarChart3 size={20} />}
          trend={{
            value: 5,
            isPositive: true
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceChart data={dashboardStats.requirementStatusCounts} />
        <AssessmentProgress assessments={assessments} />
      </div>
    </div>
  );
};

export default Dashboard;
