// src/models/orderTrip.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderTrip = sequelize.define('OrderTrip', {
        trip_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        driver_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'ordertrips'
    });

    return OrderTrip;
};
