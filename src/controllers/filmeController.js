let filmes = [
  {id: 1, nome: 'Onde os Fracos Não Têm Vez', anoLancamento: 2007},
  {id: 2, nome: 'O Iluminado', anoLancamento: 1980},
  {id: 3, nome: 'Interestelar', anoLancamento: 2014}
];

let nextId = 4;

//Função para retornar todos os filmes
exports.listarFilmes = (req, res) => {
    res.json(filmes);
}

//Função para retornar um filme por ID
exports.buscarFilmePorId = (req, res) => {
    const idFilme = parseInt(req.params.id);
    const filmeEncontrado = filmes.find(f => f.id === idFilme);

    if(filmeEncontrado) {
        res.json(filmeEncontrado);
    } else {
        res.status(404).send('Filme não encontrado!');
    }
};

// Função para criar um novo filme
exports.criarFilme = (req, res) => { 
  const { nome, anoLancamento } = req.body;

  if (!nome || anoLancamento === undefined) {
    return res.status(400).json({ message: 'Nome e ano de lançamento são obrigatórios.' });
  }

  const novoFilme = { 
    id: nextId++, 
    nome,
    anoLancamento
  };

  filmes.push(novoFilme);
  res.status(201).json(novoFilme);
};

// Função para retornar as infos da Página Sobre
exports.sobre = (req, res) => {
  console.log("A maior jóia no mundo dos cinéfilos dos tempos recentes!");
  res.send('Página Sobre');
};

// Função para atualizar um filme pela ID
exports.atualizarFilme = (req, res) => {
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
};

// Função para deletar um filme pela ID
exports.deletarFilme = (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = filmes.length;

  filmes = filmes.filter(f => f.id !== id);

  if (filmes.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Filme não encontrado para exclusão.' });
  }
};