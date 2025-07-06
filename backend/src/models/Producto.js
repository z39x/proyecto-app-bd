import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  codProducto: { type: Number, unique: true, required: true },
  nombre: String,
  precio: Number,
  stock: Number,
  estado: String
});

export default mongoose.model('Producto', ProductoSchema);