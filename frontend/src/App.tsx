import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerMenu from './pages/CustomerMenu';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import KasirOrders from './pages/KasirOrders';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const isAdmin = user?.role === 'admin';
  const isKasir = user?.role === 'kasir' || user?.role === 'admin';

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Customer Side */}
          <Route path="/" element={<CustomerMenu />} />
          
          {/* Admin Side */}
          <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          
          <Route 
            path="/admin/dashboard/*" 
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
          />
          
          <Route 
            path="/kasir" 
            element={isKasir ? <KasirOrders /> : <Navigate to="/admin/login" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
