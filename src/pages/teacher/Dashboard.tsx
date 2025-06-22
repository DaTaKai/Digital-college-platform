import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { authService } from "@/lib/auth";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const user = authService.getCurrentUser();

  if (!user || user.role !== "teacher") {
    return <div>Доступ запрещен</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "schedule":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Интерактивное расписание
            </h2>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Расписание преподавателя
              </h3>
              <p className="text-gray-500 mb-4">
                Здесь будет интерактивное расписание с возможностью отметки
                посещаемости и загрузки материалов
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );

      case "attendance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Посещаемость</h2>
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Отметка посещаемости
              </h3>
              <p className="text-gray-500 mb-4">
                Таблица с именами студентов и чекбоксами для отметки
                посещаемости
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );

      case "journal":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Журнал оценок и материалов
            </h2>
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Массовое выставление оценок
              </h3>
              <p className="text-gray-500 mb-4">
                Таблица для массового выставления оценок и загрузки материалов
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Активность студентов
            </h2>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Аналитика активности
              </h3>
              <p className="text-gray-500 mb-4">
                Кто просмотрел материал, кто сдал работы вовремя
              </p>
              <Badge variant="secondary">В разработке</Badge>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Панель преподавателя
            </h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Сегодня занятий</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Студентов</p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Непроверенных</p>
                      <p className="text-2xl font-bold text-gray-900">7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Посещаемость</p>
                      <p className="text-2xl font-bold text-gray-900">89%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Полный функционал в разработке
              </h3>
              <p className="text-gray-500 mb-4">
                Используйте навигацию выше для доступа к различным функциям
              </p>
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

export default TeacherDashboard;
