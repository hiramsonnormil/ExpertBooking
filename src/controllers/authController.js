import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

export const showLogin = (req, res) => {
  const error = req.query.error || null;
  res.render('auth/login', { 
    title: 'Login - ExpertBooking',
    error 
  });
};

export const showRegister = (req, res) => {
  const error = req.query.error || null;
  res.render('auth/register', { 
    title: 'Cadastrar - ExpertBooking',
    error 
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos obrigatórios
    if (!email || !password) {
      return res.redirect('/auth/login?error=Preencha todos os campos');
    }

    // Buscar usuário no banco
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.redirect('/auth/login?error=Email ou senha incorretos');
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.redirect('/auth/login?error=Email ou senha incorretos');
    }

    // Criar sessão
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;

    // Redirecionar para as salas
    res.redirect('/rooms');

  } catch (error) {
    console.error('Erro no login:', error);
    res.redirect('/auth/login?error=Erro interno do servidor');
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validar campos obrigatórios
    if (!name || !email || !password || !confirmPassword) {
      return res.redirect('/auth/register?error=Preencha todos os campos');
    }

    // Validar se as senhas coincidem
    if (password !== confirmPassword) {
      return res.redirect('/auth/register?error=As senhas não coincidem');
    }

    // Validar força da senha
    if (password.length < 6) {
      return res.redirect('/auth/register?error=A senha deve ter pelo menos 6 caracteres');
    }

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.redirect('/auth/register?error=Este email já está cadastrado');
    }

    // Criptografar senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar novo usuário
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash
    });

    await newUser.save();

    // Criar sessão
    req.session.userId = newUser._id;
    req.session.userName = newUser.name;
    req.session.userEmail = newUser.email;

    // Redirecionar para as salas
    res.redirect('/rooms');

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.redirect('/auth/register?error=Erro interno do servidor');
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.redirect('/rooms');
    }
    res.redirect('/');
  });
};
