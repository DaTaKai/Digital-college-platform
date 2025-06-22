import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "@/lib/auth";
import { getStudentPoints, isCurator } from "@/lib/data";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Coins,
  TrendingUp,
  Shield,
} from "lucide-react";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  if (!user) return null;

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getNavItems = () => {
    switch (user.role) {
      case "student":
        return [
          { id: "schedule", label: "Расписание", icon: Calendar },
          { id: "homework", label: "Домашние задания", icon: BookOpen },
          { id: "grades", label: "Оценки", icon: BarChart3 },
          { id: "shop", label: "Магазин", icon: ShoppingCart },
          { id: "group", label: "Группа", icon: Users },
        ];
      case "teacher":
        return [
          { id: "schedule", label: "Расписание", icon: Calendar },
          { id: "journal", label: "Журнал", icon: BookOpen },
          { id: "analytics", label: "Аналитика", icon: BarChart3 },
        ];
      case "admin":
        return [
          { id: "dashboard", label: "Панель", icon: BarChart3 },
          { id: "users", label: "Пользователи", icon: Users },
          { id: "structure", label: "Структура", icon: BookOpen },
          { id: "schedule", label: "Расписание", icon: Calendar },
          { id: "analytics", label: "Аналитика", icon: TrendingUp },
          { id: "quality", label: "Контроль", icon: Shield },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "student":
        return "Студент";
      case "teacher":
        return "Преподаватель";
      case "admin":
        return "Администратор";
      default:
        return role;
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Платформа Колледжа
                </h1>
                <p className="text-xs text-gray-500">
                  {getRoleDisplayName(user.role)}
                </p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onTabChange?.(item.id)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}

              {/* Points Display for Students */}
              {user.role === "student" &&
                (() => {
                  const studentPoints = getStudentPoints(user.id);
                  return (
                    studentPoints && (
                      <div className="flex items-center gap-1 px-3 py-2 bg-yellow-50 rounded-md border border-yellow-200 ml-2">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          {studentPoints.totalPoints}
                        </span>
                      </div>
                    )
                  );
                })()}
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">Колледж</h1>
                <p className="text-xs text-gray-500">
                  {getRoleDisplayName(user.role)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-gray-200 pb-3 pt-3">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        onTabChange?.(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="gap-2 h-12 flex-col"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
