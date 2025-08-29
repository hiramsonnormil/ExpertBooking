import { Room } from '../models/Room.js';
import { Booking } from '../models/Booking.js';
import { timerService } from '../services/timerService.js';

export const showRooms = async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    
    // Adicionar tempo restante para salas ocupadas
    const roomsWithTimer = await Promise.all(rooms.map(async (room) => {
      if (room.status === 'occupied' && room.currentBooking?.endTime) {
        const timeRemaining = await timerService.getTimeRemaining(room._id);
        room.timeRemaining = timeRemaining;
        room.timeRemainingFormatted = formatTime(timeRemaining);
      }
      return room;
    }));

    res.render('rooms/list', {
      title: 'Salas Disponíveis - ExpertBooking',
      rooms: roomsWithTimer,
      user: {
        name: req.session.userName,
        email: req.session.userEmail
      }
    });
  } catch (error) {
    console.error('Erro ao listar salas:', error);
    res.status(500).render('layouts/error', {
      title: 'Erro',
      error: 'Não foi possível carregar as salas'
    });
  }
};

export const showRoomDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).lean();
    
    if (!room) {
      return res.status(404).render('layouts/error', {
        title: 'Sala não encontrada',
        error: 'A sala solicitada não existe'
      });
    }

    // Adicionar tempo restante se ocupada
    if (room.status === 'occupied' && room.currentBooking?.endTime) {
      const timeRemaining = await timerService.getTimeRemaining(room._id);
      room.timeRemaining = timeRemaining;
      room.timeRemainingFormatted = formatTime(timeRemaining);
    }

    const error = req.query.error || null;
    const success = req.query.success || null;

    res.render('rooms/details', {
      title: `${room.name} - ExpertBooking`,
      room,
      error,
      success,
      user: {
        name: req.session.userName,
        email: req.session.userEmail
      }
    });
  } catch (error) {
    console.error('Erro ao buscar sala:', error);
    res.status(500).render('layouts/error', {
      title: 'Erro',
      error: 'Não foi possível carregar os detalhes da sala'
    });
  }
};

export const showBookingForm = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).lean();
    
    if (!room) {
      return res.status(404).render('layouts/error', {
        title: 'Sala não encontrada',
        error: 'A sala solicitada não existe'
      });
    }

    if (room.status === 'occupied') {
      return res.redirect(`/rooms/${id}?error=Sala está ocupada no momento`);
    }

    res.render('rooms/booking', {
      title: `Reservar ${room.name} - ExpertBooking`,
      room,
      user: {
        name: req.session.userName,
        email: req.session.userEmail
      }
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de reserva:', error);
    res.status(500).render('layouts/error', {
      title: 'Erro',
      error: 'Não foi possível carregar o formulário de reserva'
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, duration } = req.body;
    const userId = req.session.userId;

    // Validações
    const durationNum = parseInt(duration);
    if (durationNum < 1 || durationNum > 12) {
      return res.redirect(`/rooms/${id}/book?error=Duração deve ser entre 1 e 12 horas`);
    }

    // Criar datas de início e fim
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + (durationNum * 60 * 60 * 1000));
    const now = new Date();

    // Validar se não é data/hora passada
    if (startDateTime <= now) {
      return res.redirect(`/rooms/${id}/book?error=Não é possível reservar para datas passadas`);
    }

    // Buscar e validar sala
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).render('layouts/error', {
        title: 'Sala não encontrada',
        error: 'A sala solicitada não existe'
      });
    }

    if (room.status === 'occupied') {
      return res.redirect(`/rooms/${id}/book?error=Sala já está ocupada`);
    }
    
    if(room.type === "premium"){
      // Armazenar dados seguros na sessão para salas premium
      req.session.pendingBooking = {
        roomId: id,
        date,
        startTime,
        duration: durationNum,
        startDateTime,
        endDateTime,
        userId,
        timestamp: Date.now()
      };
      
      return res.redirect('/payment');
    }
    
    // Criar reserva
    const booking = new Booking({
      userId,
      roomId: id,
      startTime: startDateTime,
      endTime: endDateTime,
      status: 'active'
    });

    await booking.save();

    // Atualizar sala
    room.status = 'occupied';
    room.currentBooking = {
      userId,
      startTime: startDateTime,
      endTime: endDateTime,
      duration: durationNum
    };

    await room.save();

    // Iniciar timer
    await timerService.startTimer(id, endDateTime);

    res.redirect(`/rooms/${id}?success=Sala reservada com sucesso!`);

  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.redirect(`/rooms/${req.params.id}/book?error=Erro interno do servidor`);
  }
};



export const getRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).lean();
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    let response = {
      status: room.status,
      name: room.name
    };

    if (room.status === 'occupied' && room.currentBooking?.endTime) {
      const timeRemaining = await timerService.getTimeRemaining(id);
      response.timeRemaining = timeRemaining;
      response.timeRemainingFormatted = formatTime(timeRemaining);
    }

    res.json(response);

  } catch (error) {
    console.error('Erro ao buscar status da sala:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Função auxiliar para formatar tempo
const formatTime = (milliseconds) => {
  if (milliseconds <= 0) return '00:00:00';
  
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
