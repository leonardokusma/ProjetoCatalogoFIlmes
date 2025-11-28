require('dotenv').config(); // Carrega as variáveis de ambiente
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken'); // Biblioteca para JWT
const bcrypt = require('bcryptjs'); // Biblioteca para Hash de Senhas
const sequelize = require('./src/database/database.js');
const Filme = require('./src/models/filme.js');
const app = express();
const PORT = 3000;

// Libera acesso de qualquer origem
app.use(cors());

// Middleware para processar JSON
app.use(express.json());

// Sincronização do Banco
async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log('Banco de dados sincronizado com sucesso.');
  } catch (err) {
    console.error('Erro ao sincronizar o banco de dados: ', err);
  }
}
syncDatabase();

// Importação dos arquivos de rotas
const filmeRoutes = require('./src/routes/filmeRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');

// Definição dos prefixos para as rotas
// Os endpoints deverão ter '/api/filmes' antes, e o mesmo para as outras rotas
app.use('/api/filmes', filmeRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Para parar o servidor, pressione Ctrl + C no terminal`);
});
