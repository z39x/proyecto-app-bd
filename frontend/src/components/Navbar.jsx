import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/clientes" style={{ marginRight: '1rem' }}>Clientes</Link>
      <Link to="/productos" style={{ marginRight: '1rem' }}>Productos</Link>
      <Link to="/pedidos" style={{ marginRight: '1rem' }}>Pedidos</Link>
      <Link to="/consultas">Consultas</Link>
    </nav>
  );
}
