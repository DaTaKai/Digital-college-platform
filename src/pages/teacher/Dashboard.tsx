import { useState } from "react";
import Navigation from "@/components/Navigation";
import EnhancedTeacherSchedule from "@/components/teacher/EnhancedTeacherSchedule";
import GradingJournal from "@/components/teacher/GradingJournal";
import CuratorGroup from "@/components/teacher/CuratorGroup";
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
  TrendingUp,
  FileText,
  Award,
} from "lucide-react";
import { authService } from "@/lib/auth";
import { LESSONS, GROUPS, STUDENT_POINTS, isCurator } from "@/lib/data";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const user = authService.getCurrentUser();

  if (!user || user.role !== "teacher") {
    return <div>Доступ запрещен</div>;
  }

  // Calculate stats
  const todayLessons = LESSONS.filter(
    (l) => l.date === new Date().toISOString().split("T")[0],
  ).length;
  const totalStudents = GROUPS.reduce((sum, g) => sum + g.students.length, 0);
  const totalEarnedToday = STUDENT_POINTS.reduce(
    (sum, sp) => sum + sp.earnedToday,
    0,
  );

  const renderScheduleTab = () => <EnhancedTeacherSchedule />;

  const renderJournalTab = () => <GradingJournal />;

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Активность студентов</h2>

      {/* Student Points Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Баллов заработано сегодня
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEarnedToday}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Активных студентов</p>
                <p className="text-2xl font-bold text-gray-900">
                  {STUDENT_POINTS.filter((sp) => sp.earnedToday > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Материалов загружено</p>
                <p className="text-2xl font-bold text-gray-900">
                  {LESSONS.reduce(
                    (sum, l) => sum + (l.materials?.length || 0),
                    0,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Activity Details */}
      <Card>
        <CardHeader>
          <CardTitle>Активность студентов по баллам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {STUDENT_POINTS.map((studentPoints) => {
              const group = GROUPS.find((g) =>
                g.students.some((s) => s.id === studentPoints.studentId),
              );
              const student = group?.students.find(
                (s) => s.id === studentPoints.studentId,
              );

              return (
                <div
                  key={studentPoints.studentId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {student?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{student?.name}</p>
                      <p className="text-sm text-gray-500">
                        Группа: {group?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Award className="h-4 w-4" />
                      <span className="font-semibold">
                        {studentPoints.totalPoints}
                      </span>
                    </div>
                    {studentPoints.earnedToday > 0 && (
                      <div className="text-xs text-green-600">
                        +{studentPoints.earnedToday} сегодня
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "schedule":
        return renderScheduleTab();
      case "journal":
        return renderJournalTab();
      case "analytics":
        return renderAnalyticsTab();
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
                      <p className="text-2xl font-bold text-gray-900">
                        {todayLessons}
                      </p>
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
                      <p className="text-2xl font-bold text-gray-900">
                        {totalStudents}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Баллов сегодня</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalEarnedToday}
                      </p>
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

            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Все функции доступны!
              </h3>
              <p className="text-gray-500 mb-4">
                Используйте навигацию выше для доступа к различным функциям
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { id: "schedule", label: "Расписание", icon: Calendar },
                  { id: "journal", label: "Журнал", icon: BookOpen },
                  { id: "analytics", label: "Аналитика", icon: BarChart3 },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => setActiveTab(item.id)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
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
