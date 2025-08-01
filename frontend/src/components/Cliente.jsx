import React, { useState, useEffect } from 'react';

export default function Cliente() {
  const [form, setForm] = useState({
    identificadorCli: '', nombre: '', apellidos: '',
    direccion: { calle: '', numero: '', ciudad: '' },
    fechaRegistro: ''
  });
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchClientes = async () => {
    const res = await fetch('http://localhost:3000/api/clientes');
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['calle', 'numero', 'ciudad'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        direccion: { ...prev.direccion, [name]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!editMode && clientes.some(c => c.identificadorCli === form.identificadorCli)) {
      return setError('Este identificador no es único');
    }

    const payload = { ...form };
    if (editMode) {
      const res = await fetch(`http://localhost:3000/api/clientes/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchClientes();
        resetForm();
      }
    } else {
      const res = await fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchClientes();
        resetForm();
      }
    }
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setEditId(cliente._id);
    setEditMode(true);
  };

  const handleDelete = async (id, identificadorCli) => {
    const pedidosRes = await fetch('http://localhost:3000/api/pedidos');
    const pedidos = await pedidosRes.json();
    const tienePedidos = pedidos.some(p => p.codigoCliente === identificadorCli);
    if (tienePedidos) {
      return setError('Error, el cliente tiene asociado pedidos');
    }

    const res = await fetch(`http://localhost:3000/api/clientes/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      await fetchClientes();
    }
  };

  const resetForm = () => {
    setForm({ identificadorCli: '', nombre: '', apellidos: '', direccion: { calle: '', numero: '', ciudad: '' }, fechaRegistro: '' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div>
      <h2>Formulario Cliente</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="identificadorCli" placeholder="Identificador" value={form.identificadorCli} onChange={handleChange} disabled={editMode} />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
        <input name="calle" placeholder="Calle" value={form.direccion.calle} onChange={handleChange} />
        <input name="numero" placeholder="Número" type="number" value={form.direccion.numero} onChange={handleChange} />
        <input name="ciudad" placeholder="Ciudad" value={form.direccion.ciudad} onChange={handleChange} />
        <input name="fechaRegistro" placeholder="Fecha Registro" type="date" value={form.fechaRegistro} onChange={handleChange} />
        <button type="submit" style={{ backgroundColor: editMode ? 'blue' : 'green' }}>
          {editMode ? 'Actualizar' : 'Guardar'}
        </button>
        {editMode && <button type="button" onClick={resetForm}>Cancelar</button>}
      </form>

      <h3>Registros</h3>
      <ul>
        {clientes.map((c) => (
          <li key={c._id}>
            {c.identificadorCli} - {c.nombre} {c.apellidos}, {c.direccion.calle} {c.direccion.numero}, {c.direccion.ciudad} (Registrado: {c.fechaRegistro})
            <button onClick={() => handleEdit(c)} style={{ marginLeft: '1rem', backgroundColor: 'blue', color: 'white' }}>Actualizar</button>
            <button onClick={() => handleDelete(c._id, c.identificadorCli)} style={{ marginLeft: '0.5rem', backgroundColor: 'red', color: 'white' }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
