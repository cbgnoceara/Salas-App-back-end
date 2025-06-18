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
    
    // Agora a resposta do login também inclui o campo da foto de perfil
    const userData = {
      _id: user._id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      fotoPerfil: user.fotoPerfil // Incluído aqui
    };

    res.status(200).json({ message: 'Login bem-sucedido!', user: userData });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor!' });
  }
};


// --- NOVA FUNÇÃO ADICIONADA ---
const updateUserProfilePic = async (req, res) => {
  try {
    const { userId } = req.params;
    // O 'req.file' é disponibilizado pelo Multer e contém os dados do upload no Cloudinary
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const fotoUrl = req.file.path; // URL segura fornecida pelo Cloudinary

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fotoPerfil: fotoUrl },
      { new: true } // Retorna o documento atualizado
    ).select('-senha'); // Não envia a senha de volta

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Foto de perfil atualizada!', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    res.status(500).json({ message: 'Erro no servidor!' });
  }
};
// --- FIM DA NOVA FUNÇÃO ---


module.exports = { 
  registerUser, 
  getAllUsers, 
  loginUser,
  updateUserProfilePic // Exportando a nova função
};