import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Production() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // RF004 & RF008: Busca a sugestão de produção baseada no estoque e valor
  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await api.get('/production-suggestion');
      setPlan(response.data);
    } catch (error) {
      console.error("Error fetching production plan:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega o plano automaticamente ao abrir a aba
  useEffect(() => {
    generatePlan();
  }, []);

  // Lógica para efetivar a produção e abater do estoque
  const handleConfirmProduction = async (productName, productId, quantity) => {
    if (confirm(`Confirm production of ${quantity} units of ${productName}? This will reduce stock.`)) {
      try {
        await api.post(`/produce/${productId}`, { quantity });
        alert("Stock updated successfully!");
        generatePlan(); // Recalcula a sugestão com o novo estoque
      } catch (e) {
        alert("Error processing production. Check if there is enough stock.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          📈 Production Suggestions
        </h2>
        <button 
          onClick={generatePlan} 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? "Calculating..." : "🔄 Refresh Suggestion"}
        </button>
      </div>

      <p className="text-slate-600 italic">
        Priority is given to higher value products based on current raw material availability.
      </p>

      {plan?.productionPlan.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {plan.productionPlan.map((item) => (
            <div 
              key={item.productId} 
              className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center md:text-left">
                <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Product</p>
                <h3 className="text-xl font-bold text-indigo-600">{item.productName}</h3>
              </div>
              
              <div className="my-4 md:my-0 text-center">
                <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Quantity Possible</p>
                <p className="text-2xl font-mono font-bold text-slate-700">{item.quantity} units</p>
              </div>

              <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Estimated Revenue</p>
                  <p className="text-xl text-green-600 font-bold">R$ {item.subtotal.toFixed(2)}</p>
                </div>
                
                {/* Botão para confirmar a produção real */}
                <button 
                  onClick={() => handleConfirmProduction(item.productName, item.productId, item.quantity)}
                  className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-4 py-2 rounded-lg font-bold transition-colors"
                >
                  ✅ Confirm Production
                </button>
              </div>
            </div>
          ))}
          
          {/* Valor Total Previsto */}
          <div className="mt-8 p-8 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl text-white shadow-xl shadow-indigo-200">
            <p className="text-sm font-bold uppercase opacity-80 tracking-widest">Total Potential Revenue</p>
            <h2 className="text-5xl font-black">R$ {plan.totalRevenue.toFixed(2)}</h2>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg italic">
            Insufficient stock or no compositions found to generate a profitable plan.
          </p>
        </div>
      )}
    </div>
  );
}