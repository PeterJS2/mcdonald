import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Package, Tags, Users, LogOut, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold flex items-center gap-2 text-yellow-500">
            <LayoutDashboard /> Admin
        </div>
        <nav className="flex-grow">
          <Link to="/admin/dashboard/products" className="flex items-center gap-3 p-4 hover:bg-gray-700 transition">
            <Package size={20} /> Products
          </Link>
          <Link to="/admin/dashboard/categories" className="flex items-center gap-3 p-4 hover:bg-gray-700 transition">
            <Tags size={20} /> Categories
          </Link>
          <Link to="/admin/dashboard/users" className="flex items-center gap-3 p-4 hover:bg-gray-700 transition">
            <Users size={20} /> Users
          </Link>
          <Link to="/kasir" className="flex items-center gap-3 p-4 hover:bg-gray-700 transition">
            <ShoppingCart size={20} /> Orders
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-6 hover:bg-red-600 transition border-t border-gray-700">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 overflow-y-auto p-8">
        <Routes>
          <Route path="products" element={<ProductManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="/" element={<div className="text-3xl font-bold text-gray-400 mt-20 text-center">Selamat Datang di Admin Panel</div>} />
        </Routes>
      </div>
    </div>
  );
};

// --- Managers (Simplified for space, would be in separate files usually) ---

const ProductManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', category_id: '', image_url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
    setProducts(p.data);
    setCategories(c.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        await api.post('/products', form);
        setForm({ name: '', price: '', category_id: '', image_url: '' });
        fetchData();
    } catch (err) { alert('Gagal simpan'); }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Hapus?')) {
        await api.delete(`/products/${id}`);
        fetchData();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Products</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 grid grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full p-2 border rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Price</label>
          <input className="w-full p-2 border rounded" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Category</label>
          <select className="w-full p-2 border rounded" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} required>
            <option value="">Select...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button className="bg-blue-600 text-white p-2 rounded">Add Product</button>
      </form>
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.category?.name}</td>
              <td className="p-3">Rp {Number(p.price).toLocaleString()}</td>
              <td className="p-3">
                <button onClick={() => handleDelete(p.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CategoryManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { const res = await api.get('/categories'); setCategories(res.data); };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await api.post('/categories', { name });
    setName('');
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Hapus?')) { await api.delete(`/categories/${id}`); fetchData(); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input className="p-2 border rounded flex-grow" value={name} onChange={e => setName(e.target.value)} placeholder="New Category Name" required />
        <button className="bg-blue-600 text-white p-2 px-4 rounded">Add</button>
      </form>
      <div className="grid grid-cols-4 gap-4">
        {categories.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <span className="font-bold">{c.name}</span>
            <button onClick={() => handleDelete(c.id)} className="text-red-500 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'kasir' });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { const res = await api.get('/users'); setUsers(res.data); };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await api.post('/users', form);
    setForm({ username: '', password: '', role: 'kasir' });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Hapus?')) { await api.delete(`/users/${id}`); fetchData(); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Admin Users</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 grid grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm">Username</label>
          <input className="w-full p-2 border rounded" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input className="w-full p-2 border rounded" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm">Role</label>
          <select className="w-full p-2 border rounded" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required>
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white p-2 rounded">Add User</button>
      </form>
      <div className="bg-white rounded shadow overflow-hidden">
        {users.map(u => (
          <div key={u.id} className="p-4 border-b flex justify-between items-center">
            <div>
              <p className="font-bold">{u.username}</p>
              <p className="text-xs uppercase text-gray-500">{u.role}</p>
            </div>
            <button onClick={() => handleDelete(u.id)} className="text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

import { ShoppingCart } from 'lucide-react';

export default AdminDashboard;
