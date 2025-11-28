const express = require('express');
const router = express.Router();
const filmeController = require('../controllers/filmeController');
const { verificaToken } = require('../middlewares/authMiddleware');

// Definição das rotas e associação com as funções exportadas do controller
// Rotas públicas (qualquer um pode ver. Sem autenticação)
router.get('/', filmeController.listarFilmes);
router.get('/:id', filmeController.buscarFilmePorId);

// Rotas protegidas com autenticação JWT
// O middleware 'verificaToken' executa antes das funções do controller
router.post('/', verificaToken, filmeController.criarFilme);
router.put('/:id', verificaToken, filmeController.atualizarFilme);
router.delete('/:id', verificaToken, filmeController.deletarFilme);

module.exports = router;