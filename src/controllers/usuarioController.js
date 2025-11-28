require('dotenv').config(); // Carrega as variáveis de ambiente
const jwt = require('jsonwebtoken'); // Biblioteca para JWT
const bcrypt = require('bcryptjs'); // Biblioteca para Hash de Senhas
const Usuario = require('../models/usuario');

// Cadastrar usuário (POST /api/usuarios)
exports.criarUsuario = async (req, res) => {
    const { nome, email, senha, role } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    try {
        // Verifica se o e-mail já existe no banco
        const usuarioExistente = await Usuario.findOne({ where: { email: email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: "E-mail já cadastrado!" });
        }

        // Criptografia da senha
        const senhaCriptografada = bcrypt.hashSync(senha, 10);

        // Criação do usuário no Banco de Dados
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada,
            role: role || 'user' // Se não enviar role, assume 'user'
        });

        // Retorna o usuário criado, mas sem a senha (segurança)
        const usuarioRetorno = {
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            role: novoUsuario.role
        };

        res.status(201).json(usuarioRetorno);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor ao criar usuário.' });
    }
};

// Função para retornar todos os usuários cadastrados (GET /api/usuarios)
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['senha'] } // Ótima prática: não devolve a senha hash
        });
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar usuários." });
    }
};

// Função para retornar um usuário por ID
exports.buscarUsuarioPorId = async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['senha'] }
        });

        if(usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado!' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Atualizar usuário pela ID (PUT /api/usuarios/)
exports.atualizarUsuario = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email, role, senha } = req.body;

    try {
        // Prepara o objeto de atualização
        let dadosParaAtualizar = { nome, email, role };

        // Se o usuário mandou uma nova senha, criptografa antes de salvar no banco
        if (senha) {
            dadosParaAtualizar.senha = bcrypt.hashSync(senha, 10);
        }

        // Remove campos undefined/null para não apagar dados sem querer
        Object.keys(dadosParaAtualizar).forEach(key => 
            dadosParaAtualizar[key] === undefined && delete dadosParaAtualizar[key]
        );

        const [updated] = await Usuario.update(dadosParaAtualizar, {
            where: { id: id }
        });

        if (updated) {
            const usuarioAtualizado = await Usuario.findByPk(id, {
                attributes: { exclude: ['senha'] }
            });
            res.json(usuarioAtualizado);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
        } 
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar usuário.' });
    }
};

// --- CRUD: DELETAR (NOVO) ---
exports.deletarUsuario = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const deleted = await Usuario.destroy({
            where: { id: id }
        });

        if (deleted) {
            res.status(204).send(); // 204 = Sem conteúdo (sucesso, mas sem body)
        } else {
            res.status(404).json({ message: 'Usuário não encontrado para exclusão.'});
        }
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar usuário.' });
    }
};

// LOGIN (POST /api/usuarios/login)
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        // Busca o usuário no banco pelo e-mail
        const usuario = await Usuario.findOne({ where: { email: email } });

        // Se não achar o usuário
        if (!usuario) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        // Validar a senha comparando com a hash do banco
        const senhaValida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        // Gerar o token JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                nome: usuario.nome, 
                role: usuario.role // Garante que o role venha do banco
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login bem-sucedido!",
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor ao realizar login.' });
    }
};