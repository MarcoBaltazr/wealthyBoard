const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Gerar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret-key-temporaria-mude-isso',
    { expiresIn: '30d' }
  );
};

// POST /api/auth/register - Criar nova conta
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar campos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Verificar se email já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    // Criar usuário
    const user = new User({ name, email, password });
    await user.save();

    // Gerar token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Conta criada com sucesso!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    if (error.name === 'ValidationError') {
      // Extrair mensagens de validação do Mongoose
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Este email já está cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao criar conta.' });
  }
});

// POST /api/auth/login - Fazer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    // Buscar usuário (incluindo senha)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }

    // Gerar token
    const token = generateToken(user._id);

    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
});

// GET /api/auth/me - Obter dados do usuário logado
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do usuário.' });
  }
});

module.exports = router;
