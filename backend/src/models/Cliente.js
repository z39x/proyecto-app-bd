import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  identificadorCli: { type: String, unique: true, required: true },
  nombre: String,
  apellidos: String,
  direccion: {
    calle: String,
    numero: Number,
    ciudad: String
  },
  fechaRegistro: String
});

export default mongoose.model('Cliente', ClienteSchema);
