const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
  // ADICIONADO: Log para confirmar o recebimento do ping no terminal
  console.log(`PING recebido em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  
  // A resposta para o serviço de ping continua a mesma
  res.status(200).json({ message: 'pong' });
});
// ---------------------------------------------

// Rotas Principais
app.use('/api/users', userRoutes);
app.use('/api/reservas', reservaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
