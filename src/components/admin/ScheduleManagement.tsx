import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Copy,
  History,
  Filter,
  Clock,
  MapPin,
  Users,
  BookOpen,
} from "lucide-react";
import { LESSONS, GROUPS, SUBJECTS, TEACHERS } from "@/lib/data";

const ScheduleManagement = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [lessonDialog, setLessonDialog] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [dialogType, setDialogType] = useState<"create" | "edit">("create");

  const getLessonsForDate = (date: string) => {
    return LESSONS.filter((lesson) => lesson.date === date);
  };

  const filteredLessons = getLessonsForDate(selectedDate).filter((lesson) => {
    if (filterGroup !== "all" && lesson.groupId !== filterGroup) return false;
    if (filterTeacher !== "all" && lesson.teacherId !== filterTeacher)
      return false;
    return true;
  });

  const handleCreateLesson = () => {
    setSelectedLesson(null);
    setDialogType("create");
    setLessonDialog(true);
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setDialogType("edit");
    setLessonDialog(true);
  };

  const handleDeleteLesson = (lesson: any) => {
    if (confirm("Удалить занятие?")) {
      alert("Занятие удалено");
    }
  };

  const handleSaveLesson = () => {
    alert(`Занятие ${dialogType === "create" ? "создано" : "обновлено"}`);
    setLessonDialog(false);
  };

  const timeSlots = [
    "08:00-09:30",
    "09:45-11:15",
    "11:30-13:00",
    "14:00-15:30",
    "15:45-17:15",
    "17:30-19:00",
  ];

  const weekDays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  const renderDragDropEditor = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Визуальный редактор расписания</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Копировать неделю
            </Button>
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              История
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger className="w-40">
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
            <Select value={filterTeacher} onValueChange={setFilterTeacher}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все преподаватели</SelectItem>
                {TEACHERS.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weekly Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-7 gap-1 mb-2">
                <div className="p-2 text-center font-medium text-sm">Время</div>
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center font-medium text-sm"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {timeSlots.map((slot) => (
                <div key={slot} className="grid grid-cols-7 gap-1 mb-1">
                  <div className="p-2 text-center text-xs bg-gray-50 rounded">
                    {slot}
                  </div>
                  {weekDays.map((day) => (
                    <div
                      key={`${day}-${slot}`}
                      className="min-h-[60px] p-1 border-2 border-dashed border-gray-200 rounded hover:border-blue-300 cursor-pointer"
                      onClick={handleCreateLesson}
                    >
                      {/* Mock lesson for demonstration */}
                      {slot === "09:45-11:15" && day === "Понедельник" && (
                        <div className="p-2 bg-blue-100 rounded text-xs">
                          <div className="font-medium">Математика</div>
                          <div className="text-gray-600">ИС-21</div>
                          <div className="text-gray-600">Каб. 201</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTableView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Занятия на {selectedDate}</CardTitle>
          <Button onClick={handleCreateLesson}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить занятие
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Время</TableHead>
              <TableHead>Предмет</TableHead>
              <TableHead>Группа</TableHead>
              <TableHead>Преподаватель</TableHead>
              <TableHead>Кабинет</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLessons.map((lesson) => {
              const subject = SUBJECTS.find((s) => s.id === lesson.subjectId);
              const group = GROUPS.find((g) => g.id === lesson.groupId);
              const teacher = TEACHERS.find((t) => t.id === lesson.teacherId);

              return (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {lesson.startTime}-{lesson.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject?.color }}
                      />
                      {subject?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{group?.name}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{teacher?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {lesson.room}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Активно</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLesson(lesson)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
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
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Управление расписанием
        </h2>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      <Tabs defaultValue="visual" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visual">Визуальный редактор</TabsTrigger>
          <TabsTrigger value="table">Табличный вид</TabsTrigger>
          <TabsTrigger value="conflicts">Конфликты</TabsTrigger>
        </TabsList>

        <TabsContent value="visual">{renderDragDropEditor()}</TabsContent>

        <TabsContent value="table">{renderTableView()}</TabsContent>

        <TabsContent value="conflicts">
          <Card>
            <CardHeader>
              <CardTitle>Конфликты расписания</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="font-medium text-red-900">
                      Конфликт преподавателя
                    </span>
                  </div>
                  <p className="text-sm text-red-800">
                    Гүлмира Жұмабекова назначена на два занятия одновременно
                    (09:45-11:15)
                  </p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline">
                      Исправить
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="font-medium text-yellow-900">
                      Перегрузка кабинета
                    </span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    Кабинет 201 занят более 8 часов в день
                  </p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline">
                      Оптимизировать
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "create"
                ? "Создать занятие"
                : "Редактировать занятие"}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о занятии
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Предмет</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите предмет" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Группа</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите группу" />
                  </SelectTrigger>
                  <SelectContent>
                    {GROUPS.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Преподаватель</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите преподавателя" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEACHERS.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Кабинет</Label>
                <Input placeholder="��омер кабинета" />
              </div>

              <div className="space-y-2">
                <Label>Время начала</Label>
                <Input type="time" />
              </div>

              <div className="space-y-2">
                <Label>Время окончания</Label>
                <Input type="time" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveLesson}>
              {dialogType === "create" ? "Создать" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManagement;
