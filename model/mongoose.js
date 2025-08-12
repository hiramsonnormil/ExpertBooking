import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true },
  data_criacao: { type: Date, default: Date.now },
  salas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sala' }],
});

const SalaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['normal', 'premium'], required: true },
  capacidade: { type: Number, required: true },
  recursos: [String],
  imagem: { type: String }, 
  status: { type: String, enum: ['livre', 'ocupado'], default: 'livre' },
  agendamentos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agendamento' }],
});


const AgendamentoSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  sala_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true },
  inicio: { type: Date, required: true },
  fim: { type: Date, required: true },
  status: { type: String, default: 'ativo' },
});

export const Usuario = mongoose.model('Usuario', UsuarioSchema);
export const Sala = mongoose.model('Sala', SalaSchema);
export const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);
