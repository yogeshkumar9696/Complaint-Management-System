import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import RoleSelection from "./components/RoleSelection";
import StudentDashboard from './components/student/StudentDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PendingComplaints from './components/student/PendingComplaints';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthChecker from './components/AuthChecker';
import ComplaintForm from './components/student/ComplaintForm';
import ProfileSettings from './components/ProfileSettings';
import CompletedComplaints from './components/student/CompletedComplaints';
import StaffAssignedTasks from './components/staff/StaffAssignedTasks';
import StaffAwaitingReview from './components/staff/StaffAwaitingReview';
import StaffCompletedTasks from './components/staff/StaffCompletedTasks';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminPendingComplaints from './components/admin/AdminPendingComplaint';
import AdminAssignedComplaints from './components/admin/AdminAssignedComplaints';
import AdminAwaitingReviews from './components/admin/AdminAwaitingReviews';
import AdminCompletedComplaints from './components/admin/AdminCompletedComplaints';
import AdminViewStaff from './components/admin/AdminViewStaff';
import AdminAddStaff from './components/admin/AdminAddStaff';
import AdminRejectedComplaints from './components/admin/AdminRejectedComplaints';

function App() {
  

  return (
    
    <Router>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-white flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            
            <Route path="/" element={<AuthChecker />} />
            <Route path="/select-role" element={<RoleSelection />} />
            <Route path="/auth" element={<AuthPage />} />

            
            <Route path="/student/Dashboard" element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            
         <Route path="/complaints/pending" element={
              <ProtectedRoute role="student">
                <PendingComplaints />
              </ProtectedRoute>
            } />

            <Route 
              path="/file-complaint" 
              element={
                <ProtectedRoute role="student">
                  <ComplaintForm />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/complaints/completed" 
              element={
                <ProtectedRoute role="student">
                  <CompletedComplaints />
                </ProtectedRoute>
              } 
            />


            <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            } 
          />

            <Route 
              path="/staff/dashboard" 
              element={
                <ProtectedRoute role="staff">
                  <StaffDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/assigned-tasks" 
              element={
                <ProtectedRoute role="staff">
                  <StaffAssignedTasks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/awaiting-review" 
              element={
                <ProtectedRoute role="staff">
                  <StaffAwaitingReview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff/completed-tasks" 
              element={
                <ProtectedRoute role="staff">
                  <StaffCompletedTasks />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/Dashboard" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            
             <Route 
              path="/admin/pending-complaints" 
              element={
                <ProtectedRoute role="admin">
                  <AdminPendingComplaints />
                </ProtectedRoute>
              } 
            />
           <Route 
              path="/admin/assigned-complaints" 
              element={
                <ProtectedRoute role="admin">
                  <AdminAssignedComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/awaiting-reviews" 
              element={
                <ProtectedRoute role="admin">
                  <AdminAwaitingReviews />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/completed-complaints" 
              element={
                <ProtectedRoute role="admin">
                  <AdminCompletedComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/rejected-complaints" 
              element={
                <ProtectedRoute role="admin">
                  <AdminRejectedComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/view-staff" 
              element={
                <ProtectedRoute role="admin">
                  <AdminViewStaff />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/add-staff" 
              element={
                <ProtectedRoute role="admin">
                  <AdminAddStaff />
                </ProtectedRoute>
              } 
            /> 
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;