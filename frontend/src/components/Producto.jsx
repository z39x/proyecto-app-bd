import React, { useState, useEffect } from 'react';

export default function Producto() {
  const [form, setForm] = useState({
    codProducto: '', nombre: '', precio: '', stock: '', estado: ''
  });
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

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

    if (!editMode && productos.some(p => p.codProducto === parseInt(form.codProducto))) {
      return setError('Este identificador no es único');
    }

    const payload = {
      ...form,
      codProducto: parseInt(form.codProducto),
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock)
    };

    if (editMode) {
      const res = await fetch(`http://localhost:3000/api/productos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchProductos();
        resetForm();
      }
    } else {
      const res = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchProductos();
        resetForm();
      }
    }
  };

  const handleEdit = (producto) => {
    setForm({
      codProducto: producto.codProducto,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      estado: producto.estado
    });
    setEditId(producto._id);
    setEditMode(true);
  };

  const handleDelete = async (id, codProducto) => {
    const pedidosRes = await fetch('http://localhost:3000/api/pedidos');
    const pedidos = await pedidosRes.json();
    const tienePedidos = pedidos.some(p => p.productos.some(pr => pr.codProducto === codProducto));
    if (tienePedidos) {
      return setError('Error, el producto tiene asociado pedidos');
    }

    const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      await fetchProductos();
    }
  };

  const resetForm = () => {
    setForm({ codProducto: '', nombre: '', precio: '', stock: '', estado: '' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div>
      <h2>Formulario Producto</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="codProducto" placeholder="Código Producto" value={form.codProducto} onChange={handleChange} disabled={editMode} />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="precio" placeholder="Precio" type="number" value={form.precio} onChange={handleChange} />
        <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />
        <input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} />
        <button type="submit" style={{ backgroundColor: editMode ? 'blue' : 'green' }}>
          {editMode ? 'Actualizar' : 'Guardar'}
        </button>
        {editMode && <button type="button" onClick={resetForm}>Cancelar</button>}
      </form>

      <h3>Registros</h3>
      <ul>
        {productos.map((p) => (
          <li key={p._id}>
            {p.codProducto} - {p.nombre} (${p.precio}) | Stock: {p.stock} | Estado: {p.estado}
            <button onClick={() => handleEdit(p)} style={{ marginLeft: '1rem', backgroundColor: 'blue', color: 'white' }}>Actualizar</button>
            <button onClick={() => handleDelete(p._id, p.codProducto)} style={{ marginLeft: '0.5rem', backgroundColor: 'red', color: 'white' }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
