import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Star,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Flag,
  Send,
  FileText,
  Users,
  ThumbsUp,
  ThumbsDown,
  Plus,
} from "lucide-react";
import { TEACHERS, GROUPS, SUBJECTS, LESSONS } from "@/lib/data";

const QualityControl = () => {
  const [activeTab, setActiveTab] = useState("materials");
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [surveyDialog, setSurveyDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data for content moderation
  const pendingMaterials = [
    {
      id: "mat_1",
      title: "Введение в квантовую физику",
      teacher: "Лейла Қапарова",
      subject: "Физика",
      uploadDate: "2024-01-15",
      status: "pending",
      type: "pdf",
      size: "2.3 MB",
    },
    {
      id: "mat_2",
      title: "Python для начинающих",
      teacher: "Гүлмира Жұмабекова",
      subject: "Информатика",
      uploadDate: "2024-01-14",
      status: "approved",
      type: "video",
      size: "15.7 MB",
    },
    {
      id: "mat_3",
      title: "История Казахстана",
      teacher: "Мұрат Тастанбеков",
      subject: "История",
      uploadDate: "2024-01-13",
      status: "rejected",
      type: "presentation",
      size: "4.1 MB",
      reason: "Неполная информация",
    },
  ];

  const teacherRatings = TEACHERS.map((teacher, index) => ({
    ...teacher,
    avgRating: 4.2 + Math.random() * 0.7,
    totalReviews: Math.floor(Math.random() * 50) + 20,
    materials: Math.floor(Math.random() * 15) + 5,
    punctuality: 85 + Math.random() * 15,
    engagement: 80 + Math.random() * 20,
  }));

  const studentFeedback = [
    {
      id: "fb_1",
      student: "Айдар Қасымов",
      teacher: "Гүлмира Жұмабекова",
      subject: "Математика",
      rating: 5,
      comment: "Отличное объяснение материала, всё понятно",
      date: "2024-01-15",
      status: "public",
    },
    {
      id: "fb_2",
      student: "Асем Нұрланова",
      teacher: "Мұрат Тастанбеков",
      subject: "История",
      rating: 4,
      comment: "Интересные лекции, но хотелось бы больше практики",
      date: "2024-01-14",
      status: "public",
    },
    {
      id: "fb_3",
      student: "Дәурен Әлібеков",
      teacher: "Лейла Қапарова",
      subject: "Физика",
      rating: 2,
      comment: "Слишком сложно, не успеваю за темпом",
      date: "2024-01-13",
      status: "flagged",
    },
  ];

  const complaints = [
    {
      id: "comp_1",
      reporter: "Анонимно",
      against: "Мұрат Тастанбеков",
      type: "teaching",
      description: "Постоянные опоздания на занятия",
      date: "2024-01-15",
      status: "investigating",
      priority: "medium",
    },
    {
      id: "comp_2",
      reporter: "Мереке Сапарова",
      against: "Система оценивания",
      type: "system",
      description: "Баллы не начисляются за выполненные задания",
      date: "2024-01-14",
      status: "resolved",
      priority: "high",
    },
  ];

  const handleApproveMaterial = (material: any) => {
    alert(`Материал "${material.title}" одобрен`);
  };

  const handleRejectMaterial = (material: any) => {
    setSelectedItem(material);
    setFeedbackDialog(true);
  };

  const handleCreateSurvey = () => {
    setSurveyDialog(true);
  };

  const handleSendSurvey = () => {
    alert("Опрос отправлен всем студентам");
    setSurveyDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      case "flagged":
        return "destructive";
      case "investigating":
        return "secondary";
      case "resolved":
        return "default";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const renderMaterialsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Модерация материалов</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Материал</TableHead>
              <TableHead>Преподаватель</TableHead>
              <TableHead>Предмет</TableHead>
              <TableHead>Дата загрузки</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingMaterials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{material.title}</div>
                    <div className="text-sm text-gray-500">
                      {material.type.toUpperCase()} • {material.size}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{material.teacher}</TableCell>
                <TableCell>{material.subject}</TableCell>
                <TableCell>
                  {new Date(material.uploadDate).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(material.status) as any}>
                    {material.status === "pending"
                      ? "На модерации"
                      : material.status === "approved"
                        ? "Одобрено"
                        : "Отклонено"}
                  </Badge>
                  {material.status === "rejected" && material.reason && (
                    <div className="text-xs text-red-600 mt-1">
                      {material.reason}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {material.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveMaterial(material)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectMaterial(material)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderRatingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Рейтинг преподавателей</CardTitle>
            <Button onClick={handleCreateSurvey}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Создать опрос
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Преподаватель</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead>Отзывы</TableHead>
                <TableHead>Материалы</TableHead>
                <TableHead>Пунктуальность</TableHead>
                <TableHead>Вовлеченность</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherRatings.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{teacher.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">
                        {teacher.avgRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">
                        ({teacher.totalReviews})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.totalReviews}</TableCell>
                  <TableCell>{teacher.materials}</TableCell>
                  <TableCell>{teacher.punctuality.toFixed(0)}%</TableCell>
                  <TableCell>{teacher.engagement.toFixed(0)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Отзывы студентов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className={`p-4 border rounded-lg ${
                  feedback.status === "flagged"
                    ? "border-red-200 bg-red-50"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{feedback.student}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.rating
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(feedback.status) as any}>
                      {feedback.status === "public" ? "Публичный" : "Помечен"}
                    </Badge>
                    {feedback.status === "flagged" && (
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
                <div className="text-xs text-gray-500">
                  {feedback.teacher} • {feedback.subject} •{" "}
                  {new Date(feedback.date).toLocaleDateString("ru-RU")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplaintsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Жалобы и обращения</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заявитель</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Приоритет</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.reporter}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {complaint.type === "teaching"
                      ? "Преподавание"
                      : complaint.type === "system"
                        ? "Система"
                        : "Другое"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium mb-1">
                      Против: {complaint.against}
                    </div>
                    <div className="text-sm text-gray-600">
                      {complaint.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(complaint.priority) as any}>
                    {complaint.priority === "high"
                      ? "Высокий"
                      : complaint.priority === "medium"
                        ? "Средний"
                        : "Низкий"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(complaint.status) as any}>
                    {complaint.status === "investigating"
                      ? "Расследуется"
                      : complaint.status === "resolved"
                        ? "Решено"
                        : "Новая"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(complaint.date).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Контроль качества</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Отчет по качеству
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Модерация контента
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Рейтинги и отзывы
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Жалобы и обращения
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials">{renderMaterialsTab()}</TabsContent>
        <TabsContent value="ratings">{renderRatingsTab()}</TabsContent>
        <TabsContent value="complaints">{renderComplaintsTab()}</TabsContent>
      </Tabs>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onOpenChange={setFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклонить материал</DialogTitle>
            <DialogDescription>
              Укажите причину отклонения материала
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Причина отклонения</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите причину" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quality">Низкое качество</SelectItem>
                  <SelectItem value="content">Неподходящий контент</SelectItem>
                  <SelectItem value="format">Неверный формат</SelectItem>
                  <SelectItem value="incomplete">
                    Неполная информация
                  </SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Комментарий</Label>
              <Textarea
                placeholder="Дополнительные комментарии для преподавателя"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialog(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                alert("Материал отклонен с комментарием");
                setFeedbackDialog(false);
              }}
            >
              Отклонить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Survey Dialog */}
      <Dialog open={surveyDialog} onOpenChange={setSurveyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создать опрос</DialogTitle>
            <DialogDescription>
              Создайте опрос для сбора обратной связи от студентов
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название опроса</Label>
              <Input placeholder="Например: Оценка качества преподавания" />
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea placeholder="Краткое описание целей опроса" rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Целевая аудитория</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="all-students" />
                  <Label htmlFor="all-students">Все студенты</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="specific-groups" />
                  <Label htmlFor="specific-groups">Конкретные группы</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="teachers" />
                  <Label htmlFor="teachers">Преподаватели</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Вопросы</Label>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <Input
                    placeholder="Как вы оцениваете качество преподавания?"
                    className="mb-2"
                  />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Тип ответа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Оценка (1-5)</SelectItem>
                      <SelectItem value="text">Текстовый ответ</SelectItem>
                      <SelectItem value="choice">Выбор варианта</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить вопрос
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSurveyDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSendSurvey}>
              <Send className="h-4 w-4 mr-2" />
              Отправить опрос
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QualityControl;
