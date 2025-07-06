import Cliente from '../models/Cliente.js';

export const crearCliente = async (req, res) => {
  try {
    const existe = await Cliente.findOne({ identificadorCli: req.body.identificadorCli });
    if (existe) return res.status(400).json({ error: 'Este identificador no es único' });
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

export const obtenerClientes = async (req, res) => {
  const clientes = await Cliente.find();
  res.json(clientes);
};

export const eliminarCliente = async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Cliente eliminado' });
};

export const actualizarCliente = async (req, res) => {
  await Cliente.findByIdAndUpdate(req.params.id, req.body);
  res.json({ mensaje: 'Cliente actualizado' });
};