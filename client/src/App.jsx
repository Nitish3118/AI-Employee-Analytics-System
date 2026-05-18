import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEditEmployee from './pages/AddEditEmployee';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-void text-slate-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto pl-64">
          {children}
        </main>
      </div>
    </div>
  );
};

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={
            <AuthRedirect><Login /></AuthRedirect>
          } />
          <Route path="/signup" element={
            <AuthRedirect><Signup /></AuthRedirect>
          } />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/employees" element={<Layout><Employees /></Layout>} />
            <Route path="/employees/add" element={<Layout><AddEditEmployee /></Layout>} />
            <Route path="/employees/edit/:id" element={<Layout><AddEditEmployee /></Layout>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
