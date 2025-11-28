const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificaToken, verificaAdmin } = require('../middlewares/authMiddleware');

// --- ROTAS PÚBLICAS ---

// Rota de login
// POST /api/usuarios/login
router.post('/login', usuarioController.login);

// Rota de cadastro para criar um novo usuário
// POST /api/usuarios
router.post('/', usuarioController.criarUsuario);

// --- ROTAS PRIVADAS ---

// Listar todos os usuários
// GET /api/usuarios
router.get('/', verificaToken, verificaAdmin, usuarioController.listarUsuarios); 

// Buscar usuário específico por ID
// GET /api/usuarios/:id
router.get('/:id', verificaToken, verificaAdmin, usuarioController.buscarUsuarioPorId);

// Atualizar usuário
// PUT /api/usuarios/:id
router.put('/:id', verificaToken, verificaAdmin, usuarioController.atualizarUsuario);

// Deletar usuário
// DELETE /api/usuarios/:id
router.delete('/:id', verificaToken, verificaAdmin, usuarioController.deletarUsuario);

module.exports = router;