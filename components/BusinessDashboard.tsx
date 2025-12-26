
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle2, Package, MapPin, ChevronRight, Zap } from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';

interface Props {
  orders: Order[];
}

const BusinessDashboard: React.FC<Props> = ({ orders }) => {
  const stats = {
    pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
    active: orders.filter(o => o.status === OrderStatus.ACCEPTED || o.status === OrderStatus.PICKED_UP).length,
    completed: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Entregas</h2>
          <p className="text-slate-500 font-medium">Gerencie seu delivery com a velocidade RAPZ.</p>
        </div>
        <Link 
          to="/new-order"
          className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl transform active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Nova Entrega
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.pending}</div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Aguardando</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Zap className="w-7 h-7 text-indigo-500 fill-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.active}</div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Em Trânsito</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.completed}</div>
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Finalizadas</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-900 tracking-tight">Atividade Recente</h3>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium">Nenhuma entrega no momento. Que tal começar agora?</p>
            <Link to="/new-order" className="mt-6 inline-block text-indigo-600 font-bold hover:underline">Criar primeiro pedido</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map(order => (
              <Link 
                key={order.id} 
                to={`/order/${order.id}`}
                className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    order.status === OrderStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600' : 
                    order.status === OrderStatus.PENDING ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{order.description}</div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {order.destination.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="font-black text-slate-900">R$ {order.value.toFixed(2)}</div>
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                      {new Date(order.createdAt).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
