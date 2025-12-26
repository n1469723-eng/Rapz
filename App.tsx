
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  Package, 
  Bike, 
  PlusCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  LogOut, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { UserRole, User, Order, OrderStatus } from './types.ts';
import BusinessDashboard from './components/BusinessDashboard.tsx';
import CourierDashboard from './components/CourierDashboard.tsx';
import CreateOrder from './components/CreateOrder.tsx';
import OrderDetails from './components/OrderDetails.tsx';
import { getMarketInsights } from './services/geminiService.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [insight, setInsight] = useState<string>("");

  useEffect(() => {
    const savedUser = localStorage.getItem('rapz_user');
    const savedOrders = localStorage.getItem('rapz_orders');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    fetchInsight();
  }, []);

  const fetchInsight = async () => {
    try {
      const text = await getMarketInsights();
      setInsight(text);
    } catch (e) {
      setInsight("Mantenha o foco nas entregas!");
    }
  };

  useEffect(() => {
    localStorage.setItem('rapz_orders', JSON.stringify(orders));
  }, [orders]);

  const handleLogin = (role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === UserRole.BUSINESS ? 'Pizzaria Express' : 'Carlos Motoboy',
      email: role === UserRole.BUSINESS ? 'loja@rapz.com' : 'entregador@rapz.com',
      role: role
    };
    setUser(newUser);
    localStorage.setItem('rapz_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rapz_user');
  };

  const createOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, courierId?: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status, courierId: courierId || o.courierId } : o
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-700 to-blue-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-white/20">
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Zap className="w-14 h-14 text-white fill-white" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">RAPZ</h1>
          <p className="text-slate-500 font-medium mb-10">Quem entrega, conecta!</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleLogin(UserRole.BUSINESS)}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl transition-all transform active:scale-[0.98] shadow-lg"
            >
              <Package className="w-5 h-5" />
              Sou uma Loja / Delivery
            </button>
            <button 
              onClick={() => handleLogin(UserRole.COURIER)}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-100"
            >
              <Bike className="w-5 h-5" />
              Sou um Motoboy
            </button>
          </div>
          <p className="mt-10 text-slate-400 text-xs font-medium uppercase tracking-widest">A revolução nas entregas</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter">RAPZ</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 border border-slate-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span className="italic">"{insight}"</span>
              </div>
              
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {user.role === UserRole.BUSINESS ? 'Estabelecimento' : 'Entregador'}
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={
              user.role === UserRole.BUSINESS 
                ? <BusinessDashboard orders={orders.filter(o => o.businessName === user.name)} /> 
                : <CourierDashboard orders={orders} user={user} updateOrderStatus={updateOrderStatus} />
            } />
            <Route path="/new-order" element={<CreateOrder user={user} createOrder={createOrder} />} />
            <Route path="/order/:id" element={<OrderDetails orders={orders} user={user} updateOrderStatus={updateOrderStatus} />} />
          </Routes>
        </main>

        {user.role === UserRole.BUSINESS && (
          <Link 
            to="/new-order"
            className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-black transition-all sm:hidden transform hover:scale-110 active:scale-95 z-50"
          >
            <PlusCircle className="w-8 h-8" />
          </Link>
        )}
      </div>
    </HashRouter>
  );
};

export default App;
