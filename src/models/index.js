const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('driverapp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const User = require('./user')(sequelize);
const UserRole = require('./userRole')(sequelize);
const Trip = require('./trip')(sequelize);
const OrderTrip = require('./orderTrip')(sequelize);

// Define associations
User.belongsTo(UserRole, { foreignKey: 'role_id' });
Trip.belongsTo(User, { foreignKey: 'user_id' });
OrderTrip.belongsTo(Trip, { foreignKey: 'trip_id' });
OrderTrip.belongsTo(User, { foreignKey: 'driver_id' });

module.exports = {
    User,
    UserRole,
    Trip,
    OrderTrip,
    sequelize
};
