const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    senha: { type: String, required: true },
    // NOVO CAMPO ADICIONADO
    fotoPerfil: { 
      type: String, 
      default: '' // Começa como uma string vazia
    }
});

module.exports = mongoose.model('User', userSchema);