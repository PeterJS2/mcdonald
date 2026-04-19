import { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingCart, RotateCcw, CheckCircle } from 'lucide-react';

const CustomerMenu = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isOrdered, setIsOrdered] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products')
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      if (catRes.data.length > 0) setActiveCategory(catRes.data[0].id);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        product_id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product_id === productId);
    if (item && item.quantity > 1) {
        setCart(cart.map(i => i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
        setCart(cart.filter(item => item.product_id !== productId));
    }
  };

  const resetCart = () => setCart([]);

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      await api.post('/orders', {
        items: cart,
        total_price: totalPrice
      });
      setIsOrdered(true);
      resetCart();
      setTimeout(() => setIsOrdered(false), 3000);
    } catch (error) {
      console.error('Error placing order', error);
      alert('Gagal membuat pesanan');
    }
  };

  const filteredProducts = activeCategory 
    ? products.filter(p => p.category_id === activeCategory)
    : products;

  if (isOrdered) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-yellow-400 text-white">
        <CheckCircle size={100} className="mb-4" />
        <h1 className="text-4xl font-bold">Terima Kasih!</h1>
        <p className="text-xl">Pesanan Anda sedang diproses.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar: Categories */}
      <div className="w-1/4 bg-red-600 p-4 overflow-y-auto">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">MCD MENU</h2>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-full text-left p-4 mb-2 rounded-lg font-bold transition-colors ${
              activeCategory === cat.id ? 'bg-yellow-400 text-red-700' : 'bg-red-700 text-white hover:bg-red-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Content: Products */}
      <div className="w-2/4 p-6 bg-white overflow-y-auto grid grid-cols-2 gap-6 content-start">
        {filteredProducts.map(product => (
          <button
            key={product.id}
            onClick={() => addToCart(product)}
            className="border rounded-xl p-4 flex flex-col items-center shadow-md hover:bg-gray-50 active:scale-95 transition-all"
          >
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-32 h-32 object-contain mb-2" />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400">NO IMG</div>
            )}
            <div className="text-center">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-red-600 font-bold">Rp {Number(product.price).toLocaleString('id-ID')}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Right Sidebar: Cart */}
      <div className="w-1/4 bg-gray-50 border-l p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6 border-b pb-2">
          <ShoppingCart size={24} className="text-red-600" />
          <h2 className="text-xl font-bold">Pesanan Saya</h2>
        </div>

        <div className="flex-grow overflow-y-auto mb-4">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Pilih menu untuk mulai memesan</p>
          ) : (
            cart.map(item => (
              <div key={item.product_id} className="flex justify-between items-center mb-4 p-2 bg-white rounded shadow-sm">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  <button 
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-xs text-red-500 hover:underline"
                  >Hapus</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-red-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={resetCart}
              className="flex items-center justify-center gap-1 bg-gray-300 py-3 rounded-lg font-bold hover:bg-gray-400"
            >
              <RotateCcw size={18} /> Reset
            </button>
            <button 
              onClick={placeOrder}
              disabled={cart.length === 0}
              className={`py-3 rounded-lg font-bold text-white ${cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            >
              Bayar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMenu;
