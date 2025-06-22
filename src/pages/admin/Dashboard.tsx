import { useState } from "react";
import Navigation from "@/components/Navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import AcademicStructure from "@/components/admin/AcademicStructure";
import ScheduleManagement from "@/components/admin/ScheduleManagement";
import AnalyticsReports from "@/components/admin/AnalyticsReports";
import QualityControl from "@/components/admin/QualityControl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  BookOpen,
  Settings,
  Calendar,
  TrendingUp,
  Shield,
} from "lucide-react";
import { authService } from "@/lib/auth";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const user = authService.getCurrentUser();

  if (!user || user.role !== "admin") {
    return <div>Доступ запрещен</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <UserManagement />;
      case "structure":
        return <AcademicStructure />;
      case "schedule":
        return <ScheduleManagement />;
      case "analytics":
        return <AnalyticsReports />;
      case "quality":
        return <QualityControl />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
