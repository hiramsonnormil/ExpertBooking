import express from 'express';
import {
  showRooms,
  showRoomDetails,
  showBookingForm,
  createBooking,
  getRoomStatus
} from '../controllers/roomController.js';
import { processPayment } from '../controllers/paymentControler.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas de salas requerem autenticação
router.use(requireAuth);

// Rotas das salas
router.get('/', showRooms);
router.get('/:id', showRoomDetails);
router.get('/:id/book', showBookingForm);

// Rotas de ação
router.post('/:id/book', createBooking);
router.post('/process-payment', processPayment);

// API routes
router.get('/:id/status', getRoomStatus);

export default router;
