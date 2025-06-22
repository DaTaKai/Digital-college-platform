import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Award,
  Activity,
} from "lucide-react";
import {
  GROUPS,
  TEACHERS,
  SUBJECTS,
  LESSONS,
  STUDENT_POINTS,
  GRADES,
} from "@/lib/data";

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "semester">(
    "month",
  );

  // Calculate statistics
  const totalStudents = GROUPS.reduce(
    (sum, group) => sum + group.students.length,
    0,
  );
  const totalTeachers = TEACHERS.length;
  const totalGroups = GROUPS.length;
  const totalSubjects = SUBJECTS.length;
  const totalLessons = LESSONS.length;

  const activeHomework = LESSONS.filter((lesson) => lesson.homework).length;
  const totalMaterials = LESSONS.reduce(
    (sum, lesson) => sum + (lesson.materials?.length || 0),
    0,
  );
  const totalPoints = STUDENT_POINTS.reduce(
    (sum, sp) => sum + sp.totalPoints,
    0,
  );
  const avgAttendance = 87; // Mock calculation

  // Activity data for charts
  const weeklyActivity = [
    { name: "Пн", homework: 12, materials: 8, attendance: 95 },
    { name: "Вт", homework: 15, materials: 12, attendance: 92 },
    { name: "Ср", homework: 8, materials: 15, attendance: 88 },
    { name: "Чт", homework: 20, materials: 10, attendance: 94 },
    { name: "Пт", homework: 18, materials: 14, attendance: 89 },
    { name: "Сб", homework: 5, materials: 3, attendance: 76 },
    { name: "Вс", homework: 2, materials: 1, attendance: 45 },
  ];

  const gradeDistribution = [
    { name: "5", value: 35, color: "#10b981" },
    { name: "4", value: 28, color: "#3b82f6" },
    { name: "3", value: 20, color: "#f59e0b" },
    { name: "2", value: 12, color: "#ef4444" },
    { name: "НБ", value: 5, color: "#6b7280" },
  ];

  const subjectActivity = SUBJECTS.map((subject) => {
    const subjectLessons = LESSONS.filter((l) => l.subjectId === subject.id);
    return {
      name: subject.name,
      lessons: subjectLessons.length,
      homework: subjectLessons.filter((l) => l.homework).length,
      materials: subjectLessons.reduce(
        (sum, l) => sum + (l.materials?.length || 0),
        0,
      ),
    };
  });

  // Anomaly detection
  const anomalies = [
    {
      type: "attendance",
      severity: "high",
      message: "Низкая посещаемость в группе ИС-21 (67%)",
      time: "2 часа назад",
    },
    {
      type: "materials",
      severity: "medium",
      message: "Нет материалов к 5 урокам на этой неделе",
      time: "4 часа назад",
    },
    {
      type: "homework",
      severity: "low",
      message: "Просрочено 12 домашних заданий",
      time: "6 часов назад",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <Users className="h-4 w-4" />;
      case "materials":
        return <FileText className="h-4 w-4" />;
      case "homework":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Панель управления</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={timeframe === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("week")}
          >
            Неделя
          </Button>
          <Button
            variant={timeframe === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("month")}
          >
            Месяц
          </Button>
          <Button
            variant={timeframe === "semester" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("semester")}
          >
            Семестр
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Студенты</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> за месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Преподаватели</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> новых
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные задания
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeHomework}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{totalMaterials}</span> материалов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Посещаемость</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-3%</span> за неделю
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Активность по дням недели</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="homework" fill="#3b82f6" name="Задания" />
                <Bar dataKey="materials" fill="#10b981" name="Материалы" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Распр��деление оценок</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Активность по предметам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectActivity.map((subject) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subject.name}</span>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{subject.lessons} уроков</span>
                      <span>{subject.homework} заданий</span>
                      <span>{subject.materials} материалов</span>
                    </div>
                  </div>
                  <Progress
                    value={
                      (subject.lessons /
                        Math.max(...subjectActivity.map((s) => s.lessons))) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anomalies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Уведомления
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <div className="p-1 rounded-full bg-gray-100">
                    {getSeverityIcon(anomaly.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={getSeverityColor(anomaly.severity) as any}
                      >
                        {anomaly.severity === "high"
                          ? "Высокий"
                          : anomaly.severity === "medium"
                            ? "Средний"
                            : "Низкий"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">
                      {anomaly.message}
                    </p>
                    <p className="text-xs text-gray-500">{anomaly.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Система баллов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Всего баллов</span>
                <span className="font-semibold">
                  {totalPoints.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Сегодня заработано
                </span>
                <span className="font-semibold text-green-600">
                  +{STUDENT_POINTS.reduce((sum, sp) => sum + sp.earnedToday, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Средний баланс</span>
                <span className="font-semibold">
                  {Math.round(totalPoints / STUDENT_POINTS.length)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Расписание</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Всего занятий</span>
                <span className="font-semibold">{totalLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Сегодня</span>
                <span className="font-semibold text-blue-600">
                  {
                    LESSONS.filter(
                      (l) => l.date === new Date().toISOString().split("T")[0],
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Активных групп</span>
                <span className="font-semibold">{totalGroups}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Качество обучения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Средний балл</span>
                <span className="font-semibold">4.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Успеваемость</span>
                <span className="font-semibold text-green-600">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Активность</span>
                <span className="font-semibold text-blue-600">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
