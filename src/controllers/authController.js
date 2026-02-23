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

    if (!email || !password) {
      return res.redirect('/auth/login?error=Preencha todos os campos');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.redirect('/auth/login?error=Email ou senha incorretos');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.redirect('/auth/login?error=Email ou senha incorretos');
    }

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;

    res.redirect('/rooms');

  } catch (error) {
    console.error('Erro no login:', error);
    res.redirect('/auth/login?error=Erro interno do servidor');
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.redirect('/auth/register?error=Preencha todos os campos');
    }

    if (password !== confirmPassword) {
      return res.redirect('/auth/register?error=As senhas não coincidem');
    }

    if (password.length < 6) {
      return res.redirect('/auth/register?error=A senha deve ter pelo menos 6 caracteres');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.redirect('/auth/register?error=Este email já está cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash
    });

    await newUser.save();

    req.session.userId = newUser._id;
    req.session.userName = newUser.name;
    req.session.userEmail = newUser.email;

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
