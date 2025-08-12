import bcrypt from "bcrypt";
import { Usuario } from "../model/mongoose.js";

export async function cadastrarUsuario(req, res) {
  try {
    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || password !== confirmpassword) {
      return res.status(400).send('Todos os campos são obrigatórios e as senhas devem coincidir');
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).send('Email já cadastrado');
    }

    const saltRounds = 10;
    const senha_hash = await bcrypt.hash(password, saltRounds);

    const novoUsuario = new Usuario({
      nome: name,
      email,
      senha_hash,
    });

    await novoUsuario.save();
    return res.redirect('/');

  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro no cadastro');
  }
}
