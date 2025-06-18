// userRoutes.js (Corrigido)

const express = require('express');
const router = express.Router();

// Importando todos os controllers de uma vez
const { 
    registerUser, 
    loginUser, 
    getAllUsers 
} = require('../controllers/userController');

// Rota para registrar um novo usuário
router.post('/register', registerUser);

// Rota para fazer login
router.post('/login', loginUser);

// Rota para listar todos os usuários
// Eu renomeei a rota de '/' para '/listar-todos' para ser mais claro
router.get('/listar-todos', getAllUsers); 

module.exports = router;