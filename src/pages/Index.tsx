import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Standards from "@/pages/Standards";
import Requirements from "@/pages/Requirements";
import Assessments from "@/pages/Assessments";
import Applications from "@/pages/Applications";
import Suppliers from "@/pages/Suppliers";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Organizations from "@/pages/Organizations";

const Index = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/standards" element={<Standards />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppLayout>
  );
};

export default Index;
