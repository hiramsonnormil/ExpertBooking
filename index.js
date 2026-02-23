import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';

import { login } from './controller/authController.js';
import { cadastrarUsuario } from './controller/signupController.js';
import { autenticar } from './middlewares/routeProtection.js';
import * as salaController from './controller/salaController.js';


dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 horas
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
}));

app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/view'));

app.get('/', (req, res) => res.render('login'));
app.get('/create', (req, res) => res.render('cadastro'));

app.post('/login', login);
app.post('/signup', cadastrarUsuario);

app.get('/salas',autenticar, salaController.listarSalas);
app.get('/salas/:id',autenticar, salaController.detalheSala);
app.post('/salas/:id/reservar',autenticar, salaController.reservarSala);



app.listen(3000, () => console.log(" Servidor rodando na porta 3000"));
