import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import { authService } from "./lib/auth";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (!user) {
      navigate("/login", { replace: true, state: { from: location } });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "student":
          navigate("/student", { replace: true });
          break;
        case "teacher":
          navigate("/teacher", { replace: true });
          break;
        case "admin":
          navigate("/admin", { replace: true });
          break;
        default:
          navigate("/login", { replace: true });
      }
    }
  }, [navigate, location, allowedRoles]);

  const user = authService.getCurrentUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

// Redirect Component
const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case "student":
        navigate("/student", { replace: true });
        break;
      case "teacher":
        navigate("/teacher", { replace: true });
        break;
      case "admin":
        navigate("/admin", { replace: true });
        break;
      default:
        navigate("/login", { replace: true });
    }
  }, [navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
