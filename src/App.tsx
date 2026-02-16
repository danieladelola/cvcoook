import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ResumeBuilder from "./pages/ResumeBuilder";
import CVBuilder from "./pages/CVBuilder";
import CoverLetterBuilder from "./pages/CoverLetterBuilder";
import Templates from "./pages/Templates";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Examples from "./pages/Examples";
import ATSChecker from "./pages/ATSChecker";
import HowToWrite from "./pages/HowToWrite";
import Resources from "./pages/Resources";
import AIResumeBuilder from "./pages/AIResumeBuilder";
import CVvsResume from "./pages/CVvsResume";
import FAQ from "./pages/FAQ";
import Reviews from "./pages/Reviews";
import ForgotPassword from "./pages/ForgotPassword";
import Help from "./pages/Help";
import ArticlePage from "./pages/ArticlePage";
import NewsPage from "./pages/NewsPage";
import CareerCenter from "./pages/CareerCenter";
import CreateCV from "./pages/dashboard/CreateCV";
import CreateCoverLetter from "./pages/dashboard/CreateCoverLetter";
import DashboardTemplates from "./pages/dashboard/DashboardTemplates";
import Settings from "./pages/dashboard/Settings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminCVs from "./pages/admin/AdminCVs";
import AdminAuditLog from "./pages/admin/AdminAuditLog";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCoverLetters from "./pages/admin/AdminCoverLetters";
import PublicCV from "./pages/PublicCV";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/help" element={<Help />} />
              
              {/* Protected Dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/create" element={<ProtectedRoute><CreateCV /></ProtectedRoute>} />
              <Route path="/dashboard/cover-letter" element={<ProtectedRoute><CreateCoverLetter /></ProtectedRoute>} />
              <Route path="/dashboard/templates" element={<ProtectedRoute><DashboardTemplates /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              {/* Protected Admin */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/cvs" element={<ProtectedRoute requireAdmin><AdminCVs /></ProtectedRoute>} />
              <Route path="/admin/templates" element={<ProtectedRoute requireAdmin><AdminTemplates /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/support" element={<ProtectedRoute requireAdmin><AdminSupport /></ProtectedRoute>} />
              <Route path="/admin/audit-log" element={<ProtectedRoute requireAdmin><AdminAuditLog /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute requireAdmin><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/cover-letters" element={<ProtectedRoute requireAdmin><AdminCoverLetters /></ProtectedRoute>} />
              
              {/* Builders */}
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/cv-builder" element={<CVBuilder />} />
              <Route path="/cover-letter-builder" element={<CoverLetterBuilder />} />
              <Route path="/cv-maker" element={<CVBuilder />} />
              
              {/* Payment */}
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              
              {/* Public pages */}
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/:category" element={<Templates />} />
              <Route path="/ai-resume-builder" element={<AIResumeBuilder />} />
              <Route path="/ats-checker" element={<ATSChecker />} />
              <Route path="/how-to-write" element={<HowToWrite />} />
              <Route path="/examples" element={<Examples />} />
              <Route path="/examples/:category" element={<Examples />} />
              <Route path="/cv-templates" element={<Templates />} />
              <Route path="/cv-vs-resume" element={<CVvsResume />} />
              <Route path="/how-to-make-cv" element={<HowToWrite />} />
              <Route path="/cv-examples/:category" element={<Examples />} />
              <Route path="/ai-cover-letter" element={<CoverLetterBuilder />} />
              <Route path="/cover-letter-format" element={<HowToWrite />} />
              <Route path="/how-to-write-cover-letter" element={<HowToWrite />} />
              <Route path="/cover-letter-vs-resume" element={<CVvsResume />} />
              <Route path="/cover-letter/:category" element={<Examples />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resume-summary-generator" element={<AIResumeBuilder />} />
              <Route path="/skills-generator" element={<AIResumeBuilder />} />
              <Route path="/interview-prep" element={<Resources />} />
              <Route path="/articles/:slug" element={<ArticlePage />} />
              <Route path="/news/:slug" element={<NewsPage />} />
              <Route path="/career-center" element={<CareerCenter />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/cv/:id" element={<PublicCV />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
