import mongoose from 'mongoose';
import { Sala } from '../../model/mongoose.js'; 
export async function criarSalas() {

  const salasExistentes = await Sala.countDocuments();
  if (salasExistentes > 0) {
    console.log('Salas já existem, abortando inserção.');
    return process.exit(0);
  }

  const salas = [
    { nome: 'Sala Normal 1', tipo: 'normal', capacidade: 10, recursos: ['TV'], imagem: 'basic/basic1.png' },
    { nome: 'Sala Normal 2', tipo: 'normal', capacidade: 8, recursos: ['Projetor'], imagem: 'basic/basic2.png' },
    { nome: 'Sala Normal 3', tipo: 'normal', capacidade: 12, recursos: ['Quadro branco'], imagem: 'basic/basic3.png' },
    { nome: 'Sala Normal 4', tipo: 'normal', capacidade: 6, recursos: [], imagem: 'basic/basic4.png' },
    { nome: 'Sala Normal 5', tipo: 'normal', capacidade: 15, recursos: ['TV', 'Projetor'], imagem: 'basic/basic1.png' },

    { nome: 'Sala Premium 1', tipo: 'premium', capacidade: 20, recursos: ['TV', 'Projetor', 'Ar condicionado'], imagem: 'premuim/premuim1.png' },
    { nome: 'Sala Premium 2', tipo: 'premium', capacidade: 18, recursos: ['TV', 'Ar condicionado'], imagem: 'premuim/premium2.png' },
    { nome: 'Sala Premium 3', tipo: 'premium', capacidade: 25, recursos: ['Projetor', 'Som'], imagem: 'premuim/premuim3.png' },
    { nome: 'Sala Premium 4', tipo: 'premium', capacidade: 22, recursos: ['TV', 'Som', 'Ar condicionado'], imagem: 'premuim/premium4.png' },
    { nome: 'Sala Premium 5', tipo: 'premium', capacidade: 30, recursos: ['TV', 'Projetor', 'Som', 'Ar condicionado'], imagem: 'premuim/premuim1.png' },
  ];

  await Sala.insertMany(salas);
  console.log('Salas criadas com sucesso!');
}

