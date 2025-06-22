import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Upload,
  FileText,
  Plus,
  Save,
  Calendar,
  Users,
  Star,
} from "lucide-react";
import {
  getLessonsForGroup,
  getGroupById,
  getSubjectById,
  GROUPS,
  LESSONS,
  GRADES,
} from "@/lib/data";

interface CellAction {
  type: "grade" | "material" | "homework";
  lessonId: string;
  studentId?: string;
}

const GradingJournal = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>("is_21");
  const [actionDialog, setActionDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<CellAction | null>(null);
  const [gradeValue, setGradeValue] = useState("");
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

  const group = getGroupById(selectedGroup);
  const lessons = getLessonsForGroup(selectedGroup);

  // Get unique dates for column headers
  const lessonDates = [...new Set(lessons.map((l) => l.date))].sort();

  const handleCellClick = (action: CellAction) => {
    setCurrentAction(action);
    setActionDialog(true);
  };

  const saveGrade = () => {
    if (!currentAction || !gradeValue) return;

    // In a real app, this would save to backend
    alert(`Оценка "${gradeValue}" поставлена!`);
    setGradeValue("");
    setActionDialog(false);
  };

  const saveMaterial = () => {
    if (!currentAction || !materialForm.title) return;

    // In a real app, this would save to backend
    alert(`Материал "${materialForm.title}" добавлен к уроку!`);
    setMaterialForm({ title: "", description: "", file: null });
    setActionDialog(false);
  };

  const saveHomework = () => {
    if (!currentAction || !homeworkForm.title || !homeworkForm.deadline) return;

    // In a real app, this would save to backend
    alert(`Домашнее задание "${homeworkForm.title}" назначено!`);
    setHomeworkForm({ title: "", description: "", deadline: "" });
    setActionDialog(false);
  };

  const getExistingGrade = (studentId: string, lessonId: string) => {
    return GRADES.find(
      (g) => g.studentId === studentId && g.lessonId === lessonId,
    );
  };

  const getLessonForDate = (date: string) => {
    return lessons.find((l) => l.date === date);
  };

  const hasLessonMaterials = (lessonId: string) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    return lesson?.materials && lesson.materials.length > 0;
  };

  const hasLessonHomework = (lessonId: string) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    return lesson?.homework;
  };

  return (
    <div className="space-y-6">
      {/* Group Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Журнал оценок и материалов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label>Группа</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-48">
                  <SelectValue />
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
            {group && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                {group.students.length} студентов
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grading Table */}
      {group && (
        <Card>
          <CardHeader>
            <CardTitle>Журнал группы {group.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-48">Студент</TableHead>
                    {lessonDates.map((date) => {
                      const lesson = getLessonForDate(date);
                      const subject = lesson
                        ? getSubjectById(lesson.subjectId)
                        : null;
                      return (
                        <TableHead key={date} className="min-w-40 text-center">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {new Date(date).toLocaleDateString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {subject?.name}
                            </div>
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div>{student.name}</div>
                          <div className="text-xs text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </TableCell>
                      {lessonDates.map((date) => {
                        const lesson = getLessonForDate(date);
                        if (!lesson) return <TableCell key={date}></TableCell>;

                        const existingGrade = getExistingGrade(
                          student.id,
                          lesson.id,
                        );
                        const hasMaterials = hasLessonMaterials(lesson.id);
                        const hasHomework = hasLessonHomework(lesson.id);

                        return (
                          <TableCell key={date} className="text-center">
                            <div className="space-y-2">
                              {/* Grade Section */}
                              <div>
                                {existingGrade ? (
                                  <Badge
                                    variant={
                                      typeof existingGrade.value === "number"
                                        ? existingGrade.value >= 4
                                          ? "default"
                                          : existingGrade.value >= 3
                                            ? "secondary"
                                            : "destructive"
                                        : "outline"
                                    }
                                  >
                                    {existingGrade.value}
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleCellClick({
                                        type: "grade",
                                        lessonId: lesson.id,
                                        studentId: student.id,
                                      })
                                    }
                                  >
                                    <Star className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>

                              {/* Actions Section */}
                              <div className="flex gap-1 justify-center">
                                <Button
                                  variant={hasMaterials ? "default" : "outline"}
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    handleCellClick({
                                      type: "material",
                                      lessonId: lesson.id,
                                    })
                                  }
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant={hasHomework ? "default" : "outline"}
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    handleCellClick({
                                      type: "homework",
                                      lessonId: lesson.id,
                                    })
                                  }
                                >
                                  <BookOpen className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <div>
                <strong>Условные обозначения:</strong>
              </div>
              <div>• Нажмите на звёздочку для выставления оценки</div>
              <div>
                • <FileText className="inline h-3 w-3" /> — добавить/просмотреть
                материалы
              </div>
              <div>
                • <BookOpen className="inline h-3 w-3" /> — добавить/просмотреть
                домашнее задание
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog} onOpenChange={setActionDialog}>
        <DialogContent>
          {currentAction && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {currentAction.type === "grade"
                    ? "Поставить оценку"
                    : currentAction.type === "material"
                      ? "Добавить материал"
                      : "Добавить домашнее задание"}
                </DialogTitle>
                <DialogDescription>
                  {currentAction.type === "grade"
                    ? "Выставите оценку студенту за урок"
                    : currentAction.type === "material"
                      ? "Добавьте материал к уроку"
                      : "Назначьте домашнее задание"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {currentAction.type === "grade" && (
                  <div className="space-y-2">
                    <Label>Оценка</Label>
                    <Select value={gradeValue} onValueChange={setGradeValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите оценку" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 (отлично)</SelectItem>
                        <SelectItem value="4">4 (хорошо)</SelectItem>
                        <SelectItem value="3">3 (удовлетворительно)</SelectItem>
                        <SelectItem value="2">
                          2 (неудовлетворительно)
                        </SelectItem>
                        <SelectItem value="НБ">НБ (не был)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {currentAction.type === "material" && (
                  <>
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                  </>
                )}

                {currentAction.type === "homework" && (
                  <>
                    <div className="space-y-2">
                      <Label>Название задания</Label>
                      <Input
                        value={homeworkForm.title}
                        onChange={(e) =>
                          setHomeworkForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Например: Решить зада��и 1-10"
                      />
                    </div>
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                  </>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setActionDialog(false)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={
                    currentAction.type === "grade"
                      ? saveGrade
                      : currentAction.type === "material"
                        ? saveMaterial
                        : saveHomework
                  }
                >
                  {currentAction.type === "grade"
                    ? "Поставить"
                    : currentAction.type === "material"
                      ? "Добавить"
                      : "Назначить"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradingJournal;
