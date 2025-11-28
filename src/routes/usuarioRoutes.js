const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota de cadastro para criar um novo usuário
// POST /api/usuarios
router.post('/', usuarioController.criarUsuario);

// Rota de login para autenticação do usuário
// POST /api/usuarios/login
router.post('/login', usuarioController.login);

module.exports = router;