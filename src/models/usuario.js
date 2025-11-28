const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

// Definição do Modelo 'Usuario'
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Garante que não existam e-mails duplicados no banco
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user' // Por padrão, cria como usuário comum
    }
}, {
    tableName: 'USUARIOS',
    timestamps: false
});

module.exports = Usuario;