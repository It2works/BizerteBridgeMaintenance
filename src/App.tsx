import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MainLayout } from "./components/Layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Profile from "./pages/Profile";
import Sensors from "./pages/Sensors";
import Maintenance from "./pages/Maintenance";
import Predictions from "./pages/Predictions";
import Tasks from "./pages/Tasks";
import UserManagement from "./pages/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route element={<MainLayout />}>
              {/* Admin Routes */}
              <Route path="/admin/overview" element={<Index />} />
              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/sensors" element={<Sensors />} />
              <Route path="/admin/maintenance" element={<Maintenance />} />
              <Route path="/admin/predictions" element={<Predictions />} />
              <Route path="/admin/tasks" element={<Tasks />} />
              
              {/* Superadmin Routes */}
              <Route path="/supadmin/overview" element={<Index />} />
              <Route path="/supadmin/profile" element={<Profile />} />
              <Route path="/supadmin/sensors" element={<Sensors />} />
              <Route path="/supadmin/maintenance" element={<Maintenance />} />
              <Route path="/supadmin/predictions" element={<Predictions />} />
              <Route path="/supadmin/tasks" element={<Tasks />} />
              <Route path="/supadmin/users" element={<UserManagement />} />
              
              {/* Technician Routes */}
              <Route path="/technician/overview" element={<Index />} />
              <Route path="/technician/profile" element={<Profile />} />
              <Route path="/technician/sensors" element={<Sensors />} />
              <Route path="/technician/maintenance" element={<Maintenance />} />
              <Route path="/technician/tasks" element={<Tasks />} />
              
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;