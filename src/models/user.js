// src/models/user.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'users'
    });

    return User;
};
