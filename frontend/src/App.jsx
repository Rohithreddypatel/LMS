import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./routes/Guards";

import Navbar         from "./components/Navbar";
import Home           from "./pages/Home";
import CourseDetail   from "./pages/CourseDetail";
import MyCourses      from "./pages/MyCourses";
import Player         from "./pages/Player";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";

import AdminLayout      from "./pages/admin/AdminLayout";
import AdminDashboard   from "./pages/admin/AdminDashboard";
import AdminCourses     from "./pages/admin/AdminCourses";
import CourseForm       from "./pages/admin/CourseForm";
import AdminUsers       from "./pages/admin/AdminUsers";
import AdminEnrollments from "./pages/admin/AdminEnrollments";

const WithNav = ({ children }) => <><Navbar />{children}</>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login"  element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

        {/* Student */}
        <Route path="/"           element={<WithNav><Home /></WithNav>} />
        <Route path="/course/:id" element={<WithNav><CourseDetail /></WithNav>} />
        <Route path="/my-courses" element={<ProtectedRoute><WithNav><MyCourses /></WithNav></ProtectedRoute>} />
        <Route path="/player/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index                  element={<AdminDashboard />} />
          <Route path="courses"         element={<AdminCourses />} />
          <Route path="courses/new"     element={<CourseForm />} />
          <Route path="courses/:id/edit" element={<CourseForm />} />
          <Route path="users"           element={<AdminUsers />} />
          <Route path="enrollments"     element={<AdminEnrollments />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
