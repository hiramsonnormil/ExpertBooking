import { Room } from '../models/Room.js';
import { Booking } from '../models/Booking.js';
import { timerService } from '../services/timerService.js';

export const showPaymentPage = async (req, res) => {
    try {
        if (!req.session.pendingBooking) {
            return res.redirect('/rooms?error=Nenhuma reserva pendente encontrada');
        }

        const bookingData = req.session.pendingBooking;
        
        const now = Date.now();
        const maxAge = 10 * 60 * 1000;
        if (now - bookingData.timestamp > maxAge) {
            delete req.session.pendingBooking;
            return res.redirect('/rooms?error=Sessão de reserva expirada. Tente novamente');
        }

        const room = await Room.findById(bookingData.roomId);
        if (!room) {
            delete req.session.pendingBooking;
            return res.redirect('/rooms?error=Sala não encontrada');
        }

        if (room.type !== 'premium') {
            delete req.session.pendingBooking;
            return res.redirect(`/rooms/${bookingData.roomId}/book?error=Esta sala não requer pagamento`);
        }

        if (room.status === 'occupied') {
            delete req.session.pendingBooking;
            return res.redirect(`/rooms/${bookingData.roomId}?error=Sala já está ocupada`);
        }

        if (bookingData.startDateTime <= new Date()) {
            delete req.session.pendingBooking;
            return res.redirect(`/rooms/${bookingData.roomId}/book?error=Horário selecionado já passou. Selecione um novo horário`);
        }

        const conflictingBooking = await Booking.findOne({
            roomId: bookingData.roomId,
            status: 'active',
            $or: [
                { startTime: { $lt: bookingData.endDateTime }, endTime: { $gt: bookingData.startDateTime } }
            ]
        });

        if (conflictingBooking) {
            delete req.session.pendingBooking;
            return res.redirect(`/rooms/${bookingData.roomId}/book?error=Horário não disponível - conflito com outra reserva`);
        }

        const basePrice = 50;
        const hourlyPrice = 30;
        const totalPrice = basePrice + (bookingData.duration * hourlyPrice);

        res.render('rooms/payment', {
            title: 'Pagamento - ExpertBooking',
            room,
            bookingData: {
                roomId: bookingData.roomId,
                date: bookingData.date,
                startTime: bookingData.startTime,
                duration: bookingData.duration,
                startDateTime: bookingData.startDateTime.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                endDateTime: bookingData.endDateTime.toLocaleString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                totalPrice
            },
            user: {
                name: req.session.userName,
                email: req.session.userEmail
            }
        });
    } catch (error) {
        console.error('Erro ao exibir página de pagamento:', error);
        delete req.session.pendingBooking;
        res.redirect('/rooms?error=Erro interno do servidor');
    }
};

export const processPayment = async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        
        if (!req.session.pendingBooking) {
            return res.redirect('/rooms?error=Nenhuma reserva pendente encontrada');
        }

        if (!paymentMethod) {
            return res.redirect('/payment?error=Método de pagamento não selecionado');
        }

        const validPaymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.redirect('/payment?error=Método de pagamento inválido');
        }

        const bookingData = req.session.pendingBooking;
        const userId = req.session.userId;

        const now = Date.now();
        const maxAge = 10 * 60 * 1000;
        if (now - bookingData.timestamp > maxAge) {
            delete req.session.pendingBooking;
            return res.redirect('/rooms?error=Sessão de reserva expirada. Tente novamente');
        }

        const room = await Room.findById(bookingData.roomId);
        if (!room || room.status === 'occupied') {
            delete req.session.pendingBooking;
            return res.redirect('/rooms?error=Sala não está mais disponível');
        }

        const conflictingBooking = await Booking.findOne({
            roomId: bookingData.roomId,
            status: 'active',
            $or: [
                { startTime: { $lt: bookingData.endDateTime }, endTime: { $gt: bookingData.startDateTime } }
            ]
        });

        if (conflictingBooking) {
            delete req.session.pendingBooking;
            return res.redirect('/rooms?error=Horário não disponível - conflito detectado');
        }

        console.log(`Processando pagamento ${paymentMethod} para sala ${room.name}`);
        
        const booking = new Booking({
            userId,
            roomId: bookingData.roomId,
            startTime: bookingData.startDateTime,
            endTime: bookingData.endDateTime,
            status: 'active'
        });

        await booking.save();

        room.status = 'occupied';
        room.currentBooking = {
            userId,
            startTime: bookingData.startDateTime,
            endTime: bookingData.endDateTime,
            duration: bookingData.duration
        };

        await room.save();

        await timerService.startTimer(bookingData.roomId, bookingData.endDateTime);
        
        delete req.session.pendingBooking;
        
        res.redirect(`/rooms/${bookingData.roomId}?success=Pagamento processado e sala reservada com sucesso!`);
        
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        delete req.session.pendingBooking;
        res.redirect('/payment?error=Erro ao processar pagamento');
    }
};
