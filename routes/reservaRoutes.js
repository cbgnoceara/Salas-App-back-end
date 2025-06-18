const express = require('express');
const router = express.Router();

const {
  criarReserva,
  listarReservas,
  listarMinhasReservas,
  deletarReserva,
} = require('../controllers/reservaController');

// Criar reserva
router.post('/criar', criarReserva);

// Listar todas as reservas
router.get('/listar', listarReservas);

// Listar minhas reservas
router.get('/minhas/:usuarioId', listarMinhasReservas);

// Deletar reserva (somente dono)
router.delete('/deletar/:id', deletarReserva);

module.exports = router;
