import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import dotenv from 'dotenv';

import { connectDatabase } from './models/database.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import PaymentRoutes from './routes/PaymentRoutes.js'


// Configurações iniciais
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Conectar ao banco de dados
connectDatabase();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'expert-booking-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/payment',PaymentRoutes)

// Middleware de tratamento de erro 404
app.use((req, res) => {
  res.status(404).render('layouts/error', { 
    title: 'Página não encontrada',
    error: 'A página que você procura não existe.'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('layouts/error', {
    title: 'Erro interno',
    error: 'Algo deu errado. Tente novamente mais tarde.'
  });
});

export default app;
