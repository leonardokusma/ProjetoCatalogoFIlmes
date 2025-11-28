const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

//Definição do Modelo 'Filme'
const Filme = sequelize.define('Filme', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    anoLancamento: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'FILMES',
    timestamps: false
});

module.exports = Filme;