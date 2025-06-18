// reservaModel.js (Corrigido)

const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  sala: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  // O campo 'horario' foi substituído pelos dois campos abaixo
  horarioInicio: {
    type: String,
    required: true,
  },
  horarioFim: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  usuarioNome: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Reserva', reservaSchema);