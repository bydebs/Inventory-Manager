// src/App.jsx
import { useState } from 'react';
import Material from "./components/Material";
import Product from "./components/Product";
import Composition from "./components/Composition";
import Production from "./components/Production";
import "./index.css";

function App() {
  const [tab, setTab] = useState('materials');

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">AUTOFLEX - Inventory Manager</h1>
        </header>

        {/* Navegação Responsiva (RNF003) */}
        <nav className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <button onClick={() => setTab('materials')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'materials' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>Materials</button>
          <button onClick={() => setTab('products')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>Products</button>
          <button onClick={() => setTab('composition')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'composition' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>Composition</button>
          <button onClick={() => setTab('production')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'production' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>Production Plan</button>
        </nav>

        <main className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 transition-all">
          {tab === 'materials' && <Material />}
          {tab === 'products' && <Product />}
          {tab === 'composition' && <Composition />}
          {tab === 'production' && <Production />}
        </main>
      </div>
    </div>
  );
}

export default App;