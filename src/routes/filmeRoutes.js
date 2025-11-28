const express = require('express');
const router = express.Router();
const filmeController = require('../controllers/filmeController');
const { verificaToken, verificaAdmin } = require('../middlewares/authMiddleware');

// Definição das rotas e associação com as funções exportadas do controller
// Rotas públicas (qualquer um pode ver. Sem autenticação)
router.get('/', filmeController.listarFilmes);
router.get('/:id', filmeController.buscarFilmePorId);

// Rotas protegidas com autenticação JWT
// O middleware 'verificaToken' executa antes das funções do controller
router.post('/', verificaToken,verificaAdmin, filmeController.criarFilme);
router.put('/:id', verificaToken, verificaAdmin, filmeController.atualizarFilme);
router.delete('/:id', verificaToken,  verificaAdmin,filmeController.deletarFilme);
router.get('/',verificaToken,verificaAdmin, filmeController.buscarFilmesAleatorios)

module.exports = router;