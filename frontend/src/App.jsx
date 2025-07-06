import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Cliente from './components/Cliente';
import Producto from './components/Producto';
import Pedido from './components/Pedido';
import Consultas from './components/Consultas';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/clientes" />} />
          <Route path="/clientes" element={<Cliente />} />
          <Route path="/productos" element={<Producto />} />
          <Route path="/pedidos" element={<Pedido />} />
          <Route path="/consultas" element={<Consultas />} />
        </Routes>
      </div>
    </Router>
  );
}
