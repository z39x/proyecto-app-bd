import React, { useState, useEffect } from 'react';

export default function Pedido() {
  const [form, setForm] = useState({
    codigoPedido: '', codigoCliente: '', fechaPedido: '', productos: [{ codProducto: '', nombre: '', cantidad: '', precioUnitario: '', totalComprado: '' }], totalCompra: '', metodoPago: ''
  });
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productosDB, setProductosDB] = useState([]);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    const [resPedidos, resClientes, resProductos] = await Promise.all([
      fetch('http://localhost:3000/api/pedidos'),
      fetch('http://localhost:3000/api/clientes'),
      fetch('http://localhost:3000/api/productos')
    ]);
    const [dataP, dataC, dataProd] = await Promise.all([
      resPedidos.json(),
      resClientes.json(),
      resProductos.json()
    ]);
    setPedidos(dataP);
    setClientes(dataC);
    setProductosDB(dataProd);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const nuevosProductos = [...form.productos];
      nuevosProductos[index][name] = value;
      nuevosProductos[index].totalComprado = nuevosProductos[index].cantidad * nuevosProductos[index].precioUnitario;
      setForm((prev) => ({ ...prev, productos: nuevosProductos }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (pedidos.some(p => p.codigoPedido === form.codigoPedido)) {
      return setError('Este identificador no es único');
    }

    const clienteExiste = clientes.some(c => c.identificadorCli === form.codigoCliente);
    if (!clienteExiste) return setError('El código de cliente no se encuentra o no existe');

    for (let prod of form.productos) {
      if (!productosDB.some(p => p.codProducto === parseInt(prod.codProducto))) {
        return setError(`El producto con código ${prod.codProducto} no existe`);
      }
    }

    const pedidoFormateado = {
      ...form,
      productos: form.productos.map(p => ({
        ...p,
        codProducto: parseInt(p.codProducto),
        cantidad: parseInt(p.cantidad),
        precioUnitario: parseFloat(p.precioUnitario),
        totalComprado: parseFloat(p.totalComprado)
      })),
      totalCompra: parseFloat(form.totalCompra)
    };

    const res = await fetch('http://localhost:3000/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoFormateado)
    });

    if (res.ok) {
      fetchAll();
      setForm({ codigoPedido: '', codigoCliente: '', fechaPedido: '', productos: [{ codProducto: '', nombre: '', cantidad: '', precioUnitario: '', totalComprado: '' }], totalCompra: '', metodoPago: '' });
    }
  };

  return (
    <div>
      <h2>Formulario Pedido</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="codigoPedido" placeholder="Código Pedido" value={form.codigoPedido} onChange={handleChange} />
        <input name="codigoCliente" placeholder="Código Cliente" value={form.codigoCliente} onChange={handleChange} />
        <input name="fechaPedido" type="date" placeholder="Fecha Pedido" value={form.fechaPedido} onChange={handleChange} />

        <h4>Producto</h4>
        {form.productos.map((prod, i) => (
          <div key={i}>
            <input name="codProducto" placeholder="Código Producto" value={prod.codProducto} onChange={(e) => handleChange(e, i)} />
            <input name="nombre" placeholder="Nombre" value={prod.nombre} onChange={(e) => handleChange(e, i)} />
            <input name="cantidad" type="number" placeholder="Cantidad" value={prod.cantidad} onChange={(e) => handleChange(e, i)} />
            <input name="precioUnitario" type="number" placeholder="Precio Unitario" value={prod.precioUnitario} onChange={(e) => handleChange(e, i)} />
            <input name="totalComprado" type="number" placeholder="Total" value={prod.totalComprado} disabled />
          </div>
        ))}

        <input name="totalCompra" type="number" placeholder="Total Compra" value={form.totalCompra} onChange={handleChange} />
        <input name="metodoPago" placeholder="Método de Pago" value={form.metodoPago} onChange={handleChange} />
        <button type="submit">Guardar</button>
      </form>

      <h3>Pedidos Registrados</h3>
      <ul>
        {pedidos.map((p) => (
          <li key={p._id}>
            Pedido {p.codigoPedido} - Cliente: {p.codigoCliente} - Total: ${p.totalCompra}
          </li>
        ))}
      </ul>
    </div>
  );
}