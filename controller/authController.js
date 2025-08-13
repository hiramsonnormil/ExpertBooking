import bcrypt from 'bcrypt';
import { Usuario } from '../model/mongoose.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email e senha são obrigatórios");
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado");
    }

    const senhaValida = await bcrypt.compare(password, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).send("Senha incorreta");
    }
    req.session.usuario = {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email
    };
    return res.redirect('/salas');

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
}
