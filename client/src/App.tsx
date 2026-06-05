import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";
import Attendance from "./pages/Attendance";
import OnlineClassroom from "./pages/OnlineClassroom";
import MoralAssessment from "./pages/MoralAssessment";
import NewsManagement from "./pages/NewsManagement";
import HomeVisit from "./pages/HomeVisit";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Admin routes
  if (user?.role === "admin") {
    return (
      <Switch>
        <Route path={"/"} component={AdminDashboard} />
        <Route path={"/dashboard"} component={AdminDashboard} />
        <Route path={"/students"} component={StudentManagement} />
        <Route path={"/attendance"} component={Attendance} />
        <Route path={"/classroom"} component={OnlineClassroom} />
        <Route path={"/moral"} component={MoralAssessment} />
        <Route path={"/news"} component={NewsManagement} />
        <Route path={"/homevisit"} component={HomeVisit} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // User (student) routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
