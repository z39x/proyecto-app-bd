import Producto from '../models/Producto.js';

export const crearProducto = async (req, res) => {
  try {
    const existe = await Producto.findOne({ codProducto: req.body.codProducto });
    if (existe) return res.status(400).json({ error: 'Este identificador no es único' });
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

export const obtenerProductos = async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
};

export const eliminarProducto = async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Producto eliminado' });
};

export const actualizarProducto = async (req, res) => {
  await Producto.findByIdAndUpdate(req.params.id, req.body);
  res.json({ mensaje: 'Producto actualizado' });
};