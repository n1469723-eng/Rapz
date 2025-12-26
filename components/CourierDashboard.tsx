
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, MapPin, DollarSign, Clock, Navigation, ChevronRight, CheckCircle2, History as HistoryIcon } from 'lucide-react';
import { Order, OrderStatus, User } from '../types';

interface Props {
  orders: Order[];
  user: User;
  updateOrderStatus: (id: string, status: OrderStatus, courierId?: string) => void;
}

const CourierDashboard: React.FC<Props> = ({ orders, user, updateOrderStatus }) => {
  const [filter, setFilter] = useState<'AVAILABLE' | 'ACTIVE' | 'HISTORY'>('AVAILABLE');

  const availableOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const myTotalOrders = orders.filter(o => o.courierId === user.id);

  const activeDeliveries = myTotalOrders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);
  const completedDeliveries = myTotalOrders.filter(o => o.status === OrderStatus.DELIVERED);

  const displayedOrders = 
    filter === 'AVAILABLE' ? availableOrders : 
    filter === 'ACTIVE' ? activeDeliveries : 
    completedDeliveries;

  const totalEarnings = completedDeliveries.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
          <div className="flex justify-between items-start mb-4">
            <DollarSign className="w-8 h-8 p-1.5 bg-emerald-500 rounded-lg" />
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Ganhos Totais</span>
          </div>
          <div className="text-3xl font-bold mb-1">R$ {totalEarnings.toFixed(2)}</div>
          <div className="text-emerald-100 text-sm flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {completedDeliveries.length} entregas finalizadas
          </div>
        </div>

        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
          <div className="flex justify-between items-start mb-4">
            <Navigation className="w-8 h-8 p-1.5 bg-indigo-500 rounded-lg" />
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Ativas</span>
          </div>
          <div className="text-3xl font-bold mb-1">{activeDeliveries.length}</div>
          <div className="text-indigo-100 text-sm">Pedidos em andamento</div>
        </div>
      </div>

      <div className="flex p-1 bg-slate-200 rounded-2xl max-w-lg overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setFilter('AVAILABLE')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            filter === 'AVAILABLE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Disponíveis ({availableOrders.length})
        </button>
        <button 
          onClick={() => setFilter('ACTIVE')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            filter === 'ACTIVE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Em Curso ({activeDeliveries.length})
        </button>
        <button 
          onClick={() => setFilter('HISTORY')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            filter === 'HISTORY' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Histórico ({completedDeliveries.length})
        </button>
      </div>

      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {filter === 'HISTORY' ? <HistoryIcon className="w-8 h-8 text-slate-300" /> : <Bike className="w-8 h-8 text-slate-300" />}
            </div>
            <p className="text-slate-500 font-medium">
              {filter === 'AVAILABLE' ? 'Nenhuma entrega nova por perto.' : 
               filter === 'ACTIVE' ? 'Você não tem nenhuma entrega ativa.' : 
               'Seu histórico de entregas está vazio.'}
            </p>
          </div>
        ) : (
          displayedOrders.map(order => (
            <Link 
              key={order.id} 
              to={`/order/${order.id}`}
              className={`block bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-[0.99] ${
                order.status === OrderStatus.DELIVERED ? 'opacity-85' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${order.status === OrderStatus.DELIVERED ? 'bg-slate-50' : 'bg-slate-100'}`}>
                    {order.status === OrderStatus.DELIVERED ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Bike className="w-6 h-6 text-slate-600" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-none mb-1">{order.businessName}</h4>
                    <p className="text-sm text-slate-500">{order.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black ${order.status === OrderStatus.DELIVERED ? 'text-slate-700' : 'text-indigo-600'}`}>
                    R$ {order.value.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">~ {order.distance.toFixed(1)} km</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="font-medium">Retirada:</span> {order.origin.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="font-medium">Destino:</span> {order.destination.address}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === OrderStatus.PENDING ? 'bg-amber-100 text-amber-700' : 
                  order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {order.status === OrderStatus.PENDING ? 'Esperando Motoboy' : 
                   order.status === OrderStatus.ACCEPTED ? 'Aceito' : 
                   order.status === OrderStatus.PICKED_UP ? 'Em Entrega' : 'Entregue'}
                </div>
                <div className="flex items-center gap-1 text-indigo-600 text-sm font-bold">
                  {order.status === OrderStatus.DELIVERED ? 'Ver Comprovante' : 'Ver Detalhes'} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CourierDashboard;
