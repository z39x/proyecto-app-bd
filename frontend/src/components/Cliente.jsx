import React, { useState, useEffect } from 'react';

export default function Cliente() {
  const [form, setForm] = useState({
    identificadorCli: '', nombre: '', apellidos: '', 
    direccion: { calle: '', numero: '', ciudad: '' }, 
    fechaRegistro: ''
  });
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');

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

    const exists = clientes.some(c => c.identificadorCli === form.identificadorCli);
    if (exists) return setError('Este identificador no es único');

    const res = await fetch('http://localhost:3000/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      fetchClientes();
      setForm({
        identificadorCli: '', nombre: '', apellidos: '', 
        direccion: { calle: '', numero: '', ciudad: '' }, 
        fechaRegistro: ''
      });
    }
  };

  return (
    <div>
      <h2>Formulario Cliente</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="identificadorCli" placeholder="Identificador" value={form.identificadorCli} onChange={handleChange} />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
        <input name="calle" placeholder="Calle" value={form.direccion.calle} onChange={handleChange} />
        <input name="numero" placeholder="Número" type="number" value={form.direccion.numero} onChange={handleChange} />
        <input name="ciudad" placeholder="Ciudad" value={form.direccion.ciudad} onChange={handleChange} />
        <input name="fechaRegistro" placeholder="Fecha Registro" type="date" value={form.fechaRegistro} onChange={handleChange} />
        <button type="submit">Guardar</button>
      </form>

      <h3>Registros</h3>
      <ul>
        {clientes.map((c) => (
          <li key={c._id}>
            {c.identificadorCli} - {c.nombre} {c.apellidos}, {c.direccion.calle} {c.direccion.numero}, {c.direccion.ciudad} (Registrado: {c.fechaRegistro})
          </li>
        ))}
      </ul>
    </div>
  );
}
