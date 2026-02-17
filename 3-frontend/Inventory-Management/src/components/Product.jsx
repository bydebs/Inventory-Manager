import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, price: parseFloat(price) };

    if (editingId) {
      await api.put(`/products/${editingId}`, data); // Rota de Update
      setEditingId(null);
    } else {
      await api.post('/products', data); // Rota de Create
    }

    setName(''); setPrice(''); fetchProducts();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      await api.delete(`/products/${id}`); // Rota de Delete
      fetchProducts();
    }
  };

  return (
    <div>
      <h2>🪑 Register Products</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <button type="submit">{editingId ? 'Save' : 'Add Product'}</button>
      </form>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - R$ {p.price}
            <button onClick={() => {setEditingId(p.id); setName(p.name); setPrice(p.price);}}>✏️</button>
            <button onClick={() => handleDelete(p.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}