// Carrega variáveis de ambiente antes de qualquer coisa
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Importa rotas
const authRoutes = require('./src/routes/authRoutes');
const diaryRoutes = require('./src/routes/diaryRoutes');
const emotionRoutes = require('./src/routes/emotionRoutes');
const psychologistRoutes = require('./src/routes/psychologistRoutes');

// Importa conexão com o banco
const pool = require('./src/models/db');

// Swagger
const { swaggerUi, swaggerSpec } = require('./src/swagger');

const app = express();

const contentRoutes = require('./src/routes/contentRoutes');
// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/diary', diaryRoutes);
app.use('/emotion', emotionRoutes);
app.use('/psychologists', psychologistRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', authRoutes);
app.use('/contents', contentRoutes);
// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
