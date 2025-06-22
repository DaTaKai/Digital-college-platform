import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MapPin,
  BookOpen,
  Upload,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
} from "lucide-react";
import {
  Lesson,
  getLessonsForDate,
  getSubjectById,
  getTeacherById,
  LESSONS,
} from "@/lib/data";
import { authService } from "@/lib/auth";

interface ScheduleProps {
  view?: "day" | "week";
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

const Schedule = ({
  view = "day",
  selectedDate = new Date(),
  onDateChange,
}: ScheduleProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const user = authService.getCurrentUser();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateISO = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getDaysArray = () => {
    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    }
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleSubmitHomework = () => {
    // This would typically open a file upload dialog
    alert("Функция загрузки домашнего задания будет добавлена");
  };

  const LessonCard = ({ lesson }: { lesson: Lesson }) => {
    const subject = getSubjectById(lesson.subjectId);
    const teacher = getTeacherById(lesson.teacherId);

    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow border-l-4 hover:scale-[1.02] transform transition-transform"
        style={{ borderLeftColor: subject?.color }}
        onClick={() => handleLessonClick(lesson)}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">
                {subject?.name}
              </h3>
              <Badge variant="outline" className="text-xs">
                {lesson.room}
              </Badge>
            </div>
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
            <p className="text-xs text-gray-500 truncate">{teacher?.name}</p>
            {lesson.materials && lesson.materials.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <FileText className="h-3 w-3" />
                Материалы ({lesson.materials.length})
              </div>
            )}
            {lesson.homework && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <BookOpen className="h-3 w-3" />
                Домашнее задание
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const DayView = () => {
    const lessons = getLessonsForDate(formatDateISO(currentDate));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {formatDate(currentDate)}
            </h2>
            {isToday(currentDate) && <Badge className="mt-1">Сегодня</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
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
        </div>

        {lessons.length > 0 ? (
          <div className="space-y-3">
            {lessons
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет занятий
            </h3>
            <p className="text-gray-500">
              На этот день занятия не запланированы
            </p>
          </div>
        )}
      </div>
    );
  };

  const WeekView = () => {
    const days = getDaysArray();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Неделя{" "}
            {days[0].toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
            })}{" "}
            -{" "}
            {days[6].toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
            })}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Эта неделя
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.slice(0, 6).map((day) => {
            const lessons = getLessonsForDate(formatDateISO(day));
            const dayName = day.toLocaleDateString("ru-RU", {
              weekday: "long",
            });

            return (
              <div key={day.toISOString()} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 capitalize">
                    {dayName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {day.getDate()}.
                    {(day.getMonth() + 1).toString().padStart(2, "0")}
                  </span>
                  {isToday(day) && (
                    <Badge variant="default" className="text-xs">
                      Сегодня
                    </Badge>
                  )}
                </div>
                {lessons.length > 0 ? (
                  <div className="space-y-2">
                    {lessons
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((lesson) => (
                        <LessonCard key={lesson.id} lesson={lesson} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Нет занятий
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {view === "day" ? <DayView /> : <WeekView />}

      {/* Lesson Details Dialog */}
      <Dialog
        open={!!selectedLesson}
        onOpenChange={() => setSelectedLesson(null)}
      >
        <DialogContent className="max-w-2xl">
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
                  Подробная информация о занятии
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Time and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      Время
                    </div>
                    <p className="font-medium">
                      {selectedLesson.startTime} - {selectedLesson.endTime}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      Кабинет
                    </div>
                    <p className="font-medium">{selectedLesson.room}</p>
                  </div>
                </div>

                <Separator />

                {/* Teacher */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    Преподаватель
                  </div>
                  <p className="font-medium">
                    {getTeacherById(selectedLesson.teacherId)?.name}
                  </p>
                </div>

                {/* Materials */}
                {selectedLesson.materials &&
                  selectedLesson.materials.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Материалы</h4>
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
                    </>
                  )}

                {/* Homework */}
                {selectedLesson.homework && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Домашнее задание
                      </h4>
                      <div className="p-3 bg-orange-50 rounded-md border border-orange-200">
                        <h5 className="font-medium text-orange-900 mb-2">
                          {selectedLesson.homework.title}
                        </h5>
                        <p className="text-sm text-orange-800 mb-3">
                          {selectedLesson.homework.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-orange-700">
                            Дедлайн:{" "}
                            {new Date(
                              selectedLesson.homework.deadline,
                            ).toLocaleDateString("ru-RU")}
                          </div>
                          {user?.role === "student" && (
                            <Button size="sm" onClick={handleSubmitHomework}>
                              <Upload className="h-4 w-4 mr-1" />
                              Сдать работу
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
