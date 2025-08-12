import { Sala } from '../model/mongoose.js';

export const listarSalas = async (req, res) => {
  try {
    const salas = await Sala.find();
    res.render('salas', { salas });
  } catch (err) {
    res.status(500).send('Erro ao buscar salas');
  }
};

export const detalheSala = async (req, res) => {
  try {
    const sala = await Sala.findById(req.params.id);
    if (!sala) return res.status(404).send('Sala não encontrada');
    res.render('detalheSala', { sala });
  } catch (err) {
    res.status(500).send('Erro ao buscar sala');
  }
};

export const reservarSala = async (req, res) => {
  try {
    const sala = await Sala.findById(req.params.id);
    if (!sala) return res.status(404).send('Sala não encontrada');

    if (sala.status === 'ocupado') {
      return res.send('Sala já está ocupada');
    }

    sala.status = 'ocupado';
    await sala.save();

    res.redirect(`/salas/${sala._id}`);
  } catch (err) {
    res.status(500).send('Erro ao reservar sala');
  }
};
