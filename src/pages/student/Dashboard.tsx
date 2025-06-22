import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import Schedule from "@/components/Schedule";
import {
  Calendar,
  BookOpen,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  getGroupById,
  getGradesForStudent,
  getSubjectById,
  getStudentPoints,
  SUBJECTS,
  getLessonsForGroup,
} from "@/lib/data";
import PointsShop from "@/components/student/PointsShop";
import HomeworkAssignments from "@/components/student/HomeworkAssignments";
import SubjectGrades from "@/components/student/SubjectGrades";
import { authService } from "@/lib/auth";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [scheduleView, setScheduleView] = useState<"day" | "week">("day");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const user = authService.getCurrentUser();

  if (!user || user.role !== "student") {
    return <div>Доступ запрещен</div>;
  }

  const group = getGroupById(user.groupId || "");
  const grades = getGradesForStudent(user.id);
  const studentPoints = getStudentPoints(user.id);

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Расписание</h2>
          {studentPoints && studentPoints.earnedToday > 0 && (
            <Badge className="gap-1">
              <TrendingUp className="h-3 w-3" />+{studentPoints.earnedToday}{" "}
              баллов сегодня
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={scheduleView === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setScheduleView("day")}
          >
            День
          </Button>
          <Button
            variant={scheduleView === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setScheduleView("week")}
          >
            Неделя
          </Button>
        </div>
      </div>
      <Schedule view={scheduleView} />
    </div>
  );

  const renderHomeworkTab = () => <HomeworkAssignments />;

  const renderGradesTab = () => {
    const subjectGrades = SUBJECTS.map((subject) => {
      const subjectGradesList = grades.filter(
        (g) => g.subjectId === subject.id,
      );
      const numericGrades = subjectGradesList.filter(
        (g) => typeof g.value === "number",
      );
      const average =
        numericGrades.length > 0
          ? numericGrades.reduce((sum, g) => sum + (g.value as number), 0) /
            numericGrades.length
          : 0;

      return {
        subject,
        grades: subjectGradesList,
        average: average.toFixed(1),
        trend: Math.random() > 0.5 ? "up" : "down", // Mock trend
      };
    });

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Оценки и прогресс</h2>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Средний балл</p>
                  <p className="text-2xl font-bold text-gray-900">4.2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Посещаемость</p>
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Задолженности</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Details */}
        <div className="space-y-4">
          {subjectGrades.map(
            ({ subject, grades: subjectGrades, average, trend }) => (
              <Card
                key={subject.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      {subject.name}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Средний балл</p>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-semibold">
                            {average}
                          </span>
                          <TrendingUp
                            className={`h-4 w-4 ${
                              trend === "up" ? "text-green-500" : "text-red-500"
                            }`}
                          />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Прогресс</span>
                      <span className="text-sm font-medium">{average}/5</span>
                    </div>
                    <Progress
                      value={parseFloat(average) * 20}
                      className="h-2"
                    />

                    <div className="flex flex-wrap gap-2 mt-3">
                      {subjectGrades.map((grade, index) => (
                        <Badge
                          key={grade.id}
                          variant={
                            typeof grade.value === "number"
                              ? grade.value >= 4
                                ? "default"
                                : grade.value >= 3
                                  ? "secondary"
                                  : "destructive"
                              : "outline"
                          }
                        >
                          {grade.value}
                        </Badge>
                      ))}
                      {subjectGrades.length === 0 && (
                        <span className="text-sm text-gray-500">
                          Нет оценок
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </div>
    );
  };

  const renderGroupTab = () => {
    if (!group) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Группа не найдена
          </h3>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Группа {group.name}
          </h2>
          <Badge variant="outline">{group.students.length} студентов</Badge>
        </div>

        <div className="grid gap-4">
          {group.students.map((student) => (
            <Card key={student.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      student.status === "active"
                        ? "default"
                        : student.status === "late"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {student.status === "active"
                      ? "Активен"
                      : student.status === "late"
                        ? "Опоздал"
                        : "Отсутствует"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderShopTab = () => <PointsShop />;

  const renderContent = () => {
    // Handle subject grades navigation
    if (selectedSubjectId) {
      return (
        <SubjectGrades
          subjectId={selectedSubjectId}
          onBack={() => setSelectedSubjectId(null)}
        />
      );
    }

    switch (activeTab) {
      case "schedule":
        return renderScheduleTab();
      case "homework":
        return renderHomeworkTab();
      case "grades":
        return renderGradesTab();
      case "shop":
        return renderShopTab();
      case "group":
        return renderGroupTab();
      default:
        return renderScheduleTab();
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

export default StudentDashboard;
