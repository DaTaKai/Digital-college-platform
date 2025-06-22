import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { GROUPS, SUBJECTS, TEACHERS, STUDENT_POINTS, GRADES } from "@/lib/data";

const AnalyticsReports = () => {
  const [timeframe, setTimeframe] = useState("month");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [reportType, setReportType] = useState("attendance");

  // Mock data for analytics
  const attendanceData = [
    { name: "ИС-21", attendance: 89, students: 6 },
    { name: "ПР-20", attendance: 92, students: 4 },
    { name: "ЭК-22", attendance: 85, students: 3 },
  ];

  const gradesTrend = [
    { month: "Сент", average: 3.8, attendance: 88 },
    { month: "Окт", average: 4.0, attendance: 85 },
    { month: "Нояб", average: 4.2, attendance: 89 },
    { month: "Дек", average: 4.1, attendance: 92 },
    { month: "Янв", average: 4.3, attendance: 87 },
    { month: "Февр", average: 4.2, attendance: 90 },
  ];

  const subjectPerformance = SUBJECTS.map((subject) => ({
    name: subject.name,
    averageGrade: 3.5 + Math.random() * 1.5,
    completion: 75 + Math.random() * 20,
    engagement: 80 + Math.random() * 15,
  }));

  const teacherStats = TEACHERS.map((teacher) => ({
    name: teacher.name.split(" ")[0],
    avgGrade: 3.8 + Math.random() * 1.2,
    satisfaction: 4.2 + Math.random() * 0.8,
    materials: Math.floor(Math.random() * 20) + 10,
    attendance: 85 + Math.random() * 10,
  }));

  const lowPerformers = [
    {
      name: "Арман Бейсенов",
      group: "ПР-20",
      avgGrade: 2.8,
      attendance: 67,
      status: "risk",
    },
    {
      name: "Мереке Сапарова",
      group: "ИС-21",
      avgGrade: 3.1,
      attendance: 72,
      status: "warning",
    },
    {
      name: "Бақытжан Төлеубеков",
      group: "ЭК-22",
      avgGrade: 3.0,
      attendance: 78,
      status: "warning",
    },
  ];

  const generateReport = () => {
    alert(`Генерация ${reportType} отчета за ${timeframe}`);
  };

  const exportToPDF = () => {
    alert("Экспорт отчета в PDF");
  };

  const exportToExcel = () => {
    alert("Экспорт отчета в Excel");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "risk":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Средняя посещаемость</p>
                <p className="text-2xl font-bold text-gray-900">88.7%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.3% за месяц
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Средний балл</p>
                <p className="text-2xl font-bold text-gray-900">4.12</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +0.15 за месяц
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Выполнение ДЗ</p>
                <p className="text-2xl font-bold text-gray-900">76%</p>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -1.2% за месяц
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Активность</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% за месяц
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Динамика успеваемости</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gradesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" domain={[3, 5]} />
                <YAxis yAxisId="right" orientation="right" domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="average"
                  stroke="#3b82f6"
                  name="Средний балл"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="attendance"
                  stroke="#10b981"
                  name="Посещаемость %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Посещаемость по группам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="attendance"
                  fill="#3b82f6"
                  name="Посещаемость %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Успеваемость по предметам</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Предмет</TableHead>
                <TableHead>Средний балл</TableHead>
                <TableHead>Завершенность</TableHead>
                <TableHead>Вовлеченность</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectPerformance.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        subject.averageGrade >= 4
                          ? "default"
                          : subject.averageGrade >= 3
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {subject.averageGrade.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{subject.completion.toFixed(0)}%</TableCell>
                  <TableCell>{subject.engagement.toFixed(0)}%</TableCell>
                  <TableCell>
                    {subject.averageGrade >= 4 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : subject.averageGrade >= 3 ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Студенты группы риска</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Студент</TableHead>
                <TableHead>Группа</TableHead>
                <TableHead>Средний балл</TableHead>
                <TableHead>Посещаемость</TableHead>
                <TableHead>Риск</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowPerformers.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.group}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{student.avgGrade}</Badge>
                  </TableCell>
                  <TableCell>{student.attendance}%</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(student.status) as any}>
                      {student.status === "risk"
                        ? "Высокий"
                        : student.status === "warning"
                          ? "Средний"
                          : "Низкий"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Связаться
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeachersTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Рейтинг преподавателей</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Преподаватель</TableHead>
              <TableHead>Средний балл группы</TableHead>
              <TableHead>Удовлетворенность</TableHead>
              <TableHead>Материалов</TableHead>
              <TableHead>Посещаемость</TableHead>
              <TableHead>Рейтинг</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherStats.map((teacher, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      teacher.avgGrade >= 4
                        ? "default"
                        : teacher.avgGrade >= 3
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {teacher.avgGrade.toFixed(1)}
                  </Badge>
                </TableCell>
                <TableCell>{teacher.satisfaction.toFixed(1)}/5.0 ⭐</TableCell>
                <TableCell>{teacher.materials}</TableCell>
                <TableCell>{teacher.attendance.toFixed(0)}%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(teacher.satisfaction / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm">
                      {Math.round((teacher.satisfaction / 5) * 100)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Генерация отчетов</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportToPDF}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Тип отчета</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Посещаемость</SelectItem>
                  <SelectItem value="grades">Успеваемость</SelectItem>
                  <SelectItem value="activity">Активность</SelectItem>
                  <SelectItem value="teacher">Преподаватели</SelectItem>
                  <SelectItem value="summary">Сводный отчет</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Период</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="semester">Семестр</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Группа</label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все группы</SelectItem>
                  {GROUPS.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={generateReport} className="w-full">
            Сгенерировать отчет
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Автоматические уведомления</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Низкая посещаемость</h4>
                <p className="text-sm text-gray-600">
                  Уведомление при посещаемости ниже 70%
                </p>
              </div>
              <Badge variant="default">Включено</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Плохие оценки</h4>
                <p className="text-sm text-gray-600">
                  Уведомление при среднем балле ниже 3.0
                </p>
              </div>
              <Badge variant="default">Включено</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Недельный отчет</h4>
                <p className="text-sm text-gray-600">
                  Автоматическая отправка каждый понедельник
                </p>
              </div>
              <Badge variant="secondary">Отключено</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Аналитика и отчеты</h2>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="semester">Семестр</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="performance">Успеваемость</TabsTrigger>
          <TabsTrigger value="teachers">Преподаватели</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">{renderOverviewTab()}</TabsContent>
        <TabsContent value="performance">{renderPerformanceTab()}</TabsContent>
        <TabsContent value="teachers">{renderTeachersTab()}</TabsContent>
        <TabsContent value="reports">{renderReportsTab()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsReports;
