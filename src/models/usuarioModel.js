const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

//Definição do Modelo 'Filme'
const usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Senha : {
        type: DataTypes.STRING,
        allowNull:false
    },
    genero : {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'FILMES',
    timestamps: false
});

module.exports = Filme;