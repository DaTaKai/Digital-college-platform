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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Calendar,
  Download,
  Upload,
  FileText,
  BookOpen,
  Clock,
} from "lucide-react";
import {
  getLessonsForGroup,
  getSubjectById,
  getGradesForStudent,
  GRADES,
  Lesson,
  Subject,
} from "@/lib/data";
import { authService } from "@/lib/auth";

interface SubjectGradesProps {
  subjectId: string;
  onBack: () => void;
}

const SubjectGrades = ({ subjectId, onBack }: SubjectGradesProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [homeworkDialog, setHomeworkDialog] = useState(false);
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null);
  const user = authService.getCurrentUser();

  if (!user) return null;

  const subject = getSubjectById(subjectId);
  const lessons = getLessonsForGroup(user.groupId || "").filter(
    (lesson) => lesson.subjectId === subjectId,
  );
  const studentGrades = getGradesForStudent(user.id);

  // Group lessons by date and sort chronologically
  const lessonsByDate = lessons
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce(
      (acc, lesson) => {
        if (!acc[lesson.date]) {
          acc[lesson.date] = [];
        }
        acc[lesson.date].push(lesson);
        return acc;
      },
      {} as Record<string, Lesson[]>,
    );

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setHomeworkDialog(true);
  };

  const handleHomeworkSubmit = () => {
    if (homeworkFile) {
      alert(`Файл "${homeworkFile.name}" успешно загружен!`);
    } else {
      alert("Домашнее задание помечено как выполненное!");
    }
    setHomeworkDialog(false);
    setHomeworkFile(null);
  };

  const getGradeForLesson = (lessonId: string) => {
    return studentGrades.find((g) => g.lessonId === lessonId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  };

  const isPast = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString < today;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: subject?.color }}
          />
          <h2 className="text-2xl font-bold text-gray-900">
            {subject?.name} - Журнал оценок
          </h2>
        </div>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Оценки по датам занятий</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Кабинет</TableHead>
                <TableHead className="text-center">Оценка</TableHead>
                <TableHead className="text-center">Материалы</TableHead>
                <TableHead className="text-center">Домашнее задание</TableHead>
                <TableHead className="text-center">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(lessonsByDate).map(([date, dateLessons]) =>
                dateLessons.map((lesson) => {
                  const grade = getGradeForLesson(lesson.id);
                  const hasMaterials =
                    lesson.materials && lesson.materials.length > 0;
                  const hasHomework = lesson.homework;

                  return (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {formatDate(date)}
                          {isToday(date) && (
                            <Badge variant="default" className="text-xs">
                              Сегодня
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lesson.startTime} - {lesson.endTime}
                      </TableCell>
                      <TableCell>{lesson.room}</TableCell>
                      <TableCell className="text-center">
                        {grade ? (
                          <Badge
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
                        ) : isPast(date) ? (
                          <span className="text-gray-400">НБ</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {hasMaterials ? (
                          <Badge variant="outline" className="gap-1">
                            <FileText className="h-3 w-3" />
                            {lesson.materials?.length}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {hasHomework ? (
                          <Badge
                            variant={
                              new Date(lesson.homework?.deadline || "") <
                              new Date()
                                ? "destructive"
                                : "outline"
                            }
                            className="gap-1"
                          >
                            <BookOpen className="h-3 w-3" />
                            {new Date(lesson.homework?.deadline || "") <
                            new Date()
                              ? "Просрочено"
                              : "Активно"}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLessonClick(lesson)}
                          disabled={!hasMaterials && !hasHomework}
                        >
                          Открыть
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lesson Details Dialog */}
      <Dialog open={homeworkDialog} onOpenChange={setHomeworkDialog}>
        <DialogContent className="max-w-2xl">
          {selectedLesson && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Занятие от {formatDate(selectedLesson.date)}
                </DialogTitle>
                <DialogDescription>
                  {selectedLesson.startTime} - {selectedLesson.endTime}, каб.{" "}
                  {selectedLesson.room}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Materials Section */}
                {selectedLesson.materials &&
                  selectedLesson.materials.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Материалы к уроку
                      </h4>
                      <div className="space-y-2">
                        {selectedLesson.materials.map((material) => (
                          <div
                            key={material.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {material.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                {material.description}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Скачать
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Homework Section */}
                {selectedLesson.homework && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Домашнее задание
                    </h4>
                    <div className="p-4 bg-orange-50 rounded-md border border-orange-200">
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-orange-900">
                            {selectedLesson.homework.title}
                          </h5>
                          <p className="text-sm text-orange-800 mt-1">
                            {selectedLesson.homework.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-orange-700">
                            <Clock className="h-4 w-4" />
                            Дедлайн:{" "}
                            {new Date(
                              selectedLesson.homework.deadline,
                            ).toLocaleDateString("ru-RU")}
                          </div>
                          {new Date(selectedLesson.homework.deadline) <
                            new Date() && (
                            <Badge variant="destructive">Просрочено</Badge>
                          )}
                        </div>

                        <div className="space-y-3 pt-2 border-t border-orange-200">
                          <div className="space-y-2">
                            <Label htmlFor="homework-file">
                              Загрузить выполненное задание
                            </Label>
                            <Input
                              id="homework-file"
                              type="file"
                              onChange={(e) =>
                                setHomeworkFile(e.target.files?.[0] || null)
                              }
                              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                            />
                            {homeworkFile && (
                              <p className="text-xs text-gray-600">
                                Выбран файл: {homeworkFile.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setHomeworkDialog(false)}
                >
                  Закрыть
                </Button>
                {selectedLesson.homework && (
                  <Button onClick={handleHomeworkSubmit}>
                    <Upload className="h-4 w-4 mr-2" />
                    Сдать задание
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectGrades;
