import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, BookOpen, Settings } from "lucide-react";
import { authService } from "@/lib/auth";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const user = authService.getCurrentUser();

  if (!user || user.role !== "admin") {
    return <div>Доступ запрещен</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Обзор системы</h2>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Панель администратора
              </h3>
              <p className="text-gray-500 mb-4">
                Здесь будет полная статистика по колледжу
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Управление пользователями
            </h2>
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Пользователи
              </h3>
              <p className="text-gray-500 mb-4">
                Добавление/удаление студентов, преподавателей
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );

      case "groups":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Управление группами
            </h2>
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Группы и предметы
              </h3>
              <p className="text-gray-500 mb-4">
                Управление группами, предметами и расписанием
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Настройки системы
            </h2>
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Настройки
              </h3>
              <p className="text-gray-500 mb-4">
                Управление доступами и конфигурация системы
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Администрирование
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">42</p>
                  <p className="text-sm text-gray-600">Всего пользователей</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-gray-600">Групп</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">15</p>
                  <p className="text-sm text-gray-600">Предметов</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                  <p className="text-sm text-gray-600">Активность</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
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

export default AdminDashboard;
