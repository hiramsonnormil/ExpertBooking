import app from './src/app.js';
import { timerService } from './src/services/timerService.js';

const PORT = process.env.PORT || 3000;

// Inicializar serviços
timerService.initialize();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});
