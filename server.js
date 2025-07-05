const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // <= ADICIONADO
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.log('❌ Erro no MongoDB:', err));

// --- Rota de Ping para manter o serviço ativo ---
app.get('/ping', (req, res) => {
  console.log(`PING recebido em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  res.status(200).json({ message: 'pong' });
});
// ---------------------------------------------

// Rotas Principais
app.use('/api/users', userRoutes);
app.use('/api/reservas', reservaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);

  // --- Auto-ping a cada 5 minutos ---
  const SELF_URL = `https://salas-app-back-end.onrender.com/ping`; // 🔁 Substitua pela sua URL pública
  setInterval(() => {
    axios.get(SELF_URL)
      .then(() => {
        console.log(`[AUTO-PING] Ping enviado para ${SELF_URL}`);
      })
      .catch((err) => {
        console.error(`[AUTO-PING] Erro: ${err.message}`);
      });
  }, 5 * 60 * 1000); // 5 minutos em milissegundos
});
