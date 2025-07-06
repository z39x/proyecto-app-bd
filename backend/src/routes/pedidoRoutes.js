import express from 'express';
import {
  crearPedido,
  obtenerPedidos,
  eliminarPedido,
  actualizarPedido
} from '../controllers/pedidoController.js';

const router = express.Router();

router.get('/', obtenerPedidos);
router.post('/', crearPedido);
router.delete('/:id', eliminarPedido);
router.put('/:id', actualizarPedido);

export default router;
