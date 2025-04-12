
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Standards from "@/pages/Standards";
import Requirements from "@/pages/Requirements";
import Assessments from "@/pages/Assessments";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const Index = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/standards" element={<Standards />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppLayout>
  );
};

export default Index;
