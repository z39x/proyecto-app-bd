import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import clienteRoutes from './routes/clienteRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
