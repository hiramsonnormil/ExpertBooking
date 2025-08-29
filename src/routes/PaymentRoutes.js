import express from "express";
import { showPaymentPage, processPayment } from "../controllers/paymentControler.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas as rotas de pagamento requerem autenticação
router.use(requireAuth);

// Rotas de pagamento
router.get('/', showPaymentPage);
router.post('/process', processPayment);

export default router;