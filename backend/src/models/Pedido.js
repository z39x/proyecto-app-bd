import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  codigoPedido: { type: String, unique: true, required: true },
  codigoCliente: String,
  fechaPedido: String,
  productos: [
    {
      codProducto: Number,
      nombre: String,
      cantidad: Number,
      precioUnitario: Number,
      totalComprado: Number
    }
  ],
  totalCompra: Number,
  metodoPago: String
});

export default mongoose.model('Pedido', PedidoSchema);