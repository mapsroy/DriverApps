// src/models/userRole.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserRole = sequelize.define('UserRole', {
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'userroles',
        timestamps: false // Menonaktifkan fitur timestamps
    });

    return UserRole;
};
