// src/models/trip.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Trip = sequelize.define('Trip', {
        start_location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        end_location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        }
    }, {
        tableName: 'trips'
    });

    return Trip;
};
