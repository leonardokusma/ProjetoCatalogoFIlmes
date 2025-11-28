const Filme = require('../models/filme');

//Função para retornar todos os filmes
// GET
exports.listarFilmes = async (req, res) => {
    try {
        const filmes = await Filme.findAll();
        res.json(filmes);
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro no servidor ao buscar os filmes."});
    }
};

//Função para retornar um filme por ID
exports.buscarFilmePorId = async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        const filmeEncontrado = await Filme.findByPk(id);

        if(filmeEncontrado) {
            res.json(filmeEncontrado);
        } else {
            res.status(404).send('Filme não encontrado!');
        }
    } catch (err) {
        res.status(500).json({message : 'Erro no servidor.' });
    }
};

// Função para criar um novo filme
exports.criarFilme = async (req, res) => { 
    const { nome, anoLancamento } = req.body;

    if (!nome || anoLancamento === undefined) {
        return res.status(400).json({ message: 'Nome e ano de lançamento são obrigatórios.' });
    }

    try {
        const novoFilme = await Filme.create({ nome, anoLancamento });
        res.status(201).json(novoFilme)
    } catch (err) {
        res.status(500).json({ message: 'Ocorreu um erro no servidor ao criar o filme.' });
    }
};

// Função para retornar as infos da Página Sobre
exports.sobre = (req, res) => {
  console.log("A maior jóia no mundo dos cinéfilos dos tempos recentes!");
  res.send('Página Sobre');
};

// Função para atualizar um filme pela ID
exports.atualizarFilme = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, anoLancamento } = req.body;

    if (!nome && anoLancamento === undefined) {
        return res.status(400).json({ message: 'Forneça pelo menos um campo (nome ou ano de lançamento) para atualização.' });
    }

    try {
        const [updated] = await Filme.update({ nome, anoLancamento }, {
            where: { id: id }
        });

        if (updated) {
            const filmeAtualizado = await Filme.findByPk(id);
            res.json(filmeAtualizado);
        } else {
            res.status(404).json({ message: 'Filme não encontrado para atualização.' });
        } 
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor ao atualizar filme.' });
    }
};

// Função para deletar um filme pela ID
exports.deletarFilme = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const deleted = await Filme.destroy({
            where: { id: id }
        });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Filme não encontrado para exclusão.'})
        }
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor ao deletar filme.' });
    }
};