import { useState, useEffect } from 'react';
import api from '../services/api';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KasirOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { const res = await api.get('/orders'); setOrders(res.data); };

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/orders/${id}/status`, { status });
    fetchData();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 bg-white rounded shadow hover:bg-gray-100">
                <ChevronLeft />
            </button>
            <h1 className="text-3xl font-bold">Manage Orders</h1>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 bg-blue-600 text-white p-2 px-4 rounded hover:bg-blue-700 transition">
            <RefreshCw size={18} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-600">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-gray-400">ORDER ID</p>
                    <p className="font-mono text-sm">{order.id.substring(0,8)}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>{order.status}</span>
            </div>

            <div className="space-y-2 mb-4 border-y py-2">
                {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product?.name}</span>
                        <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mb-6">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-red-600">Rp {Number(order.total_price).toLocaleString()}</span>
            </div>

            {order.status === 'pending' && (
                <div className="flex gap-2">
                    <button 
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="flex-grow bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition"
                    >Selesai</button>
                    <button 
                        onClick={() => updateStatus(order.id, 'cancelled')}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-300 transition"
                    >Batal</button>
                </div>
            )}
          </div>
        ))}
      </div>
      {orders.length === 0 && <p className="text-center text-gray-400 mt-20">Belum ada pesanan.</p>}
    </div>
  );
};

export default KasirOrders;
