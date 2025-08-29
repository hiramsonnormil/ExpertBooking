import { connectDatabase } from '../models/database.js';
import { Room } from '../models/Room.js';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

async function seedDatabase() {
  try {
    await connectDatabase();
    
    console.log('🌱 Iniciando população do banco de dados...');

    // Limpar dados existentes
    await Room.deleteMany({});
    await User.deleteMany({});

    // Criar usuário de exemplo
    const passwordHash = await bcrypt.hash('123456', 12);
    const exampleUser = new User({
      name: 'Usuário Exemplo',
      email: 'user@example.com',
      passwordHash
    });
    await exampleUser.save();

    // Criar salas de exemplo
    const rooms = [
      {
        name: 'Sala Alpha',
        type: 'basic',
        capacity: 4,
        features: ['Projetor', 'Quadro branco'],
        image: 'basic1.png'
      },
      {
        name: 'Sala Beta',
        type: 'basic',
        capacity: 6,
        features: ['TV LED', 'Mesa de reunião'],
        image: 'basic2.png'
      },
      {
        name: 'Sala Gamma',
        type: 'premium',
        capacity: 8,
        features: ['Projetor 4K', 'Sistema de som', 'Ar condicionado', 'Mesa executiva'],
        image: 'premium1.png'
      },
      {
        name: 'Sala Delta',
        type: 'premium',
        capacity: 12,
        features: ['Videoconferência', 'Projetor', 'Sistema de som premium', 'Cadeiras executivas'],
        image: 'premium2.png'
      },
      {
        name: 'Sala Epsilon',
        type: 'basic',
        capacity: 3,
        features: ['Mesa pequena', 'Cadeiras confortáveis'],
        image: 'basic3.png'
      },
      {
        name: 'Sala Omega',
        type: 'premium',
        capacity: 20,
        features: ['Auditório', 'Projetor duplo', 'Sistema de microfone', 'Palco'],
        image: 'premium3.png'
      }
    ];

    await Room.insertMany(rooms);

    console.log('✅ Banco de dados populado com sucesso!');
    console.log('👤 Usuário criado: user@example.com / senha: 123456');
    console.log(`🏢 ${rooms.length} salas criadas`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
}

seedDatabase();
