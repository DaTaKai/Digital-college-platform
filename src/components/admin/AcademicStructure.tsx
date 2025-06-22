import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  GraduationCap,
  Upload,
  Download,
  Copy,
  Search,
  Calendar,
} from "lucide-react";
import { GROUPS, SUBJECTS, TEACHERS } from "@/lib/data";

const AcademicStructure = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialog, setDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleCreate = (type: string) => {
    setSelectedItem(null);
    setDialogType("create");
    setDialog(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setDialogType("edit");
    setDialog(true);
  };

  const handleDelete = (item: any, type: string) => {
    if (confirm(`Удалить ${type}: ${item.name}?`)) {
      alert(`${type} удален`);
    }
  };

  const handleSave = () => {
    alert(`Элемент ${dialogType === "create" ? "создан" : "обновлен"}`);
    setDialog(false);
  };

  const handleImportExport = (action: "import" | "export") => {
    alert(`${action === "import" ? "Импорт" : "Экспорт"} данных`);
  };

  const handleCopySchedule = () => {
    alert("Копирование расписания с предыдущего семестра");
  };

  const filteredItems = (items: any[]) => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const renderGroupsTab = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Управление группами</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleImportExport("import")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Импорт
            </Button>
            <Button
              variant="outline"
              onClick={() => handleImportExport("export")}
            >
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
            <Button onClick={() => handleCreate("группу")}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить группу
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название группы</TableHead>
              <TableHead>Количество студентов</TableHead>
              <TableHead>Куратор</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems(GROUPS).map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <div className="font-medium">{group.name}</div>
                  <div className="text-sm text-gray-500">ID: {group.id}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {group.students.length} студентов
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {TEACHERS[0]?.name || "Не назначен"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">Активна</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(group, "группу")}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderSubjectsTab = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Управление предметами</CardTitle>
          <Button onClick={() => handleCreate("предмет")}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить предмет
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название предмета</TableHead>
              <TableHead>Преподаватели</TableHead>
              <TableHead>Группы</TableHead>
              <TableHead>Часов в неделю</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems(SUBJECTS).map((subject) => {
              const subjectTeachers = TEACHERS.filter((t) =>
                t.subjects.includes(subject.id),
              );

              return (
                <TableRow key={subject.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {subject.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {subjectTeachers.map((teacher) => (
                        <Badge
                          key={teacher.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {teacher.name.split(" ")[0]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{GROUPS.length} групп</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">4 часа</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(subject)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(subject, "предмет")}
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

  const renderAssignmentsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Назначения преподавателей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TEACHERS.map((teacher) => (
              <div key={teacher.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">{teacher.name}</div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Изменить
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Предметы</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teacher.subjects.map((subjectId) => {
                        const subject = SUBJECTS.find(
                          (s) => s.id === subjectId,
                        );
                        return (
                          <Badge key={subjectId} variant="outline">
                            {subject?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Группы</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {GROUPS.map((group) => (
                        <Badge key={group.id} variant="secondary">
                          {group.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Копирование расписания</CardTitle>
            <Button onClick={handleCopySchedule}>
              <Copy className="h-4 w-4 mr-2" />
              Копировать семестр
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Из семестра</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите семестр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall2023">Осень 2023</SelectItem>
                  <SelectItem value="spring2024">Весна 2024</SelectItem>
                  <SelectItem value="fall2024">Осень 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>В семестр</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите семестр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring2025">Весна 2025</SelectItem>
                  <SelectItem value="fall2025">Осень 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Академическая структура
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Группы ({GROUPS.length})
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Предметы ({SUBJECTS.length})
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Назначения
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups">{renderGroupsTab()}</TabsContent>

        <TabsContent value="subjects">{renderSubjectsTab()}</TabsContent>

        <TabsContent value="assignments">{renderAssignmentsTab()}</TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "create" ? "Создать" : "Редактировать"}{" "}
              {activeTab === "groups"
                ? "группу"
                : activeTab === "subjects"
                  ? "предмет"
                  : "назначение"}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о{" "}
              {activeTab === "groups"
                ? "группе"
                : activeTab === "subjects"
                  ? "предмете"
                  : "назначении"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {activeTab === "groups" && (
              <>
                <div className="space-y-2">
                  <Label>Название группы</Label>
                  <Input
                    defaultValue={selectedItem?.name || ""}
                    placeholder="Например: ИС-21"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Курс</Label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 курс</SelectItem>
                      <SelectItem value="2">2 курс</SelectItem>
                      <SelectItem value="3">3 курс</SelectItem>
                      <SelectItem value="4">4 курс</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Куратор</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите куратора" />
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
              </>
            )}

            {activeTab === "subjects" && (
              <>
                <div className="space-y-2">
                  <Label>Название предмета</Label>
                  <Input
                    defaultValue={selectedItem?.name || ""}
                    placeholder="Например: Математика"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea placeholder="Краткое описание предмета" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Цвет</Label>
                  <Input
                    type="color"
                    defaultValue={selectedItem?.color || "#3b82f6"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Часов в неделю</Label>
                  <Input type="number" defaultValue="4" min="1" max="20" />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              {dialogType === "create" ? "Создать" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AcademicStructure;
