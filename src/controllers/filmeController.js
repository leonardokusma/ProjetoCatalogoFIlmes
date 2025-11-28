const { dir } = require('console');
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
    const { nome, anoLancamento, diretor, genero} = req.body;

    if (!nome || anoLancamento || diretor  || genero === undefined) {
        return res.status(400).json({ message: 'Nome, ano de lançamento, diretor e genero são obrigatórios.' });
    }

    try {
        const novoFilme = await Filme.create({ nome, anoLancamento, diretor,genero});
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
    const { nome, anoLancamento, diretor, genero} = req.body;

    if (!nome && anoLancamento === undefined) {
        return res.status(400).json({ message: 'Forneça pelo menos um campo (nome ou ano de lançamento) para atualização.' });
    }

    try {
        const [updated] = await Filme.update({ nome, anoLancamento,diretor,genero}, {
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

exports.buscarFilmesAleatorios = async (req, res) => {
    try {
        // Pega a quantidade via query param ou define 1 como padrão
        const quantidade = parseInt(req.query.limit) || 1;

        const filmes = await Filme.findAll({
            // 'Filme.sequelize.random()' gera a query correta (RAND ou RANDOM) dependendo do banco
            order: Filme.sequelize.random(),
            limit: quantidade
        });

        res.json(filmes);
    } catch (err) {
        console.error(err); // Log do erro para o desenvolvedor
        res.status(500).json({ message: "Erro ao buscar filmes aleatórios." });
    }
};
