const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { nome, sobrenome, senha } = req.body;

    if (!nome || !sobrenome || !senha) {
        return res.status(400).json({ message: 'Preencha todos os campos!' });
    }

    try {
        const userExists = await User.findOne({ nome, sobrenome });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já cadastrado!' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const newUser = new User({
            nome,
            sobrenome,
            senha: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor!' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-senha');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor!' });
    }
};

const loginUser = async (req, res) => {
  const { nome, senha } = req.body;

  try {
    const user = await User.findOne({ nome });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado!' });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha incorreta!' });
    }
    
    // --- INÍCIO DA CORREÇÃO ---

    // 1. Criamos um objeto com os dados do usuário que queremos enviar para o App.
    //    É importante não enviar a senha de volta.
    const userData = {
      _id: user._id,
      nome: user.nome,
      sobrenome: user.sobrenome
    };

    // 2. Enviamos a mensagem de sucesso E o objeto com os dados do usuário.
    //    Agora a resposta corresponde ao que a LoginScreen espera!
    res.status(200).json({ message: 'Login bem-sucedido!', user: userData });

    // --- FIM DA CORREÇÃO ---

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor!' });
  }
};

module.exports = { registerUser, getAllUsers, loginUser };