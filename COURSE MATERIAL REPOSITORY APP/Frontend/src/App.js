import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Reset from './components/Reset';
import Alert from './hooks/Alert';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Admin from './components/Admin';
import Materials from './components/Materials';
import UploadMaterials from './components/UploadMaterials';
import Student from './components/Student';
import Lecturer from './components/Lecturer';
import ResetPassword from './components/ResetPassword';
import Updates from './components/Updates';
import AnnouncementModal from './components/AnnouncementModal';
import CoursesModal from './components/CoursesModal';
import CommentModal from './components/CommentModal';
import Stage from './components/Stage';
import Repository from './components/Repository';
import SCoursesModal from './components/SCoursesModal';
import ViewUnitsModal from './components/ViewUnitsModal';
import RepoDisplay from './components/RepoDisplay';
import ViewModal from './components/ViewModal';
import EnrollModal from './components/EnrollModal';
import Courses from './components/Courses';
import CourseManagement from './components/CourseManagement';
import LecturerModal from './components/LecturerModal';
import StudentsModal from './components/StudentsModal';
import Comment2Modal from './components/Comment2Modal';

const App = () => {
  const [messages, setMessages] = useState({
    errors: [],
    success_msg: '',
    error_msg: '',
  });

  useEffect(() => {
    fetch('/api/messages', { credentials: 'include' }) // Ensures cookies/session are sent
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        return response.json();
      })
      .then((data) => {
        setMessages({
          errors: data.errors || [],
          success_msg: data.success_msg || '',
          error_msg: data.error_msg || '',
        });
      })
      .catch((error) => console.error('Error fetching messages:', error));
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <TokenRedirect /> {/* ✅ Fix token check inside a proper component */}
        <Alert type="success" messages={messages.success_msg ? [messages.success_msg] : []} />
        <Alert type="danger" messages={messages.error_msg ? [messages.error_msg] : []} />
        <Alert type="warning" messages={messages.errors} />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Super-admin']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student', 'Admin', 'Super-admin']} />}>
            <Route path="/student" element={<Student />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['lecturer', 'Admin', 'Super-admin']} />}>
            <Route path="/lecturer" element={<Lecturer />} />
          </Route>

          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/upload" element={<UploadMaterials />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/announcements" element={<AnnouncementModal />} />
          <Route path="/courses" element={<CoursesModal />} />
          <Route path="/comments" element={<CommentModal />} />
          <Route path="/stages" element={<Stage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courseManagement" element={<CourseManagement />} />
          <Route path="/sRegistrations" element={<SCoursesModal />} />
          <Route path="/viewUnits" element={<ViewUnitsModal />} />
          <Route path="/enroll" element={<EnrollModal />} />
          <Route path="/lecturers" element={<LecturerModal />} />
          <Route path="/students" element={<StudentsModal />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/comment2Modal" element={<Comment2Modal />} />
          <Route path="/viewModal" element={<ViewModal />} />
          <Route path="/unit/:unitId" element={<RepoDisplay />} />
          
          <Route path="*" element={<Login />} /> {/* ✅ Fixed incorrect syntax */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

// ✅ Move token check to a separate component inside BrowserRouter
const TokenRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default App;
