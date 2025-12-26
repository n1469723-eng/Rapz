
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Bike, 
  Clock, 
  ChevronLeft, 
  Package, 
  CheckCircle2, 
  Phone,
  Navigation,
  AlertCircle,
  Timer,
  UserCheck,
  Flag
} from 'lucide-react';
import { Order, OrderStatus, User, UserRole } from '../types';

interface Props {
  orders: Order[];
  user: User;
  updateOrderStatus: (id: string, status: OrderStatus, courierId?: string) => void;
}

const OrderDetails: React.FC<Props> = ({ orders, user, updateOrderStatus }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return <div className="p-8 text-center">Pedido não encontrado.</div>;
  }

  const handleAction = () => {
    if (user.role === UserRole.COURIER) {
      if (order.status === OrderStatus.PENDING) {
        updateOrderStatus(order.id, OrderStatus.ACCEPTED, user.id);
      } else if (order.status === OrderStatus.ACCEPTED) {
        updateOrderStatus(order.id, OrderStatus.PICKED_UP);
      } else if (order.status === OrderStatus.PICKED_UP) {
        updateOrderStatus(order.id, OrderStatus.DELIVERED);
      }
    }
  };

  const openGPS = () => {
    let targetAddress = order.status === OrderStatus.PICKED_UP 
      ? order.destination.address 
      : order.origin.address;
    
    if (order.estimatedTime) {
      if (order.status === OrderStatus.PICKED_UP) {
        targetAddress = `${targetAddress} (Entrega RAPZ: ${order.estimatedTime})`;
      } else if (order.status === OrderStatus.ACCEPTED) {
        targetAddress = `${targetAddress} (Retirada RAPZ: ${order.estimatedTime})`;
      }
    }
    
    const encodedAddress = encodeURIComponent(targetAddress);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      window.location.href = `maps://maps.apple.com/?q=${encodedAddress}`;
    } else {
      window.location.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }
  };

  const statusSteps = [
    { status: OrderStatus.PENDING, label: 'Buscando', icon: Clock },
    { status: OrderStatus.ACCEPTED, label: 'Aceito', icon: UserCheck },
    { status: OrderStatus.PICKED_UP, label: 'Coletado', icon: Bike },
    { status: OrderStatus.DELIVERED, label: 'Entregue', icon: Flag },
  ];

  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex(s => s.status === order.status);
    return index === -1 ? (order.status === OrderStatus.CANCELLED ? -1 : 0) : index;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </button>

      {/* Stepper Component */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="relative flex items-center justify-between mb-2">
          {/* Progress Line Background */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
          {/* Active Progress Line */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-700 ease-in-out z-0"
            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
          ></div>

          {statusSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            const isFuture = idx > currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : ''}
                  ${isActive ? 'bg-indigo-600 text-white scale-110 shadow-xl shadow-indigo-200' : ''}
                  ${isFuture ? 'bg-white border-2 border-slate-200 text-slate-300' : ''}
                `}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>
                <div className={`
                  absolute -bottom-7 whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-wider
                  ${isActive ? 'text-indigo-600' : 'text-slate-400'}
                `}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 font-medium">Pedido #{order.id.toUpperCase()}</div>
            </div>
            <div className="text-3xl font-black text-indigo-600">R$ {order.value.toFixed(2)}</div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Rota de Entrega</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-slate-100 border-dashed border-l-2"></div>
              
              <div className="flex gap-4 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 z-10 ${order.status === OrderStatus.PICKED_UP || order.status === OrderStatus.DELIVERED ? 'bg-emerald-500' : 'bg-emerald-100'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${order.status === OrderStatus.PICKED_UP || order.status === OrderStatus.DELIVERED ? 'bg-white' : 'bg-emerald-500'}`}></div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">{order.businessName} (Retirada)</div>
                  <div className="text-slate-500 text-sm">{order.origin.address}</div>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 z-10 ${order.status === OrderStatus.DELIVERED ? 'bg-red-500' : 'bg-red-100'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${order.status === OrderStatus.DELIVERED ? 'bg-white' : 'bg-red-500'}`}></div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Destino (Entrega)</div>
                  <div className="text-slate-500 text-sm">{order.destination.address}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Informações Adicionais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700 font-medium">{order.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700 font-medium">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-indigo-400" />
                <span className="text-slate-700 font-medium">
                  Tempo Estimado: <span className="text-indigo-600 font-bold">{order.estimatedTime || 'Não calculado'}</span>
                </span>
              </div>
            </div>
          </section>

          {user.role === UserRole.COURIER && order.status !== OrderStatus.DELIVERED && (
            <div className="space-y-3">
              <button
                onClick={handleAction}
                className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                  order.status === OrderStatus.PENDING ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100' :
                  order.status === OrderStatus.ACCEPTED ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100' :
                  'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                }`}
              >
                {order.status === OrderStatus.PENDING ? (
                  <>Aceitar Entrega (R$ {order.value.toFixed(2)})</>
                ) : order.status === OrderStatus.ACCEPTED ? (
                  <>Confirmei a Retirada</>
                ) : (
                  <>Confirmei a Entrega ao Cliente</>
                )}
              </button>
              
              {order.status !== OrderStatus.PENDING && (
                <div className="grid grid-cols-2 gap-3">
                   <a 
                    href={`tel:000000000`} 
                    className="py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4" /> Ligar
                  </a>
                  <button 
                    onClick={openGPS}
                    className="py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    <Navigation className="w-4 h-4" /> Abrir GPS
                  </button>
                </div>
              )}
            </div>
          )}

          {user.role === UserRole.BUSINESS && order.status === OrderStatus.DELIVERED && (
             <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 font-bold border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
              Esta entrega foi finalizada com sucesso!
            </div>
          )}
        </div>
      </div>

      {user.role === UserRole.COURIER && order.status !== OrderStatus.PENDING && order.status !== OrderStatus.DELIVERED && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
          <p className="text-sm text-indigo-800">
            Dica: O botão <strong>Abrir GPS</strong> agora dispara diretamente seu aplicativo de mapas e inclui a estimativa de tempo no rótulo da busca para facilitar sua localização.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
