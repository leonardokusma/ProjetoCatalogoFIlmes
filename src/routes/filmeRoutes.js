const express = require('express');
const router = express.Router();
const filmeController = require('../controllers/filmeController');
const { verificaToken, verificaAdmin } = require('../middlewares/authMiddleware');

// --- ROTAS PÚBLICAS (qualquer um pode ver. Sem autenticação) ---

// Rota "estou com sorte!" que retorna um filme aleatório
router.get('/aleatorio', filmeController.buscarFilmesAleatorios)

// Listar todos os filmes
// GET /api/filmes
router.get('/', filmeController.listarFilmes);

// Buscar filme específico por ID
// GET /api/filmes/:id
router.get('/:id', filmeController.buscarFilmePorId);

// --- ROTAS PRIVADAS protegidas com autenticação JWT ---
// Os middlewares 'verificaToken' e 'verificaAdmin' executam antes das funções do controller

// Rota de cadastro para criar um novo filme
// POST /api/filmes
router.post('/', verificaToken,verificaAdmin, filmeController.criarFilme);

// Atualizar filme
// PUT /api/filmes/:id
router.put('/:id', verificaToken, verificaAdmin, filmeController.atualizarFilme);

// Deletar filme
// DELETE /api/filmes/:id
router.delete('/:id', verificaToken, verificaAdmin,filmeController.deletarFilme);

module.exports = router;