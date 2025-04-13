import { BarChart3, BookOpen, CheckSquare, Shield, TrendingUp, Calendar, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { AssessmentProgress } from "@/components/dashboard/AssessmentProgress";
import { PageHeader } from "@/components/PageHeader";
import { dashboardStats, assessments } from "@/data/mockData";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { t } = useTranslation();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="space-y-8 pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <PageHeader
        title="Compliance Dashboard"
        description="Track your organization's compliance status and assessments across all standards"
        className="!border-none !pb-0"
      />
      
      <motion.div
        variants={fadeInVariants}
        className="bg-gradient-to-r from-blue-50 via-white to-teal-50 dark:from-blue-950/30 dark:via-slate-900/50 dark:to-teal-950/30 rounded-xl p-6 shadow-lg"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
              <TrendingUp size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Recent Trend</h3>
              <p className="text-muted-foreground">Your compliance is improving by 5% since last month</p>
            </div>
          </div>
          
          <div className="flex flex-row gap-4">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
              <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg">
                <Calendar size={18} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next assessment</p>
                <p className="font-medium">June 15, 2023</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
              <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                <Clock size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="font-medium">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <StatsCard
          title="Total Standards"
          value={dashboardStats.totalStandards}
          icon={<Shield size={20} />}
          description="Active compliance standards"
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Total Requirements"
          value={dashboardStats.totalRequirements}
          icon={<BookOpen size={20} />}
          description="Across all standards"
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Total Assessments"
          value={dashboardStats.totalAssessments}
          icon={<CheckSquare size={20} />}
          description="Ongoing and completed"
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Compliance Score"
          value={`${dashboardStats.complianceScore}%`}
          icon={<BarChart3 size={20} />}
          trend={{
            value: 5,
            isPositive: true
          }}
          description="Overall compliance rate"
          className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30"
        />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6" 
        variants={itemVariants}
      >
        <motion.div variants={itemVariants} className="shadow-lg rounded-xl overflow-hidden">
          <ComplianceChart data={dashboardStats.requirementStatusCounts} />
        </motion.div>
        <motion.div variants={itemVariants} className="shadow-lg rounded-xl overflow-hidden">
          <AssessmentProgress assessments={assessments} />
        </motion.div>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="mt-8"
      >
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Upcoming Tasks</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-3 border rounded-lg flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                      <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Complete ISO 27001 Assessment</p>
                      <p className="text-sm text-muted-foreground">Due in 3 days</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Start</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
