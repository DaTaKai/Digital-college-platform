import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  Shield,
  Eye,
  MoreHorizontal,
  Download,
  Upload,
} from "lucide-react";
import { GROUPS, TEACHERS } from "@/lib/data";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userDialog, setUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userType, setUserType] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [activeTab, setActiveTab] = useState("students");

  // Combine all users
  const allStudents = GROUPS.flatMap((group) =>
    group.students.map((student) => ({
      ...student,
      type: "student",
      group: group.name,
      lastLogin: "2 часа назад",
      status: "active",
    })),
  );

  const allTeachers = TEACHERS.map((teacher) => ({
    ...teacher,
    type: "teacher",
    group: "-",
    lastLogin: "1 час назад",
    status: "active",
  }));

  const admins = [
    {
      id: "admin_1",
      name: "Әкімші Жанболат",
      email: "admin@college.kz",
      type: "admin",
      group: "-",
      lastLogin: "30 мин назад",
      status: "active",
      avatar: "/api/placeholder/40/40",
    },
  ];

  const getUsersByTab = () => {
    switch (activeTab) {
      case "students":
        return allStudents;
      case "teachers":
        return allTeachers;
      case "admins":
        return admins;
      default:
        return [];
    }
  };

  const filteredUsers = getUsersByTab().filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateUser = () => {
    setSelectedUser(null);
    setUserType("create");
    setUserDialog(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setUserType("edit");
    setUserDialog(true);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setUserType("view");
    setUserDialog(true);
  };

  const handleDeleteUser = (user: any) => {
    if (confirm(`Удалить пользователя ${user.name}?`)) {
      alert("Пользователь удален");
    }
  };

  const handleSaveUser = () => {
    alert(`Пользователь ${userType === "create" ? "создан" : "обновлен"}`);
    setUserDialog(false);
  };

  const handleImportUsers = () => {
    alert("Функция импорта пользователей из Excel/CSV");
  };

  const handleExportUsers = () => {
    alert("Экспорт пользователей в Excel");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "blocked":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Активен";
      case "inactive":
        return "Неактивен";
      case "blocked":
        return "Заблокирован";
      default:
        return status;
    }
  };

  const getRoleIcon = (type: string) => {
    switch (type) {
      case "student":
        return <GraduationCap className="h-4 w-4" />;
      case "teacher":
        return <Users className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Управление пользователями
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleImportUsers}>
            <Upload className="h-4 w-4 mr-2" />
            Импорт
          </Button>
          <Button variant="outline" onClick={handleExportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить пользователя
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Студенты ({allStudents.length})
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Преподаватели ({allTeachers.length})
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Администраторы ({admins.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getRoleIcon(activeTab.slice(0, -1))}
                {activeTab === "students"
                  ? "Студенты"
                  : activeTab === "teachers"
                    ? "Преподаватели"
                    : "Администраторы"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Группа/Предметы</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.type === "student"
                          ? user.group
                          : user.type === "teacher"
                            ? (user as any).subjects?.join(", ") || "-"
                            : "Системный доступ"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(user.status) as any}>
                          {getStatusText(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
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
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={userDialog} onOpenChange={setUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {userType === "create"
                ? "Создать пользователя"
                : userType === "edit"
                  ? "Редактировать пользователя"
                  : "Профиль пользователя"}
            </DialogTitle>
            <DialogDescription>
              {userType === "create"
                ? "Введите данные нового пользователя"
                : userType === "edit"
                  ? "Измените данные пользователя"
                  : "Подробная информация о пользователе"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {userType === "view" && selectedUser ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedUser.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedUser.name}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <Badge
                      variant={getStatusColor(selectedUser.status) as any}
                      className="mt-1"
                    >
                      {getStatusText(selectedUser.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Роль
                    </Label>
                    <p className="text-sm">
                      {selectedUser.type === "student"
                        ? "Студент"
                        : selectedUser.type === "teacher"
                          ? "Преподаватель"
                          : "Администратор"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Последний вход
                    </Label>
                    <p className="text-sm">{selectedUser.lastLogin}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      ID
                    </Label>
                    <p className="text-sm font-mono">{selectedUser.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      {selectedUser.type === "student" ? "Группа" : "Предметы"}
                    </Label>
                    <p className="text-sm">
                      {selectedUser.type === "student"
                        ? selectedUser.group
                        : selectedUser.type === "teacher"
                          ? selectedUser.subjects?.join(", ") || "-"
                          : "Системный доступ"}
                    </p>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="space-y-3">
                  <h4 className="font-medium">Статистика активности</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">127</div>
                      <div className="text-xs text-gray-600">Входов</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        95%
                      </div>
                      <div className="text-xs text-gray-600">Активность</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        4.2
                      </div>
                      <div className="text-xs text-gray-600">Рейтинг</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    defaultValue={selectedUser?.name || ""}
                    placeholder="Введите полное имя"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={selectedUser?.email || ""}
                    placeholder="user@college.kz"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <Select defaultValue={selectedUser?.type || "student"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Студент</SelectItem>
                      <SelectItem value="teacher">Преподаватель</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select defaultValue={selectedUser?.status || "active"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Активен</SelectItem>
                      <SelectItem value="inactive">Неактивен</SelectItem>
                      <SelectItem value="blocked">Заблокирован</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="group">Группа/Предметы</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите группу или предметы" />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUPS.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          Группа {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialog(false)}>
              {userType === "view" ? "Закрыть" : "Отмена"}
            </Button>
            {userType !== "view" && (
              <Button onClick={handleSaveUser}>
                {userType === "create" ? "Создать" : "Сохранить"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
