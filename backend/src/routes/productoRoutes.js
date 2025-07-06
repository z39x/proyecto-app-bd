import express from 'express';
import {
  crearProducto,
  obtenerProductos,
  eliminarProducto,
  actualizarProducto
} from '../controllers/productoController.js';

const router = express.Router();

router.get('/', obtenerProductos);
router.post('/', crearProducto);
router.delete('/:id', eliminarProducto);
router.put('/:id', actualizarProducto);

export default router;
