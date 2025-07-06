import Pedido from '../models/Pedido.js';
import Cliente from '../models/Cliente.js';
import Producto from '../models/Producto.js';

export const crearPedido = async (req, res) => {
  try {
    const existe = await Pedido.findOne({ codigoPedido: req.body.codigoPedido });
    if (existe) return res.status(400).json({ error: 'Este identificador no es único' });

    const cliente = await Cliente.findOne({ identificadorCli: req.body.codigoCliente });
    if (!cliente) return res.status(400).json({ error: 'El código del cliente no existe' });

    const codigos = req.body.productos.map(p => p.codProducto);
    const productosBD = await Producto.find({ codProducto: { $in: codigos } });
    if (productosBD.length !== req.body.productos.length) {
      return res.status(400).json({ error: 'Uno o más códigos de productos no existen' });
    }

    const nuevoPedido = new Pedido(req.body);
    await nuevoPedido.save();
    res.json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

export const obtenerPedidos = async (req, res) => {
  const pedidos = await Pedido.find();
  res.json(pedidos);
};

export const eliminarPedido = async (req, res) => {
  await Pedido.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Pedido eliminado' });
};

export const actualizarPedido = async (req, res) => {
  await Pedido.findByIdAndUpdate(req.params.id, req.body);
  res.json({ mensaje: 'Pedido actualizado' });
};
