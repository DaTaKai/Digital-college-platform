import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileDialog } from "@/components/ui/mobile-dialog";
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
import { useMobileOptimized } from "@/hooks/use-mobile-optimized";

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

const EnhancedTeacherSchedule = () => {
  const { getCardCols, getFormCols, isMobile } = useMobileOptimized();
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
    {
      id: "schedule",
      label: isMobile ? "Расписание" : "Расписание",
      icon: Calendar,
    },
    {
      id: "analytics",
      label: isMobile ? "Аналитика" : "Аналитика",
      icon: BarChart3,
    },
    {
      id: "materials",
      label: isMobile ? "Материалы" : "Материалы",
      icon: FileText,
    },
    {
      id: "attendance",
      label: isMobile ? "Посещение" : "Посещаемость",
      icon: Users,
    },
    { id: "grades", label: isMobile ? "Оценки" : "Оценки", icon: Award },
    {
      id: "settings",
      label: isMobile ? "Настройки" : "Настройки",
      icon: Settings,
    },
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
          weekday: isMobile ? "short" : "long",
          year: "numeric",
          month: isMobile ? "short" : "long",
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
          month: isMobile ? "short" : "long",
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
        <CardContent className={`${isMobile ? "p-3" : "p-4"}`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3
                className={`font-semibold text-gray-900 ${isMobile ? "text-base" : "text-lg"}`}
              >
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
                {group?.name} ({group?.students.length || 0})
              </div>
              <div className="flex gap-1">
                {lesson.materials && lesson.materials.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {isMobile ? "М" : "Материалы"}
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
      <div className="space-y-4 md:space-y-6">
        {/* Header with View Controls */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Расписание занятий
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto">
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
            <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={
                      isMobile
                        ? "Поиск..."
                        : "Поиск по предмету, группе или кабинету..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-full md:w-40">
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
                  <SelectTrigger className="w-full md:w-40">
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
          <h3
            className={`font-medium text-gray-700 ${isMobile ? "text-sm" : "text-lg"}`}
          >
            {getViewTitle()}
          </h3>
        </div>

        {/* Lessons Display */}
        {lessons.length > 0 ? (
          <div className={`grid ${getCardCols()} gap-4`}>
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
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Аналитика и статистика
      </h2>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 md:h-5 w-4 md:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Занятий в месяц
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
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
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 md:h-5 w-4 md:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Всего студентов
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {GROUPS.reduce((sum, g) => sum + g.students.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-4 md:h-5 w-4 md:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Ср. посещаемость
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  89%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 md:h-5 w-4 md:w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Ср. оценка</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  4.2
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts placeholder - mobile optimized */}
      <Card>
        <CardHeader>
          <CardTitle>График активности</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">График будет здесь</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeModule) {
      case "schedule":
        return renderScheduleModule();
      case "analytics":
        return renderAnalyticsModule();
      default:
        return renderScheduleModule();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Module Navigation - Mobile optimized */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 md:space-x-8 overflow-x-auto">
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

      {/* Enhanced Lesson Management Dialog - Mobile optimized */}
      {selectedLesson && (
        <MobileDialog
          open={lessonDialog}
          onOpenChange={setLessonDialog}
          title={
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: getSubjectById(selectedLesson.subjectId)
                    ?.color,
                }}
              />
              {getSubjectById(selectedLesson.subjectId)?.name}
            </div>
          }
          description={`${new Date(selectedLesson.date).toLocaleDateString("ru-RU")} • ${selectedLesson.startTime} - ${selectedLesson.endTime} • Каб. ${selectedLesson.room}`}
          footer={
            <Button
              variant="outline"
              onClick={() => setLessonDialog(false)}
              className="w-full"
            >
              Закрыть
            </Button>
          }
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1">
              <TabsTrigger value="info" className="text-xs sm:text-sm">
                {isMobile ? "Инфо" : "Информация"}
              </TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs sm:text-sm">
                {isMobile ? "Посещение" : "Посещаемость"}
              </TabsTrigger>
              <TabsTrigger value="materials" className="text-xs sm:text-sm">
                Материалы
              </TabsTrigger>
              <TabsTrigger value="homework" className="text-xs sm:text-sm">
                ДЗ
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs sm:text-sm">
                Заметки
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className={`grid ${getFormCols()} gap-6`}>
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
                      <span className="font-medium">{selectedLesson.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Время:</span>
                      <span className="font-medium">
                        {selectedLesson.startTime} - {selectedLesson.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                {!isMobile && (
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
                          {attendance.filter((a) => a.status === "late").length}
                        </div>
                        <div className="text-xs text-yellow-700">Опоздали</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg text-center">
                        <div className="text-xl font-bold text-red-600">
                          {
                            attendance.filter((a) => a.status === "absent")
                              .length
                          }
                        </div>
                        <div className="text-xs text-red-700">Отсутствуют</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Быстрые действия</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("attendance")}
                    className="w-full"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Посещаемость
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("materials")}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Материалы
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("homework")}
                    className="w-full"
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
                <Button
                  onClick={() => alert("Посещаемость сохранена!")}
                  size="sm"
                >
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
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
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
                            <p className="font-medium text-sm">
                              {student.name}
                            </p>
                            {!isMobile && (
                              <p className="text-xs text-gray-500">
                                {student.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
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
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            variant={status === "late" ? "default" : "outline"}
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
                            <Clock className="h-3 w-3" />
                          </Button>
                          <Button
                            variant={
                              status === "absent" ? "destructive" : "outline"
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
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <h4 className="font-medium">Добавить материал</h4>
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
                    placeholder="Например: Презентация..."
                  />
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
                    placeholder="Краткое описание"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Файл</Label>
                  <Input type="file" />
                </div>
                <Button
                  onClick={() => alert("Материал добавлен!")}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Добавить материал
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="homework" className="space-y-4">
              <h4 className="font-medium">Назначить домашнее задание</h4>
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
                    placeholder="Например: Решить задачи 1-10"
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
                    placeholder="Подробное описание"
                    rows={3}
                  />
                </div>
                <div className={`grid ${getFormCols()} gap-3`}>
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
                <Button
                  onClick={() => alert("Задание назначено!")}
                  className="w-full"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Назначить задание
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <h4 className="font-medium">Заметки к занятию</h4>
              <Textarea
                placeholder="Добавьте заметки о проведенном занятии..."
                rows={isMobile ? 4 : 6}
              />
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Сохранить заметки
              </Button>
            </TabsContent>
          </Tabs>
        </MobileDialog>
      )}
    </div>
  );
};

export default EnhancedTeacherSchedule;
