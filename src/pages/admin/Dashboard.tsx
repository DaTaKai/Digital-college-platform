import { useState } from "react";
import Navigation from "@/components/Navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import AcademicStructure from "@/components/admin/AcademicStructure";
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
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Управление расписанием
            </h2>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Визуальный редактор расписания
              </h3>
              <p className="text-gray-500 mb-4">
                Drag & drop редактор с фильтрацией и историей изменений
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Аналитика и отчеты
            </h2>
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Детальная аналитика
              </h3>
              <p className="text-gray-500 mb-4">
                Отчеты по посещаемости, успеваемости и экспорт в PDF/Excel
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );
      case "quality":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Контроль качества
            </h2>
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Система контроля качества
              </h3>
              <p className="text-gray-500 mb-4">
                Рейтинги, опросы, обратная связь и модерация контента
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );
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
