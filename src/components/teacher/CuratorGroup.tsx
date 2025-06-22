import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MobileDialog } from "@/components/ui/mobile-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Users,
  GraduationCap,
  Mail,
  Phone,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Upload,
  Settings,
  Star,
  Clock,
  BarChart3,
  Calendar,
  UserCheck,
  Award,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  X,
} from "lucide-react";
import {
  getGroupsByCurator,
  getGroupById,
  getStudentById,
  getGroupHeadStudent,
  getGradesForStudent,
  getStudentPoints,
  GROUPS,
  GRADES,
  ATTENDANCE,
  STUDENT_POINTS,
} from "@/lib/data";
import { authService } from "@/lib/auth";
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";

interface StudentStats {
  attendanceRate: number;
  averageGrade: number;
  lastActivity: string;
  pointsBalance: number;
  riskLevel: "low" | "medium" | "high";
}

const CuratorGroup = () => {
  const user = authService.getCurrentUser();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("info");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentDialog, setStudentDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageRecipient, setMessageRecipient] = useState<"group" | "student">(
    "group",
  );

  if (!user || user.role !== "teacher") {
    return <div>Доступ запрещен</div>;
  }

  // Get groups where current teacher is curator
  const curatorGroups = getGroupsByCurator(user.id);

  if (curatorGroups.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Куратор группы</h2>
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Вы не назначены куратором
            </h3>
            <p className="text-gray-500">
              Обратитесь к администрации для назначения куратором группы
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Set default selected group if not set
  const currentGroup = selectedGroupId
    ? getGroupById(selectedGroupId)
    : curatorGroups[0];

  if (!currentGroup) return null;

  const headStudent = getGroupHeadStudent(currentGroup.id);

  // Calculate student statistics
  const getStudentStats = (studentId: string): StudentStats => {
    const grades = getGradesForStudent(studentId);
    const studentPoints = getStudentPoints(studentId);

    // Calculate attendance rate (mock for now)
    const attendanceRate = 85 + Math.random() * 10; // 85-95%

    // Calculate average grade
    const numericGrades = grades.filter(
      (g) => typeof g.value === "number",
    ) as Array<{ value: number }>;
    const averageGrade =
      numericGrades.length > 0
        ? numericGrades.reduce((sum, g) => sum + g.value, 0) /
          numericGrades.length
        : 0;

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" = "low";
    if (attendanceRate < 75 || averageGrade < 3) {
      riskLevel = "high";
    } else if (attendanceRate < 85 || averageGrade < 3.5) {
      riskLevel = "medium";
    }

    return {
      attendanceRate: Math.round(attendanceRate),
      averageGrade: Math.round(averageGrade * 10) / 10,
      lastActivity: "Сдал ДЗ по информатике 2 дня назад",
      pointsBalance: studentPoints?.totalPoints || 0,
      riskLevel,
    };
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setStudentDialog(true);
  };

  const handleSendMessage = () => {
    if (messageRecipient === "group") {
      alert(
        `Сообщение отправлено всей группе ${currentGroup.name}: "${messageText}"`,
      );
    } else {
      alert(`Сообщение отправлено студенту: "${messageText}"`);
    }
    setMessageText("");
    setMessageDialog(false);
  };

  const renderGroupInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Group Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Информация о группе
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Название группы</Label>
                <p className="font-semibold text-lg">{currentGroup.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Курс</Label>
                <p className="font-semibold">{currentGroup.course} курс</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Специальность</Label>
                <p className="font-semibold">{currentGroup.specialty}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Количество студентов
                </Label>
                <p className="font-semibold">{currentGroup.students.length}</p>
              </div>
            </div>

            {headStudent && (
              <div className="border-t pt-4">
                <Label className="text-sm text-gray-600">Староста группы</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={headStudent.avatar}
                      alt={headStudent.name}
                    />
                    <AvatarFallback>
                      {headStudent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{headStudent.name}</p>
                    <p className="text-sm text-gray-500">{headStudent.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  setMessageRecipient("group");
                  setMessageDialog(true);
                }}
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Написать группе
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Собрание
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Быстрая статистика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  (currentGroup.students.reduce((sum, s) => {
                    const stats = getStudentStats(s.id);
                    return sum + stats.averageGrade;
                  }, 0) /
                    currentGroup.students.length) *
                    10,
                ) / 10}
              </div>
              <div className="text-xs text-blue-700">Средний балл</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  currentGroup.students.reduce((sum, s) => {
                    const stats = getStudentStats(s.id);
                    return sum + stats.attendanceRate;
                  }, 0) / currentGroup.students.length,
                )}
                %
              </div>
              <div className="text-xs text-green-700">Посещаемость</div>
            </div>

            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  currentGroup.students.filter((s) => {
                    const stats = getStudentStats(s.id);
                    return stats.riskLevel === "high";
                  }).length
                }
              </div>
              <div className="text-xs text-yellow-700">В зоне риска</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {currentGroup.students.reduce((sum, s) => {
                  const stats = getStudentStats(s.id);
                  return sum + stats.pointsBalance;
                }, 0)}
              </div>
              <div className="text-xs text-purple-700">Общие баллы</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Список студентов</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Экспорт
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Студент</TableHead>
                <TableHead>Посещаемость</TableHead>
                <TableHead>Средний балл</TableHead>
                <TableHead>Баллы</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentGroup.students.map((student) => {
                const stats = getStudentStats(student.id);
                return (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={student.avatar}
                            alt={student.name}
                          />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              stats.attendanceRate >= 85
                                ? "bg-green-500"
                                : stats.attendanceRate >= 75
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${stats.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-sm">{stats.attendanceRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          stats.averageGrade >= 4
                            ? "default"
                            : stats.averageGrade >= 3
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {stats.averageGrade.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>{stats.pointsBalance}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          stats.riskLevel === "low"
                            ? "default"
                            : stats.riskLevel === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {stats.riskLevel === "low"
                          ? "Норма"
                          : stats.riskLevel === "medium"
                            ? "Внимание"
                            : "Риск"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStudentClick(student)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student);
                            setMessageRecipient("student");
                            setMessageDialog(true);
                          }}
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Академическая статистика</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Студенты в зоне риска
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentGroup.students
                .filter((s) => getStudentStats(s.id).riskLevel === "high")
                .map((student) => {
                  const stats = getStudentStats(student.id);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-gray-500">
                            Посещаемость: {stats.attendanceRate}% • Средний
                            балл: {stats.averageGrade}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Связаться
                      </Button>
                    </div>
                  );
                })}
              {currentGroup.students.filter(
                (s) => getStudentStats(s.id).riskLevel === "high",
              ).length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Нет студентов в зоне риска
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Лучшие студенты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentGroup.students
                .sort(
                  (a, b) =>
                    getStudentStats(b.id).averageGrade -
                    getStudentStats(a.id).averageGrade,
                )
                .slice(0, 3)
                .map((student, index) => {
                  const stats = getStudentStats(student.id);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-gray-500">
                            Средний балл: {stats.averageGrade} • Баллы:{" "}
                            {stats.pointsBalance}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>График посещаемости за месяц</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">График посещаемости</p>
              <p className="text-sm text-gray-400">
                Интерактивный график будет здесь
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Документы и отчёты</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Создать отчёт
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Кураторские отчёты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                name: "Отчёт за январь 2024",
                date: "2024-01-30",
                status: "Отправлен",
              },
              {
                name: "Промежуточный отчёт",
                date: "2024-01-15",
                status: "Черновик",
              },
              {
                name: "Отчёт за декабрь 2023",
                date: "2023-12-30",
                status: "Принят",
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      report.status === "Принят"
                        ? "default"
                        : report.status === "Отправлен"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Заметки куратора</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Добавьте заметки о группе, важные события, замечания..."
              rows={6}
            />
            <Button className="w-full mt-3">Сохранить заметки</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Экспорт успеваемости
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Отчёт посещаемости
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              Загрузить документ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Куратор группы</h2>

        {/* Group Selector */}
        {curatorGroups.length > 1 && (
          <Select
            value={selectedGroupId || curatorGroups[0].id}
            onValueChange={setSelectedGroupId}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Выберите группу" />
            </SelectTrigger>
            <SelectContent>
              {curatorGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name} ({group.students.length} студентов)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="students">Студенты</TabsTrigger>
          <TabsTrigger value="analytics">Статистика</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          {renderGroupInfo()}
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {renderStudentsList()}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {renderAnalytics()}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {renderDocuments()}
        </TabsContent>
      </Tabs>

      {/* Enhanced Student Profile Dialog */}
      <Dialog open={studentDialog} onOpenChange={setStudentDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedStudent.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xl font-bold">
                      {selectedStudent.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {currentGroup.name} • {currentGroup.course} курс •{" "}
                      {currentGroup.specialty}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="info">Основное</TabsTrigger>
                  <TabsTrigger value="grades">Успеваемость</TabsTrigger>
                  <TabsTrigger value="attendance">Посещаемость</TabsTrigger>
                  <TabsTrigger value="works">Работы</TabsTrigger>
                  <TabsTrigger value="comments">Отзывы</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="info" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Личная информация</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-gray-600">ФИО</Label>
                            <p className="font-semibold">
                              {selectedStudent.name}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">
                              Группа
                            </Label>
                            <p className="font-semibold">{currentGroup.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">
                              Email
                            </Label>
                            <p className="text-sm">{selectedStudent.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">
                              Телефон
                            </Label>
                            <p className="text-sm">+7 777 123 45 67</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">ИИН</Label>
                            <p className="text-sm">123456789012</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">
                              Дата рождения
                            </Label>
                            <p className="text-sm">01.01.2003</p>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <Label className="text-sm text-gray-600">Адрес</Label>
                          <p className="text-sm">
                            г. Алматы, ул. Абая 150, кв. 25
                          </p>
                        </div>

                        <div className="border-t pt-4">
                          <Label className="text-sm text-gray-600">
                            Последняя активность
                          </Label>
                          <p className="text-sm text-gray-600">
                            {getStudentStats(selectedStudent.id).lastActivity}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {getStudentStats(selectedStudent.id).averageGrade}
                          </div>
                          <div className="text-sm text-blue-700">
                            Средний балл
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {getStudentStats(selectedStudent.id).attendanceRate}
                            %
                          </div>
                          <div className="text-sm text-green-700">
                            Посещаемость
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-yellow-600">
                            {getStudentStats(selectedStudent.id).pointsBalance}
                          </div>
                          <div className="text-sm text-yellow-700">Баллы</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <Badge
                            variant={
                              getStudentStats(selectedStudent.id).riskLevel ===
                              "low"
                                ? "default"
                                : getStudentStats(selectedStudent.id)
                                      .riskLevel === "medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-lg p-2"
                          >
                            {getStudentStats(selectedStudent.id).riskLevel ===
                            "low"
                              ? "Норма"
                              : getStudentStats(selectedStudent.id)
                                    .riskLevel === "medium"
                                ? "Внимание"
                                : "Риск"}
                          </Badge>
                          <div className="text-sm text-gray-700 mt-2">
                            Статус
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Grades Tab */}
                <TabsContent value="grades" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Успеваемость по предметам</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Предмет</TableHead>
                            <TableHead>Оценки</TableHead>
                            <TableHead>Средний балл</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>ДЗ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            {
                              subject: "Математика",
                              grades: [5, 4, 5, 3],
                              avg: 4.25,
                              status: "good",
                              homework: "complete",
                            },
                            {
                              subject: "Информатика",
                              grades: [5, 5, 4],
                              avg: 4.67,
                              status: "excellent",
                              homework: "complete",
                            },
                            {
                              subject: "История",
                              grades: [3, 2, 3],
                              avg: 2.67,
                              status: "bad",
                              homework: "missing",
                            },
                            {
                              subject: "Физика",
                              grades: [4, 3, 4, 5],
                              avg: 4.0,
                              status: "good",
                              homework: "late",
                            },
                            {
                              subject: "Экономика",
                              grades: [5, 5, 5],
                              avg: 5.0,
                              status: "excellent",
                              homework: "complete",
                            },
                          ].map((subject, index) => (
                            <TableRow
                              key={index}
                              className={
                                subject.status === "bad"
                                  ? "bg-red-50"
                                  : subject.homework === "missing"
                                    ? "bg-yellow-50"
                                    : ""
                              }
                            >
                              <TableCell className="font-medium">
                                {subject.subject}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {subject.grades.map((grade, i) => (
                                    <Badge
                                      key={i}
                                      variant={
                                        grade >= 4
                                          ? "default"
                                          : grade === 3
                                            ? "secondary"
                                            : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {grade}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    subject.avg >= 4
                                      ? "default"
                                      : subject.avg >= 3
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {subject.avg.toFixed(2)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {subject.status === "bad" && (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    Неудовлетворительно
                                  </div>
                                )}
                                {subject.status === "good" && (
                                  <div className="text-green-600">Хорошо</div>
                                )}
                                {subject.status === "excellent" && (
                                  <div className="text-blue-600">Отлично</div>
                                )}
                              </TableCell>
                              <TableCell>
                                {subject.homework === "missing" && (
                                  <Badge variant="destructive">
                                    <X className="h-3 w-3 mr-1" />
                                    Не сдано
                                  </Badge>
                                )}
                                {subject.homework === "late" && (
                                  <Badge variant="secondary">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Пересдача
                                  </Badge>
                                )}
                                {subject.homework === "complete" && (
                                  <Badge variant="default">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Сдано
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Статистика посещаемости</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Присутствовал</span>
                            </div>
                            <span className="font-bold text-green-600">42</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-yellow-600" />
                              <span>Опоздания</span>
                            </div>
                            <span className="font-bold text-yellow-600">3</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <X className="h-5 w-5 text-red-600" />
                              <span>Пропуски</span>
                            </div>
                            <span className="font-bold text-red-600">2</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Последние пропуски</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            {
                              date: "15.01.2024",
                              subject: "История",
                              reason: "Болел",
                              justified: true,
                            },
                            {
                              date: "10.01.2024",
                              subject: "Физика",
                              reason: "Не указано",
                              justified: false,
                            },
                            {
                              date: "08.01.2024",
                              subject: "Математика",
                              reason: "Семейные обстоятельства",
                              justified: true,
                            },
                          ].map((absence, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {absence.subject}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {absence.date} • {absence.reason}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  absence.justified ? "default" : "destructive"
                                }
                              >
                                {absence.justified
                                  ? "Уважительная"
                                  : "Неуважительная"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Works Tab */}
                <TabsContent value="works" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Загруженные работы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            title: "Контрольная работа по математике",
                            subject: "Математика",
                            date: "20.01.2024",
                            status: "submitted",
                            grade: 5,
                            file: "math_test.pdf",
                          },
                          {
                            title: "Лабораторная работа №3",
                            subject: "Информатика",
                            date: "18.01.2024",
                            status: "submitted",
                            grade: 4,
                            file: "lab3.zip",
                          },
                          {
                            title: "Реферат по истории",
                            subject: "История",
                            date: "15.01.2024",
                            status: "overdue",
                            grade: null,
                            file: null,
                          },
                          {
                            title: "Решение задач по физике",
                            subject: "Физика",
                            date: "12.01.2024",
                            status: "late",
                            grade: 3,
                            file: "physics_homework.pdf",
                          },
                        ].map((work, index) => (
                          <div
                            key={index}
                            className={`p-4 border rounded-lg ${
                              work.status === "overdue"
                                ? "bg-red-50 border-red-200"
                                : work.status === "late"
                                  ? "bg-yellow-50 border-yellow-200"
                                  : "bg-green-50 border-green-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{work.title}</h4>
                                <p className="text-sm text-gray-600">
                                  {work.subject} • {work.date}
                                </p>
                                {work.file && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    📎 {work.file}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {work.grade && (
                                  <Badge
                                    variant={
                                      work.grade >= 4
                                        ? "default"
                                        : work.grade === 3
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {work.grade}
                                  </Badge>
                                )}
                                <Badge
                                  variant={
                                    work.status === "submitted"
                                      ? "default"
                                      : work.status === "late"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {work.status === "submitted"
                                    ? "Сдано"
                                    : work.status === "late"
                                      ? "Просрочено"
                                      : "Не сдано"}
                                </Badge>
                                {work.file && (
                                  <Button size="sm" variant="outline">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Отзывы преподавателей</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            author: "Гүлмира Асқарқызы",
                            subject: "Математика",
                            date: "20.01.2024",
                            comment:
                              "Очень активный студент, хорошо работает на уроках",
                            type: "positive",
                          },
                          {
                            author: "Мұрат Серікұлы",
                            subject: "История",
                            date: "15.01.2024",
                            comment:
                              "Нужна поддержка по предмету, часто пропускает занятия",
                            type: "concern",
                          },
                          {
                            author: "Лейла Қайратқызы",
                            subject: "Физика",
                            date: "10.01.2024",
                            comment:
                              "Показывает хорошие результаты в лабораторных работах",
                            type: "positive",
                          },
                        ].map((comment, index) => (
                          <div
                            key={index}
                            className={`p-4 border rounded-lg ${
                              comment.type === "positive"
                                ? "bg-green-50 border-green-200"
                                : comment.type === "concern"
                                  ? "bg-yellow-50 border-yellow-200"
                                  : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {comment.author
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {comment.author}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {comment.subject} • {comment.date}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm">{comment.comment}</p>
                              </div>
                              {comment.type === "positive" && (
                                <Badge variant="default" className="ml-2">
                                  Положительный
                                </Badge>
                              )}
                              {comment.type === "concern" && (
                                <Badge variant="secondary" className="ml-2">
                                  Требует внимания
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 mt-6">
                        <h4 className="font-medium mb-3">
                          Добавить комментарий
                        </h4>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Оставьте комментарий о студенте..."
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Добавить комментарий
                            </Button>
                            <Button size="sm" variant="outline">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Отметить для отчёта
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF отчёт
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Отметить для отчёта
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStudentDialog(false)}
                  >
                    Закрыть
                  </Button>
                  <Button
                    onClick={() => {
                      setMessageRecipient("student");
                      setStudentDialog(false);
                      setMessageDialog(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Написать студенту
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {messageRecipient === "group"
                ? `Сообщение группе ${currentGroup.name}`
                : `Сообщение студенту`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Сообщение</Label>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Введите текст сообщения..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CuratorGroup;
