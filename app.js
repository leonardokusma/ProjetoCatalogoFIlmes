const express = require('express'); // Importando o Express
const app = express(); // Criando a aplicação
const PORT = 3000; // Porta do servidor

// Middleware para ler JSON no corpo das requisições
app.use(express.json());

// Nosso "banco de dados" em memória de filmes
let filmes = [
  { id: 1, titulo: 'Interestelar', diretor: 'Christopher Nolan', ano: 2014 },
  { id: 2, titulo: 'Parasita', diretor: 'Bong Joon-ho', ano: 2019 },
  { id: 3, titulo: 'O Poderoso Chefão', diretor: 'Francis Ford Coppola', ano: 1972 }
];
let nextId = 4; // Próximo ID a ser usado

// Rota GET raiz
app.get('/', (req, res) => {
  res.send('Bem-vinda a API de Catálogo de Filmesssss');
});

// Rota GET sobre
app.get('/sobre', (req, res) => {
  res.send('Esta é uma API básica para gerenciar um catálogo de filmes.');
});

// Rota GET para listar todos os filmes
app.get('/api/filmes', (req, res) => {
  res.json(filmes);
});

// Rota GET para buscar um filme pelo ID
app.get('/api/filmes/:id', (req, res) => {
  const idFilme = parseInt(req.params.id);
  const filmeEncontrado = filmes.find(f => f.id === idFilme);

  if (filmeEncontrado) {
    res.json(filmeEncontrado);
  } else {
    res.status(404).send('Filme não encontrado.');
  }
});

// Rota POST para adicionar um novo filme
app.post('/api/filmes', (req, res) => {
  const { titulo, diretor, ano } = req.body;

  if (!titulo || !diretor || ano === undefined) {
    return res.status(400).json({ message: 'Título, diretor e ano são obrigatórios.' });
  }

  const novoFilme = {
    id: nextId++,
    titulo,
    diretor,
    ano
  };

  filmes.push(novoFilme);
  res.status(201).json(novoFilme);
});

// Rota PUT para atualizar um filme
app.put('/api/filmes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const filmeIndex = filmes.findIndex(f => f.id === id);

  if (filmeIndex !== -1) {
    const { titulo, diretor, ano } = req.body;

    if (!titulo && !diretor && ano === undefined) {
      return res.status(400).json({ message: 'Pelo menos um campo (titulo, diretor ou ano) deve ser informado.' });
    }

    filmes[filmeIndex] = {
      ...filmes[filmeIndex],
      titulo: titulo !== undefined ? titulo : filmes[filmeIndex].titulo,
      diretor: diretor !== undefined ? diretor : filmes[filmeIndex].diretor,
      ano: ano !== undefined ? ano : filmes[filmeIndex].ano
    };

    res.json(filmes[filmeIndex]);
  } else {
    res.status(404).json({ message: 'Filme não encontrado para atualização.' });
  }
});

// Rota DELETE para remover um filme
app.delete('/api/filmes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tamanhoInicial = filmes.length;

  filmes = filmes.filter(f => f.id !== id);

  if (filmes.length < tamanhoInicial) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Filme não encontrado para exclusão.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🎬 Servidor rodando em http://localhost:${PORT}`);
  console.log('Use Ctrl+C para parar o servidor.');
});
