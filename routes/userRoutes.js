const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinaryConfig'); // Assumindo que você criou este arquivo

// Importando todos os controllers de uma vez
const { 
    registerUser, 
    loginUser, 
    getAllUsers,
    updateUserProfilePic // Importando a nova função
} = require('../controllers/userController');

// Rota para registrar um novo usuário
router.post('/register', registerUser);

// Rota para fazer login
router.post('/login', loginUser);

// Rota para listar todos os usuários
router.get('/listar-todos', getAllUsers); 

// --- NOVA ROTA ADICIONADA ---
// O 'upload.single('foto')' é o middleware que processa o arquivo
router.post('/upload-foto/:userId', upload.single('foto'), updateUserProfilePic);
// --- FIM DA NOVA ROTA ---

module.exports = router;