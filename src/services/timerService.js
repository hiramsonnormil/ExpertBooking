import { Room } from '../models/Room.js';
import { Booking } from '../models/Booking.js';

class TimerService {
  constructor() {
    this.timers = new Map();
  }

  initialize() {
    // Verificar salas ocupadas ao iniciar o servidor
    this.checkExpiredRooms();
    
    // Configurar verificação automática a cada minuto
    setInterval(() => {
      this.checkExpiredRooms();
    }, 60000); // 1 minuto

    console.log('Serviço de timer inicializado');
  }

  async checkExpiredRooms() {
    try {
      const now = new Date();
      const expiredRooms = await Room.find({
        status: 'occupied',
        'currentBooking.endTime': { $lte: now }
      });

      for (const room of expiredRooms) {
        await this.releaseRoom(room._id);
        console.log(`Sala ${room.name} liberada automaticamente às ${now.toLocaleString('pt-BR')}`);
      }
    } catch (error) {
      console.error('Erro na verificação automática de salas:', error);
    }
  }

  async startTimer(roomId, endTime) {
    const now = new Date();
    const timeRemaining = endTime.getTime() - now.getTime();

    if (timeRemaining > 0) {
      // Cancelar timer anterior se existir
      this.stopTimer(roomId);

      // Criar novo timer
      const timeout = setTimeout(async () => {
        await this.releaseRoom(roomId);
        this.timers.delete(roomId.toString());
      }, timeRemaining);

      this.timers.set(roomId.toString(), timeout);
      console.log(`Timer iniciado para sala ${roomId}, será liberada em ${Math.round(timeRemaining / 60000)} minutos`);
    }
  }

  stopTimer(roomId) {
    const timer = this.timers.get(roomId.toString());
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(roomId.toString());
      console.log(`Timer cancelado para sala ${roomId}`);
    }
  }

  async releaseRoom(roomId) {
    try {
      const room = await Room.findById(roomId);
      if (!room || room.status !== 'occupied') {
        return;
      }

      // Marcar booking como concluído
      if (room.currentBooking?.userId) {
        await Booking.findOneAndUpdate(
          {
            userId: room.currentBooking.userId,
            roomId: roomId,
            status: 'active'
          },
          { status: 'completed' }
        );
      }

      // Liberar sala
      room.status = 'available';
      room.currentBooking = null;
      await room.save();

      // Remover timer
      this.stopTimer(roomId);

      console.log(`Sala ${room.name} liberada com sucesso`);

    } catch (error) {
      console.error('Erro ao liberar sala:', error);
    }
  }

  async getTimeRemaining(roomId) {
    try {
      const room = await Room.findById(roomId);
      if (room && room.status === 'occupied' && room.currentBooking?.endTime) {
        const now = new Date();
        const timeRemaining = room.currentBooking.endTime.getTime() - now.getTime();
        return Math.max(0, timeRemaining);
      }
      return 0;
    } catch (error) {
      console.error('Erro ao obter tempo restante:', error);
      return 0;
    }
  }

  // Método para reiniciar timers após restart do servidor
  async restoreTimers() {
    try {
      const occupiedRooms = await Room.find({
        status: 'occupied',
        'currentBooking.endTime': { $exists: true }
      });

      for (const room of occupiedRooms) {
        if (room.currentBooking.endTime) {
          await this.startTimer(room._id, room.currentBooking.endTime);
        }
      }

      console.log(`${occupiedRooms.length} timers restaurados`);
    } catch (error) {
      console.error('Erro ao restaurar timers:', error);
    }
  }
}

export const timerService = new TimerService();
