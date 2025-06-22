import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  X,
  Upload,
  BookOpen,
  Save,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  Award,
  Settings,
  Eye,
  Download,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  AlertTriangle,
  Bell,
  MessageSquare,
} from "lucide-react";
import {
  getLessonsForDate,
  getGroupById,
  getSubjectById,
  LESSONS,
  GROUPS,
  STUDENT_POINTS,
  SUBJECTS,
} from "@/lib/data";

type ViewMode = "today" | "week" | "month";
type ScheduleModule =
  | "schedule"
  | "analytics"
  | "materials"
  | "attendance"
  | "grades"
  | "settings";

interface AttendanceRecord {
  studentId: string;
  status: "present" | "late" | "absent";
}

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  type: "file" | "link" | "video";
  uploadDate: string;
  lessonId?: string;
}

const EnhancedTeacherSchedule = () => {
  const [activeModule, setActiveModule] = useState<ScheduleModule>("schedule");
  const [viewMode, setViewMode] = useState<ViewMode>("today");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    type: "file" as "file" | "link" | "video",
    file: null as File | null,
  });

  const [homeworkForm, setHomeworkForm] = useState({
    title: "",
    description: "",
    deadline: "",
    maxPoints: "100",
  });

  // Helper functions for date navigation
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case "today":
        newDate.setDate(
          currentDate.getDate() + (direction === "next" ? 1 : -1),
        );
        break;
      case "week":
        newDate.setDate(
          currentDate.getDate() + (direction === "next" ? 7 : -7),
        );
        break;
      case "month":
        newDate.setMonth(
          currentDate.getMonth() + (direction === "next" ? 1 : -1),
        );
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateISO = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setLessonDialog(true);
    setActiveTab("info");

    // Initialize attendance
    const group = getGroupById(lesson.groupId);
    if (group) {
      const initialAttendance = group.students.map((student) => ({
        studentId: student.id,
        status: "present" as const,
      }));
      setAttendance(initialAttendance);
    }
  };

  // Module Navigation
  const moduleNavigation = [
    { id: "schedule", label: "Расписание", icon: Calendar },
    { id: "analytics", label: "Аналитика", icon: BarChart3 },
    { id: "materials", label: "Материалы", icon: FileText },
    { id: "attendance", label: "Посещаемость", icon: Users },
    { id: "grades", label: "Оценки", icon: Award },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  // Get lessons based on view mode and filters
  const getLessonsForView = () => {
    let lessons = [];

    switch (viewMode) {
      case "today":
        lessons = getLessonsForDate(formatDateISO(currentDate));
        break;
      case "week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          const dayLessons = getLessonsForDate(formatDateISO(date));
          lessons.push(
            ...dayLessons.map((lesson) => ({ ...lesson, viewDate: date })),
          );
        }
        break;
      case "month":
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
        );
        for (
          let d = new Date(startOfMonth);
          d <= endOfMonth;
          d.setDate(d.getDate() + 1)
        ) {
          const dayLessons = getLessonsForDate(formatDateISO(d));
          lessons.push(
            ...dayLessons.map((lesson) => ({
              ...lesson,
              viewDate: new Date(d),
            })),
          );
        }
        break;
    }

    // Apply filters
    if (selectedGroup !== "all") {
      lessons = lessons.filter((l) => l.groupId === selectedGroup);
    }
    if (selectedSubject !== "all") {
      lessons = lessons.filter((l) => l.subjectId === selectedSubject);
    }
    if (searchTerm) {
      lessons = lessons.filter((l) => {
        const subject = getSubjectById(l.subjectId);
        const group = getGroupById(l.groupId);
        return (
          subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.room.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return lessons;
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case "today":
        return currentDate.toLocaleDateString("ru-RU", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })} - ${endOfWeek.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })}`;
      case "month":
        return currentDate.toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "long",
        });
      default:
        return "";
    }
  };

  const LessonCard = ({ lesson }: { lesson: any }) => {
    const subject = getSubjectById(lesson.subjectId);
    const group = getGroupById(lesson.groupId);
    const displayDate = lesson.viewDate || new Date(lesson.date);

    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 hover:scale-[1.02]"
        style={{ borderLeftColor: subject?.color }}
        onClick={() => handleLessonClick(lesson)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-lg">
                {subject?.name}
              </h3>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {lesson.room}
              </Badge>
            </div>

            {viewMode !== "today" && (
              <div className="text-sm text-gray-500 font-medium">
                {displayDate.toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  weekday: "short",
                })}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lesson.startTime}-{lesson.endTime}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Каб. {lesson.room}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                {group?.name} ({group?.students.length || 0} студентов)
              </div>
              <div className="flex gap-1">
                {lesson.materials && lesson.materials.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Материалы
                  </Badge>
                )}
                {lesson.homework && (
                  <Badge variant="outline" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    ДЗ
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderScheduleModule = () => {
    const lessons = getLessonsForView();

    return (
      <div className="space-y-6">
        {/* Header with View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Расписание занятий
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={viewMode === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("today")}
            >
              Сегодня
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Неделя
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Месяц
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Поиск по предмету, группе или кабинету..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Группа" />
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

              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Предмет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все предметы</SelectItem>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Сегодня
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-lg font-medium text-gray-700">
            {getViewTitle()}
          </h3>
        </div>

        {/* Lessons Display */}
        {lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет занятий
            </h3>
            <p className="text-gray-500">
              На выбранный период занятия не запланированы
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderAnalyticsModule = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Аналитика и статистика
      </h2>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Занятий в месяц</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    LESSONS.filter(
                      (l) =>
                        new Date(l.date).getMonth() === new Date().getMonth(),
                    ).length
                  }
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
                <p className="text-sm text-gray-600">Всего студентов</p>
                <p className="text-2xl font-bold text-gray-900">
                  {GROUPS.reduce((sum, g) => sum + g.students.length, 0)}
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
                <p className="text-sm text-gray-600">Ср. посещаемость</p>
                <p className="text-2xl font-bold text-gray-900">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ср. оценка</p>
                <p className="text-2xl font-bold text-gray-900">4.2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Успеваемость по группам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {GROUPS.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-gray-500">
                      {group.students.length} студентов
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      4.{Math.floor(Math.random() * 5)}
                    </p>
                    <p className="text-xs text-gray-500">средний балл</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Посещаемость по предметам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SUBJECTS.slice(0, 5).map((subject) => {
                const attendance = 85 + Math.floor(Math.random() * 10);
                return (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <p className="font-medium">{subject.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{attendance}%</p>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${attendance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMaterialsModule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Учебные материалы</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Добавить материал
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Библиотека материалов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Лекция 1: Основы программирования",
                type: "file",
                date: "2024-01-15",
              },
              {
                title: "Практическое задание",
                type: "file",
                date: "2024-01-14",
              },
              { title: "Видео урок", type: "video", date: "2024-01-13" },
              { title: "Полезные ссылки", type: "link", date: "2024-01-12" },
            ].map((material, index) => (
              <Card
                key={index}
                className="border hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{material.title}</h4>
                      <Badge variant="outline">
                        {material.type === "file" && (
                          <FileText className="h-3 w-3 mr-1" />
                        )}
                        {material.type === "video" && (
                          <Eye className="h-3 w-3 mr-1" />
                        )}
                        {material.type === "link" && (
                          <MessageSquare className="h-3 w-3 mr-1" />
                        )}
                        {material.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{material.date}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Просмотр
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Скачать
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAttendanceModule = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Управление посещаемостью
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>Сводка посещаемости</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GROUPS.map((group) => (
              <Card key={group.id} className="border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">{group.name}</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">
                          {Math.floor(group.students.length * 0.85)}
                        </div>
                        <div className="text-xs text-green-700">
                          Присутствуют
                        </div>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">
                          {Math.floor(group.students.length * 0.1)}
                        </div>
                        <div className="text-xs text-yellow-700">Опоздали</div>
                      </div>
                      <div className="p-2 bg-red-50 rounded">
                        <div className="text-lg font-bold text-red-600">
                          {Math.floor(group.students.length * 0.05)}
                        </div>
                        <div className="text-xs text-red-700">Отсутствуют</div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Отметить посещаемость
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGradesModule = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Управление оценками</h2>

      <Card>
        <CardHeader>
          <CardTitle>Журнал оценок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {GROUPS.slice(0, 2).map((group) => (
              <Card key={group.id} className="border">
                <CardHeader>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {group.students.slice(0, 5).map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">
                              Средний балл: 4.2
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Выставить оценку
                          </Button>
                          <Button size="sm" variant="outline">
                            История
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">
                    Массовое выставление оценок
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsModule = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Настройки</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Уведомления о посещаемости</p>
                <p className="text-sm text-gray-500">
                  Получать уведомления при низкой посещаемости
                </p>
              </div>
              <Button variant="outline" size="sm">
                Включено
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Напоминания о занятиях</p>
                <p className="text-sm text-gray-500">
                  Напоминания за 30 минут до занятия
                </p>
              </div>
              <Button variant="outline" size="sm">
                Включено
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Экспорт данных</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Экспорт посещаемости
            </Button>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Экспорт оценок
            </Button>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Полный отчет
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeModule) {
      case "schedule":
        return renderScheduleModule();
      case "analytics":
        return renderAnalyticsModule();
      case "materials":
        return renderMaterialsModule();
      case "attendance":
        return renderAttendanceModule();
      case "grades":
        return renderGradesModule();
      case "settings":
        return renderSettingsModule();
      default:
        return renderScheduleModule();
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {moduleNavigation.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id as ScheduleModule)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeModule === module.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {module.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Module Content */}
      {renderContent()}

      {/* Enhanced Lesson Management Dialog */}
      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedLesson && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: getSubjectById(selectedLesson.subjectId)
                        ?.color,
                    }}
                  />
                  {getSubjectById(selectedLesson.subjectId)?.name}
                </DialogTitle>
                <DialogDescription>
                  {new Date(selectedLesson.date).toLocaleDateString("ru-RU")} •{" "}
                  {selectedLesson.startTime} - {selectedLesson.endTime} • Каб.{" "}
                  {selectedLesson.room}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="info">Информация</TabsTrigger>
                  <TabsTrigger value="attendance">Посещаемость</TabsTrigger>
                  <TabsTrigger value="materials">Материалы</TabsTrigger>
                  <TabsTrigger value="homework">ДЗ</TabsTrigger>
                  <TabsTrigger value="notes">Заметки</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Информация о занятии</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Предмет:</span>
                          <span className="font-medium">
                            {getSubjectById(selectedLesson.subjectId)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Группа:</span>
                          <span className="font-medium">
                            {getGroupById(selectedLesson.groupId)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Кабинет:</span>
                          <span className="font-medium">
                            {selectedLesson.room}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Время:</span>
                          <span className="font-medium">
                            {selectedLesson.startTime} -{" "}
                            {selectedLesson.endTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Студентов:</span>
                          <span className="font-medium">
                            {
                              getGroupById(selectedLesson.groupId)?.students
                                .length
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Быстрая статистика</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <div className="text-xl font-bold text-green-600">
                            {
                              attendance.filter((a) => a.status === "present")
                                .length
                            }
                          </div>
                          <div className="text-xs text-green-700">
                            Присутствуют
                          </div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg text-center">
                          <div className="text-xl font-bold text-yellow-600">
                            {
                              attendance.filter((a) => a.status === "late")
                                .length
                            }
                          </div>
                          <div className="text-xs text-yellow-700">
                            Опоздали
                          </div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg text-center">
                          <div className="text-xl font-bold text-red-600">
                            {
                              attendance.filter((a) => a.status === "absent")
                                .length
                            }
                          </div>
                          <div className="text-xs text-red-700">
                            Отсутствуют
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Быстрые действия</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setActiveTab("attendance")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Отметить посещаемость
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("materials")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Добавить материал
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("homework")}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Назначить ДЗ
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Отметить посещаемость</h4>
                    <Button onClick={() => alert("Посещаемость сохранена!")}>
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      const group = getGroupById(selectedLesson.groupId);
                      return group?.students.map((student) => {
                        const record = attendance.find(
                          (a) => a.studentId === student.id,
                        );
                        const status = record?.status || "present";

                        return (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
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

                            <div className="flex items-center gap-2">
                              <Button
                                variant={
                                  status === "present" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  const newAttendance = attendance.map((a) =>
                                    a.studentId === student.id
                                      ? { ...a, status: "present" as const }
                                      : a,
                                  );
                                  if (
                                    !attendance.find(
                                      (a) => a.studentId === student.id,
                                    )
                                  ) {
                                    newAttendance.push({
                                      studentId: student.id,
                                      status: "present",
                                    });
                                  }
                                  setAttendance(newAttendance);
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={
                                  status === "late" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  const newAttendance = attendance.map((a) =>
                                    a.studentId === student.id
                                      ? { ...a, status: "late" as const }
                                      : a,
                                  );
                                  if (
                                    !attendance.find(
                                      (a) => a.studentId === student.id,
                                    )
                                  ) {
                                    newAttendance.push({
                                      studentId: student.id,
                                      status: "late",
                                    });
                                  }
                                  setAttendance(newAttendance);
                                }}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={
                                  status === "absent"
                                    ? "destructive"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  const newAttendance = attendance.map((a) =>
                                    a.studentId === student.id
                                      ? { ...a, status: "absent" as const }
                                      : a,
                                  );
                                  if (
                                    !attendance.find(
                                      (a) => a.studentId === student.id,
                                    )
                                  ) {
                                    newAttendance.push({
                                      studentId: student.id,
                                      status: "absent",
                                    });
                                  }
                                  setAttendance(newAttendance);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="space-y-4">
                  <h4 className="font-medium">Управление материалами</h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-medium text-sm">
                        Добавить новый материал
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <Label>Название материала</Label>
                          <Input
                            value={materialForm.title}
                            onChange={(e) =>
                              setMaterialForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Название материала"
                          />
                        </div>
                        <div>
                          <Label>Тип материала</Label>
                          <Select
                            value={materialForm.type}
                            onValueChange={(value: "file" | "link" | "video") =>
                              setMaterialForm((prev) => ({
                                ...prev,
                                type: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="file">Файл</SelectItem>
                              <SelectItem value="link">Ссылка</SelectItem>
                              <SelectItem value="video">Видео</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea
                            value={materialForm.description}
                            onChange={(e) =>
                              setMaterialForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Описание материала"
                          />
                        </div>
                        {materialForm.type === "file" && (
                          <div>
                            <Label>Файл</Label>
                            <Input type="file" />
                          </div>
                        )}
                        <Button className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Добавить материал
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-medium text-sm">
                        Существующие материалы
                      </h5>
                      <div className="space-y-3">
                        {[
                          {
                            title: "Презентация урока",
                            type: "file",
                            date: "Сегодня",
                          },
                          {
                            title: "Дополнительная литература",
                            type: "link",
                            date: "Вчера",
                          },
                        ].map((material, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">
                                  {material.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {material.date}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="homework" className="space-y-4">
                  <h4 className="font-medium">Домашние задания</h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-medium text-sm">
                        Назначить новое задание
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <Label>Название задания</Label>
                          <Input
                            value={homeworkForm.title}
                            onChange={(e) =>
                              setHomeworkForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Название задания"
                          />
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea
                            value={homeworkForm.description}
                            onChange={(e) =>
                              setHomeworkForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Подробное описание задания"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Дедлайн</Label>
                            <Input
                              type="date"
                              value={homeworkForm.deadline}
                              onChange={(e) =>
                                setHomeworkForm((prev) => ({
                                  ...prev,
                                  deadline: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label>Макс. баллы</Label>
                            <Input
                              type="number"
                              value={homeworkForm.maxPoints}
                              onChange={(e) =>
                                setHomeworkForm((prev) => ({
                                  ...prev,
                                  maxPoints: e.target.value,
                                }))
                              }
                              placeholder="100"
                            />
                          </div>
                        </div>
                        <Button className="w-full">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Назначить задание
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-medium text-sm">Текущие задания</h5>
                      <div className="space-y-3">
                        {[
                          {
                            title: "Решить задачи 1-10",
                            deadline: "2024-01-20",
                            submitted: 15,
                            total: 20,
                          },
                          {
                            title: "Подготовить презентацию",
                            deadline: "2024-01-25",
                            submitted: 8,
                            total: 20,
                          },
                        ].map((hw, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">
                                  {hw.title}
                                </p>
                                <Badge variant="outline">
                                  {hw.submitted}/{hw.total}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500">
                                Дедлайн: {hw.deadline}
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  Проверить
                                </Button>
                                <Button size="sm" variant="outline">
                                  Изменить
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <h4 className="font-medium">Заметки к занятию</h4>
                  <Textarea
                    placeholder="Добавьте заметки о проведенном занятии, важные моменты, замечания по студентам..."
                    rows={8}
                  />
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить заметки
                  </Button>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setLessonDialog(false)}
                >
                  Закрыть
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedTeacherSchedule;
