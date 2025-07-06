import express from 'express';
import {
  crearCliente,
  obtenerClientes,
  eliminarCliente,
  actualizarCliente
} from '../controllers/clienteController.js';

const router = express.Router();

router.get('/', obtenerClientes);
router.post('/', crearCliente);
router.delete('/:id', eliminarCliente);
router.put('/:id', actualizarCliente);

export default router;
