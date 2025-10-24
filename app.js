require('dotenv').config(); // Carrega as variáveis de ambiente
const express = require('express');
const jwt = require('jsonwebtoken'); // Biblioteca para JWT
const bcrypt = require('bcryptjs'); // Biblioteca para Hash de Senhas
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

/*const testes  = [
    {
    'id':testes,
    'anoLancamento':2000
    },
    {
        'id':testes,
        'anoLancamento':2025
    }
];*/

let filmes = [
  {id: 1, nome: 'Onde os Fracos Não Têm Vez', anoLancamento: 2007},
  {id: 2, nome: 'O Iluminado', anoLancamento: 1980},
  {id: 3, nome: 'Interestelar', anoLancamento: 2014}
];

let nextId = 4;

// Usuários Simulados (Com Senhas HASHEADAS)
// Senha padrão para todos: "123456"
const usuarios = [
  // Hash para a senha "123456"
  { id: 1, email: 'admin@app.com', passwordHash: '', role: 'admin' },
  { id: 2, email: 'user@app.com', passwordHash: '', role: 'user' }
];

// Middleware de Verificação de Token
const verifyToken = (req, res, next) => {
  // 1. Extrai o token do cabeçalho 'Authorization' (Esperado: Bearer <TOKEN>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
      // 2. Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Anexa os dados do usuário à requisição (req.user)
      req.user = decoded;

      // 4. Continua o processamento da requisição
      next();
  } catch (err) {
      // Token inválido (expirado, adulterado, etc.)
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

// Rota POST para criar um novo filme (AGORA PROTEGIDA)
app.post('/api/filmes', verifyToken, (req, res) => { 
    // A lógica de negócio só é executada se o token for válido
  const { nome, anoLancamento } = req.body;

  if (!nome || anoLancamento === undefined) {
    return res.status(400).json({ message: 'Nome e ano de lançamento são obrigatórios.' });
  }

  const novoFilme = { 
    id: nextId++, 
    nome,
    anoLancamento,
    createdBy: req.user.id // Exemplo de uso da informação do token
  };

  filmes.push(novoFilme);
  res.status(201).json(novoFilme);
});

// Rota GET para Ler todos os Filmes
app.get('/api/filmes', verifyToken, (req, res) => {
  // Só roda se o token for válido
  res.json(filmes);
});

app.get('/api/filmes/:id', verifyToken, (req, res) => {
  // Só roda se o token for válido
  res.json(filmes);
});

// Rota GET para Página inicial
app.get('/', verifyToken, (req, res) => {
  res.send('Bem-vindo ao teste!');
});

// Rota GET para Página Sobre
app.get('/sobre', verifyToken, (req, res) => {
  console.log("A maior jóia no mundo dos cinéfilos dos tempos recentes");
  res.send('Página Sobre');
});

// Rota PUT para Atualizar um Filme existente
app.put('/api/filmes/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const filmeIndex = filmes.findIndex(f => f.id === id);

  if (filmeIndex !== -1) {
    const { nome, anoLancamento } = req.body;

    if (!nome && anoLancamento === undefined) {
      return res.status(400).json({ message: 'Forneça pelo menos um campo (nome ou ano de lançamento) para atualização.' });
    }

    filmes[filmeIndex] = {
      ...filmes[filmeIndex],
      nome: nome !== undefined ? nome : filmes[filmeIndex].nome,
      anoLancamento: anoLancamento !== undefined ? anoLancamento : filmes[filmeIndex].anoLancamento
    };

    res.json(filmes[filmeIndex]);
  } else {
    res.status(404).json({ message: 'Filme não encontrado para atualização.' });
  }
});

// Rota DELETE para Deletar um Filme
app.delete('/api/filmes/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = filmes.length;

  filmes = filmes.filter(f => f.id !== id);

  if (filmes.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Filme não encontrado para exclusão.' });
  }
});

// Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Para parar o servidor, pressione Ctrl + C no terminal`);
});
