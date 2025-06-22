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
import {
  CheckCircle,
  Clock,
  X,
  Upload,
  BookOpen,
  Save,
  Calendar,
  Users,
} from "lucide-react";
import {
  getLessonsForDate,
  getGroupById,
  getSubjectById,
  getTeacherById,
  GROUPS,
  Lesson,
  Student,
} from "@/lib/data";

interface AttendanceRecord {
  studentId: string;
  status: "present" | "late" | "absent";
}

const AttendanceManager = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [materialDialog, setMaterialDialog] = useState(false);
  const [homeworkDialog, setHomeworkDialog] = useState(false);
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

  const lessons = getLessonsForDate(selectedDate);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
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
    // In a real app, this would save to the backend
    alert("Посещаемость сохранена!");
    console.log("Attendance saved:", attendance);
  };

  const addMaterial = () => {
    if (!materialForm.title.trim()) return;

    // In a real app, this would upload the file and save to backend
    alert(`Материал "${materialForm.title}" добавлен к уроку!`);
    setMaterialForm({ title: "", description: "", file: null });
    setMaterialDialog(false);
  };

  const addHomework = () => {
    if (!homeworkForm.title.trim() || !homeworkForm.deadline) return;

    // In a real app, this would save to backend
    alert(`Домашнее задание "${homeworkForm.title}" назначено!`);
    setHomeworkForm({ title: "", description: "", deadline: "" });
    setHomeworkDialog(false);
  };

  const getAttendanceStats = () => {
    if (!attendance.length) return { present: 0, late: 0, absent: 0 };

    return attendance.reduce(
      (stats, record) => {
        stats[record.status]++;
        return stats;
      },
      { present: 0, late: 0, absent: 0 },
    );
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Выбор даты и урока
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label>Дата</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="text-sm text-gray-500">
              Найдено уроков: {lessons.length}
            </div>
          </div>

          {lessons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lessons.map((lesson) => {
                const subject = getSubjectById(lesson.subjectId);
                const group = getGroupById(lesson.groupId);

                return (
                  <Card
                    key={lesson.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedLesson?.id === lesson.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">
                            {subject?.name}
                          </h3>
                          <Badge variant="outline">{lesson.room}</Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          {lesson.startTime}-{lesson.endTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          Группа: {group?.name}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Management */}
      {selectedLesson && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Отметка посещаемости
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMaterialDialog(true)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Добавить материал
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHomeworkDialog(true)}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Задать ДЗ
                  </Button>
                  <Button onClick={saveAttendance}>
                    <Save className="h-4 w-4 mr-1" />
                    Сохранить
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.present}
                  </div>
                  <div className="text-sm text-green-700">Присутствуют</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.late}
                  </div>
                  <div className="text-sm text-yellow-700">Опоздали</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.absent}
                  </div>
                  <div className="text-sm text-red-700">Отсутствуют</div>
                </div>
              </div>

              {/* Student List */}
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
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
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
                            onClick={() =>
                              updateAttendance(student.id, "present")
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Был
                          </Button>
                          <Button
                            variant={status === "late" ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateAttendance(student.id, "late")}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Опоздал
                          </Button>
                          <Button
                            variant={
                              status === "absent" ? "destructive" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              updateAttendance(student.id, "absent")
                            }
                          >
                            <X className="h-4 w-4 mr-1" />
                            Нет
                          </Button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Material Dialog */}
      <Dialog open={materialDialog} onOpenChange={setMaterialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить материал</DialogTitle>
            <DialogDescription>
              Загрузите материал для выбранного урока
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material-title">Название материала</Label>
              <Input
                id="material-title"
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

            <div className="space-y-2">
              <Label htmlFor="material-description">Описание</Label>
              <Textarea
                id="material-description"
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

            <div className="space-y-2">
              <Label htmlFor="material-file">Файл</Label>
              <Input
                id="material-file"
                type="file"
                onChange={(e) =>
                  setMaterialForm((prev) => ({
                    ...prev,
                    file: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMaterialDialog(false)}>
              Отмена
            </Button>
            <Button onClick={addMaterial}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Homework Dialog */}
      <Dialog open={homeworkDialog} onOpenChange={setHomeworkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Назначить домашнее задание</DialogTitle>
            <DialogDescription>
              Создайте домашнее задание для группы
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homework-title">Название задания</Label>
              <Input
                id="homework-title"
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

            <div className="space-y-2">
              <Label htmlFor="homework-description">Описание</Label>
              <Textarea
                id="homework-description"
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

            <div className="space-y-2">
              <Label htmlFor="homework-deadline">Дедлайн</Label>
              <Input
                id="homework-deadline"
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHomeworkDialog(false)}>
              Отмена
            </Button>
            <Button onClick={addHomework}>Назначить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceManager;
