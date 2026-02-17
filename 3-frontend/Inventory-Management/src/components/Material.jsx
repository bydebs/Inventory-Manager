import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchMaterials = async () => {
    const res = await api.get('/raw-materials');
    setMaterials(res.data);
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, stock_quantity: parseFloat(quantity) };
    
    if (editingId) {
      await api.put(`/raw-materials/${editingId}`, data); // Rota de Update
      setEditingId(null);
    } else {
      await api.post('/raw-materials', data); // Rota de Create
    }
    
    setName(''); setQuantity(''); fetchMaterials();
  };

  const handleEdit = (m) => {
    setEditingId(m.id);
    setName(m.name);
    setQuantity(m.stock_quantity);
  };

  const handleDelete = async (id) => {
    if (confirm("Deseja excluir este material?")) {
      await api.delete(`/raw-materials/${id}`); // Rota de Delete
      fetchMaterials();
    }
  };

  return (
    <div>
      <h2>📦 Register Raw Materials</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Stock" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        <button   type="submit">{editingId ? 'Update' : 'Register'}</button>
        {editingId && <button onClick={() => {setEditingId(null); setName(''); setQuantity('');}}>Cancel</button>}
      </form>

      <ul>
        {materials.map(m => (
          <li key={m.id} style={{ marginBottom: '10px' }}>
            {m.name} - Qtd: {m.stock_quantity}
            <button onClick={() => handleEdit(m)} style={{ marginLeft: '10px' }}>✏️</button>
            <button onClick={() => handleDelete(m.id)} style={{ color: 'red' }}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}