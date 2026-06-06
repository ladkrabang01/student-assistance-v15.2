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
import Landing from "./pages/Landing";
import LoginTeacher from "./pages/LoginTeacher";
import LoginStudent from "./pages/LoginStudent";
import RegisterTeacher from "./pages/RegisterTeacher";
import RegisterStudent from "./pages/RegisterStudent";
import StudentDashboard from "./pages/StudentDashboard";
import MoralAssessmentReport from "./pages/MoralAssessmentReport";
import StudentHistory from "./pages/StudentHistory";
import { useAuth } from "./_core/hooks/useAuth";

function Router() {
  const { user, isAuthenticated } = useAuth();

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path={"/ "} component={Landing} />
        <Route path={"/login/teacher"} component={LoginTeacher} />
        <Route path={"/login/student"} component={LoginStudent} />
        <Route path={"/register/teacher"} component={RegisterTeacher} />
        <Route path={"/register/student"} component={RegisterStudent} />
        <Route path={"/404"} component={NotFound} />
        <Route component={Landing} />
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
        <Route path={"/moral/report"} component={MoralAssessmentReport} />
        <Route path={"/news"} component={NewsManagement} />
        <Route path={"/homevisit"} component={HomeVisit} />
        <Route path={"/history"} component={StudentHistory} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // User (student) routes
  return (
    <Switch>
      <Route path={"/"} component={StudentDashboard} />
      <Route path={"/student"} component={StudentDashboard} />
      <Route path={"/history"} component={StudentHistory} />
      <Route path={"/404"} component={NotFound} />
      <Route component={StudentDashboard} />
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
