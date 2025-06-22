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
  BookOpen,
  Clock,
  Upload,
  Download,
  FileText,
  Filter,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  getLessonsForGroup,
  getSubjectById,
  SUBJECTS,
  Lesson,
} from "@/lib/data";
import { authService } from "@/lib/auth";

const HomeworkAssignments = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedHomework, setSelectedHomework] = useState<Lesson | null>(null);
  const [submissionDialog, setSubmissionDialog] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const user = authService.getCurrentUser();

  if (!user) return null;

  // Get all lessons with homework
  const allLessons = getLessonsForGroup(user.groupId || "");
  const homeworkLessons = allLessons.filter((lesson) => lesson.homework);

  // Filter by subject if selected
  const filteredLessons =
    selectedSubject === "all"
      ? homeworkLessons
      : homeworkLessons.filter(
          (lesson) => lesson.subjectId === selectedSubject,
        );

  // Sort by deadline
  const sortedLessons = filteredLessons.sort((a, b) => {
    const deadlineA = new Date(a.homework?.deadline || "");
    const deadlineB = new Date(b.homework?.deadline || "");
    return deadlineA.getTime() - deadlineB.getTime();
  });

  const handleHomeworkClick = (lesson: Lesson) => {
    setSelectedHomework(lesson);
    setSubmissionDialog(true);
  };

  const handleSubmit = () => {
    if (submissionFile) {
      alert(`Файл "${submissionFile.name}" успешно загружен!`);
    } else {
      alert("Домашнее задание помечено как выполненное!");
    }
    setSubmissionDialog(false);
    setSubmissionFile(null);
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return "overdue";
    if (days <= 1) return "urgent";
    if (days <= 3) return "soon";
    return "normal";
  };

  const getStatusBadge = (deadline: string) => {
    const urgency = getUrgencyLevel(deadline);
    const days = getDaysUntilDeadline(deadline);

    switch (urgency) {
      case "overdue":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Просрочено
          </Badge>
        );
      case "urgent":
        return (
          <Badge variant="destructive" className="gap-1">
            <Clock className="h-3 w-3" />
            {days === 0 ? "Сегодня" : "Завтра"}
          </Badge>
        );
      case "soon":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {days} дня
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            {days} дне��
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Домашние задания</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Выберите предмет" />
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {filteredLessons.length}
            </div>
            <div className="text-sm text-gray-600">Всего заданий</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {
                filteredLessons.filter((l) =>
                  isOverdue(l.homework?.deadline || ""),
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Просрочено</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {
                filteredLessons.filter(
                  (l) =>
                    getUrgencyLevel(l.homework?.deadline || "") === "urgent",
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Срочные</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {
                filteredLessons.filter(
                  (l) =>
                    !isOverdue(l.homework?.deadline || "") &&
                    getUrgencyLevel(l.homework?.deadline || "") !== "urgent",
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">В срок</div>
          </CardContent>
        </Card>
      </div>

      {/* Homework Cards */}
      {sortedLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedLessons.map((lesson) => {
            const subject = getSubjectById(lesson.subjectId);
            const homework = lesson.homework!;

            return (
              <Card
                key={lesson.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isOverdue(homework.deadline)
                    ? "border-red-200 bg-red-50"
                    : getUrgencyLevel(homework.deadline) === "urgent"
                      ? "border-orange-200 bg-orange-50"
                      : ""
                }`}
                onClick={() => handleHomeworkClick(lesson)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject?.color }}
                      />
                      <Badge variant="outline">{subject?.name}</Badge>
                    </div>
                    {getStatusBadge(homework.deadline)}
                  </div>
                  <CardTitle className="text-lg">{homework.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {homework.description}
                  </p>

                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Дедлайн:{" "}
                      {new Date(homework.deadline).toLocaleDateString("ru-RU")}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3 w-3" />
                      Урок от{" "}
                      {new Date(lesson.date).toLocaleDateString("ru-RU")}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      {lesson.materials && lesson.materials.length > 0 && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <FileText className="h-3 w-3" />
                          Материалы
                        </Badge>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      Открыть
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedSubject === "all"
              ? "Нет домашних заданий"
              : "Нет заданий по выбранному предмету"}
          </h3>
          <p className="text-gray-500">
            {selectedSubject === "all"
              ? "Домашние задания будут появляться здесь"
              : "Попробуйте выбрать другой предмет"}
          </p>
        </div>
      )}

      {/* Submission Dialog */}
      <Dialog open={submissionDialog} onOpenChange={setSubmissionDialog}>
        <DialogContent className="max-w-2xl">
          {selectedHomework && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {selectedHomework.homework?.title}
                </DialogTitle>
                <DialogDescription>
                  {getSubjectById(selectedHomework.subjectId)?.name} •{" "}
                  {new Date(selectedHomework.date).toLocaleDateString("ru-RU")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Описание задания</h4>
                  <p className="text-sm text-gray-700">
                    {selectedHomework.homework?.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Дедлайн</p>
                    <p className="text-sm text-orange-700">
                      {new Date(
                        selectedHomework.homework?.deadline || "",
                      ).toLocaleDateString("ru-RU", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {getStatusBadge(selectedHomework.homework?.deadline || "")}
                </div>

                {/* Materials */}
                {selectedHomework.materials &&
                  selectedHomework.materials.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Материалы к уроку</h4>
                      {selectedHomework.materials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
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
                  )}

                {/* File Upload */}
                <div className="space-y-3 pt-4 border-t">
                  <Label htmlFor="submission-file">
                    Загрузить выполненное задание
                  </Label>
                  <Input
                    id="submission-file"
                    type="file"
                    onChange={(e) =>
                      setSubmissionFile(e.target.files?.[0] || null)
                    }
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip"
                  />
                  {submissionFile && (
                    <p className="text-sm text-green-600">
                      ✓ Выбран файл: {submissionFile.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Поддерживаемые форматы: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSubmissionDialog(false)}
                >
                  Закрыть
                </Button>
                <Button onClick={handleSubmit}>
                  <Upload className="h-4 w-4 mr-2" />
                  Сдать задание
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeworkAssignments;
