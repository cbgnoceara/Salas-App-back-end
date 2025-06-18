const Reserva = require('../models/reservaModel');

// A única função que precisou de alteração foi a criarReserva
const criarReserva = async (req, res) => {
  try {
    const { sala, data, horarioInicio, horarioFim, descricao, usuarioId, usuarioNome } = req.body;

    // --- INÍCIO DA LÓGICA DE VERIFICAÇÃO DE CONFLITO ---

    // 1. Busca no banco todas as reservas para a mesma sala e na mesma data.
    const reservasExistentes = await Reserva.find({ sala, data });

    // 2. Verifica se a nova reserva (horarioInicio, horarioFim) se sobrepõe a alguma reserva existente.
    const temConflito = reservasExistentes.some(reservaExistente => {
      // A condição de sobreposição é:
      // O novo horário começa ANTES do fim do existente E o novo horário termina DEPOIS do início do existente.
      return (
        horarioInicio < reservaExistente.horarioFim &&
        horarioFim > reservaExistente.horarioInicio
      );
    });

    // 3. Se encontrou um conflito, retorna um erro específico (409 Conflict) e interrompe a execução.
    if (temConflito) {
      return res.status(409).json({ message: 'Conflito de horário! A sala já está reservada neste período.' });
    }

    // --- FIM DA LÓGICA DE CONFLITO ---


    // Se não houver conflito, o código continua e cria a nova reserva.
    const novaReserva = new Reserva({
      sala,
      data,
      horarioInicio,
      horarioFim,
      descricao,
      usuarioId,
      usuarioNome,
    });

    await novaReserva.save();
    res.status(201).json(novaReserva);
  } catch (error) {
    console.error('ERRO INTERNO AO CRIAR RESERVA:', error); 
    res.status(500).json({ error: 'Erro ao criar reserva' });
  }
};


// As funções abaixo já estavam corretas e não precisam de alteração.
const listarReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
};

const listarMinhasReservas = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const reservas = await Reserva.find({ usuarioId });
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar suas reservas' });
  }
};

const deletarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    if (reserva.usuarioId.toString() !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar esta reserva' });
    }

    await Reserva.findByIdAndDelete(id);
    res.status(200).json({ message: 'Reserva deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar reserva' });
  }
};

module.exports = {
  criarReserva,
  listarReservas,
  listarMinhasReservas,
  deletarReserva,
};