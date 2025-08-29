import express from 'express';
import { 
  showLogin, 
  showRegister, 
  login, 
  register, 
  logout 
} from '../controllers/authController.js';
import { redirectIfAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas de exibição (apenas para usuários não logados)
router.get('/login', redirectIfAuth, showLogin);
router.get('/register', redirectIfAuth, showRegister);

// Rotas de ação
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

export default router;
