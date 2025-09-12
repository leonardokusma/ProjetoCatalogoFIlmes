const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}/sobre`);
    console.log(`Para parar o servidor, pressione Ctrl + C no terminal`)
}
);

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

app.get('/api/filmes',(req,res) => {
    res.json(filmes);
});

app.get('/',(req,res) => {
    res.send('Bem vindo ao teste!!!!');
});

app.get('/sobre',(req,res) => {
    console.log("A maior jóia no mundo dos cinéfilos dos tempos recentes");
});

let filmes = [
  {id: 1, nome: 'Onde os Fracos Não Têm Vez', anoLancamento: 2007},
  {id: 2, nome: 'O Iluminado', anoLancamento: 1980},
  {id: 3, nome: 'Interestelar', anoLancamento: 2014}
];

let nextId = 4;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Para parar o servidor, pressione Ctrl + C no terminal');
});

app.post('/api/filmes', (req, res) => { 
  const { nome, anoLancamento } = req.body;

  if (!nome || !anoLancamento) {
    return res.status(400).json({ message: 'Nome e ano de lançamento são obrigatórios.' });
  }

  const novoFilme = { id: nextId++, nome, anoLancamento };
  
  filmes.push(novoFilme);
  res.status(201).json(novoFilme);
});

app.put('api/filmes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const filmeIndex = filmes.findIndex(f => f.id === id);

  if (filmeIndex !== -1) {
    const { nome, anoLancamento } = req.body;

    if (!nome && !anoLancamento) {
      return res.status(400).json({ message: 'Forneça pelo menos um campo (nome ou ano de lançamento) para atualização.' });
    }

    filmes[filmeIndex] = {
      ...filmes[filmeIndex],
      nome: nome !== undefined ? nome : filmes[filmeIndex].nome,
      anoLancamento: anoLancamento !== undefined ? anoLancamento : filmes[filmeIndex].anoLancamento
    };

    res.json(filmes[filmeIndex]);
  }

  else {
    res.status(404).json({ message: 'Filme não encontrado para atualização.'});
  }
});

app.delete('api/filmes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = filmes.length;

  filmes = filmes.filter(f => f.id !== id);

  if (filmes.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Filme não encontrado para exclusão.' });
  }
});