import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Composition() {
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newAssociation, setNewAssociation] = useState({ raw_material_id: '', needed_quantity: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [resProd, resMat] = await Promise.all([
      api.get('/products'),
      api.get('/raw-materials')
    ]);
    setProducts(resProd.data);
    setRawMaterials(resMat.data);
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return alert("Select a product first!");
    
    await api.post(`/products/${selectedProductId}/materials`, newAssociation);
    setNewAssociation({ raw_material_id: '', needed_quantity: '' });
    loadData();
  };

  const handleUpdateQuantity = async (associationId, newQty) => {
    await api.put(`/product-materials/${associationId}`, { needed_quantity: newQty });
    loadData();
  };

  const handleDeleteAssociation = async (associationId) => {
    if (confirm("Remove this material from the product?")) {
      await api.delete(`/product-materials/${associationId}`);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Product Composition (Recipe)</h2>

      {/* Selector de Produto */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Product to Manage:</label>
        <select 
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">-- Choose a Product --</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {selectedProductId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form para Adicionar Material (Create) */}
          <div className="lg:col-span-1 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="font-bold text-indigo-800 mb-4 text-lg">Add Ingredient</h3>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <select 
                className="w-full p-2 border rounded-lg bg-white"
                value={newAssociation.raw_material_id}
                onChange={(e) => setNewAssociation({...newAssociation, raw_material_id: e.target.value})}
                required
              >
                <option value="">Material...</option>
                {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input 
                type="number" 
                placeholder="Quantity needed" 
                className="w-full p-2 border rounded-lg"
                value={newAssociation.needed_quantity}
                onChange={(e) => setNewAssociation({...newAssociation, needed_quantity: e.target.value})}
                required
              />
              <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
                Link Material
              </button>
            </form>
          </div>

          {/* Lista de Materiais Atuais (Read, Update, Delete) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-lg">Current Materials</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-slate-400 text-sm uppercase">
                    <th className="py-2">Material</th>
                    <th className="py-2 text-center">Qty Needed</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.find(p => p.id == selectedProductId)?.materials.map(item => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 font-medium">{item.raw_material.name}</td>
                      <td className="py-3 text-center">
                        <input 
                          type="number" 
                          className="w-20 p-1 border rounded text-center"
                          defaultValue={item.needed_quantity}
                          onBlur={(e) => handleUpdateQuantity(item.id, e.target.value)}
                        />
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => handleDeleteAssociation(item.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}