import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Core Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // Corrected
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import EditEmployeePage from './pages/EditEmployeePage';

// Import all the new placeholder pages
import ProfilePage from './pages/ProfilePage';
import RequirementPage from './pages/RequirementPage';
import RecruitmentPage from './pages/RecruitmentPage';
import EmployeeAssetsPage from './pages/EmployeeAssetsPage';
import MyProfilePage from './pages/MyProfilePage';
import AttendancePage from './pages/AttendancePage';
import LeaveTrackerPage from './pages/LeaveTrackerPage';
import TimeTrackerPage from './pages/TimeTrackerPage';
import AppraisalPage from './pages/AppraisalPage';
import AnnouncementPage from './pages/AnnouncementPage';
import ResignationPage from './pages/ResignationPage';
import SettingsPage from './pages/SettingsPage';
// --- NEW IMPORTS FOR APPRAISAL ---
import StartReviewPage from './pages/StartReviewPage';
import ViewReportPage from './pages/ViewReportPage'; // Corrected
// --- NEW IMPORT FOR PAYROLL ---
import PayrollPage from './pages/PayrollPage';
// --- NEW IMPORT FOR REQUEST LEAVE ---
import RequestLeavePage from './pages/RequestLeavePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Login page stands alone */}
        <Route path="/" element={<LoginPage />} />
        
        {/* All pages inside here will share the Sidebar layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeeManagementPage />} />
          <Route path="/add-employee" element={<AddEmployeePage />} />
          
          {/* Add routes for all the new pages */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/requirement-raising" element={<RequirementPage />} />
          <Route path="/recruitment" element={<RecruitmentPage />} />
          <Route path="/employee-assets" element={<EmployeeAssetsPage />} />
          <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leave-tracker" element={<LeaveTrackerPage />} />
          <Route path="/time-tracker" element={<TimeTrackerPage />} />
          <Route path="/appraisal" element={<AppraisalPage />} />
          <Route path="/announcement" element={<AnnouncementPage />} />
          <Route path="/resignation" element={<ResignationPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* --- NEW ROUTES FOR APPRAISAL --- */}
          <Route path="/appraisal/start/:employeeId" element={<StartReviewPage />} />
          <Route path="/appraisal/report/:employeeId" element={<ViewReportPage />} />
          
          {/* --- NEW ROUTE FOR PAYROLL --- */}
          <Route path="/payroll" element={<PayrollPage />} />

          {/* --- NEW ROUTE FOR EDIT EMPLOYEE --- */}
          <Route path="/employees/edit/:employeeId" element={<EditEmployeePage />} />

          {/* --- NEW ROUTE FOR REQUEST LEAVE --- */}
          <Route path="/request-leave" element={<RequestLeavePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;