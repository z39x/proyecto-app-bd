import React, { useState, useEffect } from 'react';

export default function Producto() {
  const [form, setForm] = useState({
    codProducto: '', nombre: '', precio: '', stock: '', estado: ''
  });
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  const fetchProductos = async () => {
    const res = await fetch('http://localhost:3000/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const exists = productos.some(p => p.codProducto === parseInt(form.codProducto));
    if (exists) return setError('Este identificador no es único');

    const res = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, codProducto: parseInt(form.codProducto), precio: parseFloat(form.precio), stock: parseInt(form.stock) })
    });

    if (res.ok) {
      fetchProductos();
      setForm({ codProducto: '', nombre: '', precio: '', stock: '', estado: '' });
    }
  };

  return (
    <div>
      <h2>Formulario Producto</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="codProducto" placeholder="Código Producto" value={form.codProducto} onChange={handleChange} />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="precio" placeholder="Precio" type="number" value={form.precio} onChange={handleChange} />
        <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />
        <input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} />
        <button type="submit">Guardar</button>
      </form>

      <h3>Registros</h3>
      <ul>
        {productos.map((p) => (
          <li key={p._id}>
            {p.codProducto} - {p.nombre} (${p.precio}) | Stock: {p.stock} | Estado: {p.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
