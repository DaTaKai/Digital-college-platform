import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authService, TEST_USERS } from "@/lib/auth";
import { GraduationCap, User, Lock } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (authService.login(username)) {
      const user = authService.getCurrentUser();
      switch (user?.role) {
        case "student":
          navigate("/student");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } else {
      setError("Неверное имя пользователя");
    }
    setLoading(false);
  };

  const handleQuickLogin = (username: string) => {
    setUsername(username);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Платформа Колледжа
          </h1>
          <p className="text-gray-600">Войдите в свой аккаунт</p>
        </div>

        {/* Login Form */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Вход в систему</CardTitle>
            <CardDescription>
              Введите ваше имя пользователя для входа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Введите имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !username.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Вход...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Войти
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Login Options */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Быстрый вход для демо</CardTitle>
            <CardDescription>
              Нажмите на роль для быстрого входа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(TEST_USERS).map(([key, user]) => (
              <Button
                key={key}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleQuickLogin(key)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user.role === "student"
                        ? "👨‍🎓"
                        : user.role === "teacher"
                          ? "👩‍🏫"
                          : "👨‍💼"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {user.role === "student"
                        ? "Студент"
                        : user.role === "teacher"
                          ? "Преподаватель"
                          : "Администратор"}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Demo Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Демо версия • Группа ИС-21 • 3 предмета</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
