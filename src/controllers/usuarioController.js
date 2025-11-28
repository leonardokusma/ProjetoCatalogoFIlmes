require('dotenv').config(); // Carrega as variáveis de ambiente
const jwt = require('jsonwebtoken'); // Biblioteca para JWT
const bcrypt = require('bcryptjs'); // Biblioteca para Hash de Senhas

// Usuários Simulados (Com Senhas HASHEADAS)
// Senha padrão para todos: "123456"
const usuarios = [];
//   Hash para a senha "123456"
//   { id: 1, email: 'admin@app.com', passwordHash: '', role: 'admin' },
//   { id: 2, email: 'user@app.com', passwordHash: '', role: 'user' }
// ];

exports.criarUsuario = (req, res) => {
    const { nome, email, senha } = req.body;

    // Verifica se o e-mail já está cadastrado
    if(usuarios.find(u => u.email === email)) {
        return res.status(400).json({ message: "E-mail já cadastrado!"});
    }

    // Criptografia das senhas
    const senhaCriptografada = bcrypt.hashSync(senha, 10);

    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha: senhaCriptografada
    };

    usuarios.push(novoUsuario);

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);
};

exports.login = (req, res) => {
    const { email, senha } = req.body;

    //Encontrar o usuário pelo e-mail
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Validar a senha comparando com a salva no banco (criptografada)
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) {
        return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Se as credenciais forem válidas, gerar o token JWT para autenticação
    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome},
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        message: "Login bem-sucedido!",
        token: token
    });
};

