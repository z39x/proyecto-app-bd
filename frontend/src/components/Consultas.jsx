import React, { useState, useEffect } from 'react';

export default function Consultas() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [ciudad, setCiudad] = useState('');
  const [fecha, setFecha] = useState('');
  const [codigoProducto, setCodigoProducto] = useState('');
  const [codigoCliente, setCodigoCliente] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/clientes').then(res => res.json()).then(setClientes);
    fetch('http://localhost:3000/api/productos').then(res => res.json()).then(setProductos);
    fetch('http://localhost:3000/api/pedidos').then(res => res.json()).then(setPedidos);
  }, []);

  const clientesPorCiudad = clientes.filter(c => c.direccion.ciudad.toLowerCase() === ciudad.toLowerCase());
  const clientesPorFecha = clientes.filter(c => c.fechaRegistro === fecha);
  const productoEncontrado = productos.find(p => p.codProducto === parseInt(codigoProducto));
  const pedidosCliente = pedidos.filter(p => p.codigoCliente === codigoCliente);

  return (
    <div>
      <h2>Consultas</h2>

      <div>
        <h3>a. Clientes por ciudad</h3>
        <input placeholder="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} />
        <ul>
          {clientesPorCiudad.map(c => (
            <li key={c._id}>{c.nombre} {c.apellidos} - {c.direccion.ciudad}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>b. Clientes por fecha de registro</h3>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        <ul>
          {clientesPorFecha.map(c => (
            <li key={c._id}>{c.nombre} {c.apellidos} - Registrado: {c.fechaRegistro}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>c. Datos del producto por código</h3>
        <input type="number" placeholder="Código de producto" value={codigoProducto} onChange={e => setCodigoProducto(e.target.value)} />
        {productoEncontrado && (
          <div>
            <p>Nombre: {productoEncontrado.nombre}</p>
            <p>Precio: ${productoEncontrado.precio}</p>
            <p>Stock: {productoEncontrado.stock}</p>
            <p>Estado: {productoEncontrado.estado}</p>
          </div>
        )}
      </div>

      <div>
        <h3>d. Pedidos de un cliente</h3>
        <input placeholder="Código Cliente" value={codigoCliente} onChange={e => setCodigoCliente(e.target.value)} />
        <ul>
          {pedidosCliente.map(p => (
            <li key={p._id}>Pedido: {p.codigoPedido} | Fecha: {p.fechaPedido} | Total: ${p.totalCompra}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
