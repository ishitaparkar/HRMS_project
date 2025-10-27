import { BrowserRouter, Routes, Route } from "react-router-dom";

// Core Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Page Components
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import EditEmployeePage from "./pages/EditEmployeePage";

// Other Feature Pages
import ProfilePage from "./pages/ProfilePage";
import RequirementPage from "./pages/RequirementPage";
import RecruitmentPage from "./pages/RecruitmentPage";
import EmployeeAssetsPage from "./pages/EmployeeAssetsPage";
import MyProfilePage from "./pages/MyProfilePage";
import AttendancePage from "./pages/AttendancePage";
import LeaveTrackerPage from "./pages/LeaveTrackerPage";
import TimeTrackerPage from "./pages/TimeTrackerPage";
import AppraisalPage from "./pages/AppraisalPage";
import AnnouncementPage from "./pages/AnnouncementPage";
import ResignationPage from "./pages/ResignationPage";
import SettingsPage from "./pages/SettingsPage";

// Appraisal Subpages
import StartReviewPage from "./pages/StartReviewPage";
import ViewReportPage from "./pages/ViewReportPage";

// Payroll Pages
import PayrollPage from "./pages/PayrollPage";
import RunPayrollPage from "./pages/RunPayrollPage";

// Leave & Vacancy Pages
import RequestLeavePage from "./pages/RequestLeavePage";
import PostVacancyPage from "./pages/PostVacancyPage";

// Notes & Approvals
import NoteManagementPage from "./pages/NoteManagementPage";
import NoteDetailsPage from "./pages/NoteDetailsPage"; // <-- 1. IMPORT THE NEW PAGE

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeeManagementPage />} />
            <Route path="/add-employee" element={<AddEmployeePage />} />
            <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
            <Route path="/employees/edit/:employeeId" element={<EditEmployeePage />} />

            {/* Profile & Self-Service */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-profile" element={<MyProfilePage />} />

            {/* HR & Recruitment */}
            <Route path="/requirement-raising" element={<RequirementPage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/post-vacancy" element={<PostVacancyPage />} />

            {/* Attendance & Leave */}
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leave-tracker" element={<LeaveTrackerPage />} />
            <Route path="/request-leave" element={<RequestLeavePage />} />
            <Route path="/time-tracker" element={<TimeTrackerPage />} />

            {/* Appraisal */}
            <Route path="/appraisal" element={<AppraisalPage />} />
            <Route path="/appraisal/start/:employeeId" element={<StartReviewPage />} />
            <Route path="/appraisal/report/:employeeId" element={<ViewReportPage />} />

            {/* Payroll */}
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/run-payroll" element={<RunPayrollPage />} />

            {/* Other Management */}
            <Route path="/employee-assets" element={<EmployeeAssetsPage />} />
            <Route path="/announcement" element={<AnnouncementPage />} />
            <Route path="/resignation" element={<ResignationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notes-approvals" element={<NoteManagementPage />} />
            
            {/* --- 2. ADD THE NEW ROUTE FOR NOTE DETAILS --- */}
            <Route path="/notes-approvals/:noteId" element={<NoteDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;