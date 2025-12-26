
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import { User, Order, OrderStatus } from '../types.ts';
import { getSmartPricing } from '../services/geminiService.ts';

interface Props {
  user: User;
  createOrder: (order: Order) => void;
}

const CreateOrder: React.FC<Props> = ({ user, createOrder }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  
  const [formData, setFormData] = useState({
    origin: 'Rua Principal, 123 - Centro',
    destination: '',
    description: '',
    value: ''
  });

  const [aiSuggestion, setAiSuggestion] = useState<{ suggestedPrice: number; estimatedTime: string; reasoning: string } | null>(null);

  const handleAiEstimate = async () => {
    if (!formData.origin || !formData.destination || !formData.description) {
      alert("Preencha origem, destino e descrição para calcular.");
      return;
    }

    setEstimating(true);
    try {
      const result = await getSmartPricing(formData.origin, formData.destination, formData.description);
      setAiSuggestion(result);
      setFormData(prev => ({ ...prev, value: result.suggestedPrice.toString() }));
    } catch (e) {
      alert("Erro ao calcular preço inteligente.");
    } finally {
      setEstimating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      businessName: user.name,
      origin: { address: formData.origin, lat: -23.5, lng: -46.6 },
      destination: { address: formData.destination, lat: -23.55, lng: -46.65 },
      value: parseFloat(formData.value) || 0,
      distance: Math.random() * 5 + 1,
      description: formData.description,
      status: OrderStatus.PENDING,
      createdAt: Date.now(),
      estimatedTime: aiSuggestion?.estimatedTime
    };

    setTimeout(() => {
      createOrder(newOrder);
      navigate('/');
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar para o Início
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-indigo-50/50">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Package className="w-7 h-7 text-indigo-600" />
            Nova Solicitação de Entrega
          </h2>
          <p className="text-slate-500 mt-1">Defina o local e o valor da corrida para os motoboys.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Endereço de Retirada (Sua Loja)
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Endereço de Destino (Cliente)
              </label>
              <input
                type="text"
                placeholder="Para onde vamos?"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                O que será entregue?
              </label>
              <input
                type="text"
                placeholder="Ex: 2 Pizzas G + Refrigerante"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">Valor da Entrega (R$)</label>
              <button 
                type="button"
                onClick={handleAiEstimate}
                disabled={estimating}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                {estimating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Sugestão Inteligente (AI)
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</div>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-2xl font-black text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>

            {aiSuggestion && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 animate-in zoom-in-95 duration-300">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <div className="text-sm font-bold text-emerald-800">Cálculo da Inteligência Artificial</div>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">{aiSuggestion.reasoning}</p>
                    <div className="text-xs font-bold text-emerald-900 mt-2">Estimativa: {aiSuggestion.estimatedTime}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publicar Entrega"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
