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
} from "lucide-react";
import {
  getLessonsForDate,
  getGroupById,
  getSubjectById,
  LESSONS,
} from "@/lib/data";

type ViewMode = "today" | "week" | "month";

interface AttendanceRecord {
  studentId: string;
  status: "present" | "late" | "absent";
}

const TeacherSchedule = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("today");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });
  const [homeworkForm, setHomeworkForm] = useState({
    title: "",
    description: "",
    deadline: "",
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

  const updateAttendance = (
    studentId: string,
    status: "present" | "late" | "absent",
  ) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record,
      ),
    );
  };

  const saveAttendance = () => {
    alert("Посещаемость сохранена!");
    console.log("Attendance saved:", attendance);
  };

  const addMaterial = () => {
    if (!materialForm.title.trim()) return;
    alert(`Материал "${materialForm.title}" добавлен к уроку!`);
    setMaterialForm({ title: "", description: "", file: null });
  };

  const addHomework = () => {
    if (!homeworkForm.title.trim() || !homeworkForm.deadline) return;
    alert(`Домашнее задание "${homeworkForm.title}" назначено!`);
    setHomeworkForm({ title: "", description: "", deadline: "" });
  };

  // Get lessons based on view mode
  const getLessonsForView = () => {
    switch (viewMode) {
      case "today":
        return getLessonsForDate(formatDateISO(currentDate));
      case "week":
        const weekLessons = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          const dayLessons = getLessonsForDate(formatDateISO(date));
          weekLessons.push(
            ...dayLessons.map((lesson) => ({ ...lesson, viewDate: date })),
          );
        }
        return weekLessons;
      case "month":
        const monthLessons = [];
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
          monthLessons.push(
            ...dayLessons.map((lesson) => ({
              ...lesson,
              viewDate: new Date(d),
            })),
          );
        }
        return monthLessons;
      default:
        return [];
    }
  };

  const lessons = getLessonsForView();

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
        className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
        style={{ borderLeftColor: subject?.color }}
        onClick={() => handleLessonClick(lesson)}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{subject?.name}</h3>
              <Badge variant="outline">{lesson.room}</Badge>
            </div>

            {viewMode !== "today" && (
              <div className="text-xs text-gray-500">
                {displayDate.toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lesson.startTime}-{lesson.endTime}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Каб. {lesson.room}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              Группа: {group?.name} ({group?.students.length || 0} студентов)
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Расписание</h2>

        {/* View Mode Selector */}
        <div className="flex items-center gap-2">
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
        <h3 className="text-lg font-medium text-gray-700">{getViewTitle()}</h3>
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

      {/* Lesson Management Dialog */}
      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">Информация</TabsTrigger>
                  <TabsTrigger value="attendance">Посещаемость</TabsTrigger>
                  <TabsTrigger value="materials">Материалы</TabsTrigger>
                  <TabsTrigger value="homework">Домашнее задание</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Информация о занятии</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          Предмет:{" "}
                          {getSubjectById(selectedLesson.subjectId)?.name}
                        </div>
                        <div>
                          Группа: {getGroupById(selectedLesson.groupId)?.name}
                        </div>
                        <div>Кабинет: {selectedLesson.room}</div>
                        <div>
                          Время: {selectedLesson.startTime} -{" "}
                          {selectedLesson.endTime}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Статистика</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">
                            {
                              attendance.filter((a) => a.status === "present")
                                .length
                            }
                          </div>
                          <div className="text-xs text-green-700">Присут.</div>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded">
                          <div className="text-lg font-bold text-yellow-600">
                            {
                              attendance.filter((a) => a.status === "late")
                                .length
                            }
                          </div>
                          <div className="text-xs text-yellow-700">Опозд.</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded">
                          <div className="text-lg font-bold text-red-600">
                            {
                              attendance.filter((a) => a.status === "absent")
                                .length
                            }
                          </div>
                          <div className="text-xs text-red-700">Отсут.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Отметить посещаемость</h4>
                    <Button onClick={saveAttendance}>
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
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={student.avatar}
                                  alt={student.name}
                                />
                                <AvatarFallback className="text-xs">
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
                                <p className="text-xs text-gray-500">
                                  {student.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant={
                                  status === "present" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  updateAttendance(student.id, "present")
                                }
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                variant={
                                  status === "late" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  updateAttendance(student.id, "late")
                                }
                              >
                                <Clock className="h-3 w-3" />
                              </Button>
                              <Button
                                variant={
                                  status === "absent"
                                    ? "destructive"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  updateAttendance(student.id, "absent")
                                }
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
                  <div className="space-y-4">
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
                          placeholder="Например: Презентация по теме..."
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
                          placeholder="Краткое описание материала"
                        />
                      </div>

                      <div>
                        <Label>Файл</Label>
                        <Input
                          type="file"
                          onChange={(e) =>
                            setMaterialForm((prev) => ({
                              ...prev,
                              file: e.target.files?.[0] || null,
                            }))
                          }
                        />
                      </div>

                      <Button onClick={addMaterial} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Добавить материал
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="homework" className="space-y-4">
                  <div className="space-y-4">
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
                          placeholder="Подробное описание задания"
                        />
                      </div>

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

                      <Button onClick={addHomework} className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Назначить задание
                      </Button>
                    </div>
                  </div>
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

export default TeacherSchedule;
