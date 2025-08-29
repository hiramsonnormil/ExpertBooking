# ExpertBooking

Sistema simples e organizado para reserva de salas, desenvolvido com Node.js e EJS.

## 📁 Estrutura do Projeto

```
ExpertBooking/
├── server.js                 # Arquivo principal do servidor
├── package.json              # Dependências e scripts
├── .env.example              # Exemplo de variáveis de ambiente
├── public/                   # Arquivos estáticos
│   ├── css/
│   │   └── main.css         # Estilos principais
│   ├── js/                  # Scripts do frontend
│   └── img/                 # Imagens
└── src/                     # Código fonte da aplicação
    ├── app.js              # Configuração principal do Express
    ├── controllers/         # Controladores (lógica de negócio)
    │   ├── authController.js    # Autenticação e registro
    │   ├── roomController.js    # Gestão de salas
    │   └── homeController.js    # Página inicial
    ├── models/             # Modelos do banco de dados
    │   ├── database.js         # Conexão com MongoDB
    │   ├── User.js            # Modelo de usuário
    │   ├── Room.js            # Modelo de sala
    │   └── Booking.js         # Modelo de reserva
    ├── routes/             # Definição de rotas
    │   ├── authRoutes.js       # Rotas de autenticação
    │   ├── roomRoutes.js       # Rotas de salas
    │   └── homeRoutes.js       # Rotas da home
    ├── middlewares/        # Middlewares personalizados
    │   └── authMiddleware.js   # Proteção de rotas
    ├── services/           # Serviços da aplicação
    │   └── timerService.js     # Serviço de cronômetro
    ├── views/              # Templates EJS
    │   ├── layouts/            # Layouts base
    │   ├── auth/               # Páginas de autenticação
    │   └── rooms/              # Páginas de salas
    └── scripts/            # Scripts utilitários
        └── seedDatabase.js     # Popular banco com dados iniciais
```

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Popular o Banco de Dados (Opcional)
```bash
npm run seed
```
Isso criará:
- Usuário de teste: `user@example.com` / senha: `123456`
- 6 salas de exemplo (básicas e premium)

### 4. Executar o Servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## 🏗️ Arquitetura da Aplicação

### **Como os Arquivos se Conectam:**

1. **server.js** → Ponto de entrada, importa e inicia a aplicação
2. **app.js** → Configura Express, middlewares e rotas principais
3. **Routes** → Definem endpoints e conectam com controllers
4. **Controllers** → Contêm a lógica de negócio e conectam com models
5. **Models** → Representam dados e interagem com MongoDB
6. **Views** → Templates EJS que renderizam as páginas
7. **Services** → Serviços específicos (como cronômetro automático)
8. **Middlewares** → Funções que executam entre requisições

### **Fluxo de uma Requisição:**

```
Usuário faz requisição
    ↓
Routes (definem qual controller chamar)
    ↓
Middlewares (verificam autenticação, etc.)
    ↓
Controller (processa a lógica)
    ↓
Models (busca/salva dados no MongoDB)
    ↓
Views (renderiza a página com os dados)
    ↓
Resposta enviada ao usuário
```

## 📋 Funcionalidades

### **Autenticação**
- ✅ Login e registro de usuários
- ✅ Criptografia de senhas com bcrypt
- ✅ Sessões seguras
- ✅ Proteção de rotas

### **Gestão de Salas**
- ✅ Listagem de salas disponíveis
- ✅ Detalhes de cada sala
- ✅ Tipos: Básica e Premium
- ✅ Status em tempo real (disponível/ocupada)

### **Sistema de Reservas**
- ✅ Reservar salas por data/horário
- ✅ Duração personalizável (1-12 horas)
- ✅ Cronômetro automático
- ✅ Liberação automática quando tempo expira
- ✅ Cancelamento de reservas

### **Interface**
- ✅ Design responsivo e moderno
- ✅ Atualização em tempo real
- ✅ Navegação intuitiva
- ✅ Feedback visual claro

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, CSS, JavaScript vanilla
- **Banco de Dados:** MongoDB com Mongoose
- **Autenticação:** bcrypt, express-session
- **Estilo:** CSS customizado com gradientes modernos

## 📦 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm start` - Executa em modo produção  
- `npm run seed` - Popula banco com dados iniciais

## 🎨 Boas Práticas Implementadas

### **Organização do Código:**
- ✅ Separação clara de responsabilidades
- ✅ Modularização (cada arquivo tem uma função específica)
- ✅ Nomes descritivos para arquivos e funções
- ✅ Estrutura de pastas lógica e intuitiva

### **Segurança:**
- ✅ Criptografia de senhas
- ✅ Validação de dados de entrada
- ✅ Proteção contra ataques básicos
- ✅ Sessões seguras

### **Manutenibilidade:**
- ✅ Código limpo e comentado
- ✅ Tratamento de erros consistente
- ✅ Logs informativos
- ✅ Configuração via variáveis de ambiente

### **Performance:**
- ✅ Consultas otimizadas ao banco
- ✅ Arquivos estáticos servidos pelo Express
- ✅ Atualizações em tempo real eficientes

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
