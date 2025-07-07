import React, { useState, useEffect } from 'react';

export default function Pedido() {
  const [form, setForm] = useState({
    codigoPedido: '',
    codigoCliente: '',
    fechaPedido: '',
    productos: [],
    totalCompra: '',
    metodoPago: ''
  });
  const [productoForm, setProductoForm] = useState({
    codProducto: '', nombre: '', cantidad: '', precioUnitario: '', totalComprado: ''
  });
  const [clientes, setClientes] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const [clientesRes, productosRes, pedidosRes] = await Promise.all([
      fetch('http://localhost:3000/api/clientes'),
      fetch('http://localhost:3000/api/productos'),
      fetch('http://localhost:3000/api/pedidos')
    ]);
    setClientes(await clientesRes.json());
    setProductosDisponibles(await productosRes.json());
    setPedidos(await pedidosRes.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductoForm((prev) => ({ ...prev, [name]: value }));
  };

  const addProducto = () => {
    const productoValido = productosDisponibles.find(p => p.codProducto === parseInt(productoForm.codProducto));
    if (!productoValido) return setError('El código no se encuentra o no existe');

    const nuevo = {
      codProducto: parseInt(productoForm.codProducto),
      nombre: productoForm.nombre,
      cantidad: parseInt(productoForm.cantidad),
      precioUnitario: parseFloat(productoForm.precioUnitario),
      totalComprado: parseFloat(productoForm.totalComprado)
    };

    setForm((prev) => ({
      ...prev,
      productos: [...prev.productos, nuevo]
    }));
    setProductoForm({ codProducto: '', nombre: '', cantidad: '', precioUnitario: '', totalComprado: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!editMode && pedidos.some(p => p.codigoPedido === form.codigoPedido)) {
      return setError('Este identificador no es único');
    }

    const clienteExiste = clientes.some(c => c.identificadorCli === form.codigoCliente);
    if (!clienteExiste) return setError('El código no se encuentra o no existe');

    const payload = {
      ...form,
      totalCompra: parseFloat(form.totalCompra)
    };

    const url = editMode ? `http://localhost:3000/api/pedidos/${editId}` : 'http://localhost:3000/api/pedidos';
    const method = editMode ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      await fetchData();
      resetForm();
    }
  };

  const handleEdit = (pedido) => {
    setForm({
      codigoPedido: pedido.codigoPedido,
      codigoCliente: pedido.codigoCliente,
      fechaPedido: pedido.fechaPedido,
      productos: pedido.productos,
      totalCompra: pedido.totalCompra,
      metodoPago: pedido.metodoPago
    });
    setEditId(pedido._id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:3000/api/pedidos/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchData();
  };

  const resetForm = () => {
    setForm({ codigoPedido: '', codigoCliente: '', fechaPedido: '', productos: [], totalCompra: '', metodoPago: '' });
    setProductoForm({ codProducto: '', nombre: '', cantidad: '', precioUnitario: '', totalComprado: '' });
    setEditMode(false);
    setEditId(null);
    setError('');
  };

  return (
    <div>
      <h2>Formulario Pedido</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="codigoPedido" placeholder="Código del Pedido" value={form.codigoPedido} onChange={handleFormChange} disabled={editMode} />
        <input name="codigoCliente" placeholder="Código del Cliente" value={form.codigoCliente} onChange={handleFormChange} />
        <input type="date" name="fechaPedido" value={form.fechaPedido} onChange={handleFormChange} />

        <h4>Agregar Producto</h4>
        <input name="codProducto" placeholder="Código Producto" value={productoForm.codProducto} onChange={handleProductChange} />
        <input name="nombre" placeholder="Nombre" value={productoForm.nombre} onChange={handleProductChange} />
        <input name="cantidad" type="number" placeholder="Cantidad" value={productoForm.cantidad} onChange={handleProductChange} />
        <input name="precioUnitario" type="number" placeholder="Precio Unitario" value={productoForm.precioUnitario} onChange={handleProductChange} />
        <input name="totalComprado" type="number" placeholder="Total Comprado" value={productoForm.totalComprado} onChange={handleProductChange} />
        <button type="button" onClick={addProducto}>Agregar Producto</button>

        <ul>
          {form.productos.map((p, i) => (
            <li key={i}>{p.codProducto} - {p.nombre} - Cant: {p.cantidad} - Total: ${p.totalComprado}</li>
          ))}
        </ul>

        <input name="totalCompra" placeholder="Total de la compra" type="number" value={form.totalCompra} onChange={handleFormChange} />
        <input name="metodoPago" placeholder="Método de pago" value={form.metodoPago} onChange={handleFormChange} />

        <button type="submit" style={{ backgroundColor: editMode ? 'blue' : 'green', color: 'white' }}>{editMode ? 'Actualizar' : 'Guardar'}</button>
        {editMode && <button type="button" onClick={resetForm}>Cancelar</button>}
      </form>

      <h3>Registros</h3>
      <ul>
        {pedidos.map((p) => (
          <li key={p._id}>
            Cliente: {p.codigoCliente}, Pedido: {p.codigoPedido}, Total: ${p.totalCompra}, Fecha: {p.fechaPedido}, Pago: {p.metodoPago}
            <ul>
              {p.productos.map((prod, i) => (
                <li key={i}>{prod.codProducto} - {prod.nombre} - Cant: {prod.cantidad} - Total: ${prod.totalComprado}</li>
              ))}
            </ul>
            <button onClick={() => handleEdit(p)} style={{ marginRight: '0.5rem', backgroundColor: 'blue', color: 'white' }}>Actualizar</button>
            <button onClick={() => handleDelete(p._id)} style={{ backgroundColor: 'red', color: 'white' }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
