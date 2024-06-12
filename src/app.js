const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { swaggerUi, specs } = require('./swagger');
const { User, UserRole, Trip, OrderTrip, sequelize } = require('./models');

const app = express();
app.use(bodyParser.json());

// Create user roles
async function createRoles() {
    await UserRole.findOrCreate({ where: { role_name: 'user' } });
    await UserRole.findOrCreate({ where: { role_name: 'driver' } });
}

createRoles();

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// User Registration
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User registered successfully
 *       '500':
 *         description: Failed to register user
 */
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate the role
        if (!['user', 'driver'].includes(role) && ![1, 2].includes(role)) { // tambahkan 1 dan 2 untuk role id
            return res.status(400).json({ error: 'Invalid role' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let userRole;

        if (typeof role === 'string') { // jika role adalah string
            userRole = await UserRole.findOne({ where: { role_name: role } });
        } else { // jika role adalah angka
            userRole = await UserRole.findOne({ where: { id: role } });
        }

        // Create the role if it does not exist
        if (!userRole) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.create({ username, email, password: hashedPassword, role_id: userRole.id });
        res.json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});



// User Login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Failed to login
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email }, include: UserRole });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, role: user.UserRole.role_name }, 'secret');
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}


// User create trip
/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trip]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_location:
 *                 type: string
 *               end_location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trip created successfully
 *       500:
 *         description: Failed to create trip
 */
app.post('/api/trips', authenticateToken, async (req, res) => {
    try {
        const { start_location, end_location } = req.body;
        const trip = await Trip.create({ start_location, end_location, user_id: req.user.userId });
        res.json({ message: 'Trip created successfully', trip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
});

// User view their trips
/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Get user trips
 *     tags: [Trip]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user trips
 *       500:
 *         description: Failed to fetch trips
 */
app.get('/api/trips', authenticateToken, async (req, res) => {
    try {
        const trips = await Trip.findAll({ where: { user_id: req.user.userId } });
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Driver view available trips
/**
 * @swagger
 * /available-trips:
 *   get:
 *     summary: Get available trips
 *     tags: [Trip]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available trips
 *       500:
 *         description: Failed to fetch available trips
 */
app.get('/api/available-trips', authenticateToken, async (req, res) => {
    try {
        const trips = await Trip.findAll({ where: { status: 'pending' } });
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch available trips' });
    }
});

// Driver accept trip
/**
 * @swagger
 * /accept-trip:
 *   post:
 *     summary: Accept a trip
 *     tags: [Trip]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Trip accepted successfully
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Failed to accept trip
 */
app.post('/api/accept-trip', authenticateToken, async (req, res) => {
    try {
        const { tripId } = req.body;
        const trip = await Trip.findByPk(tripId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        const orderTrip = await OrderTrip.create({ trip_id: trip.id, driver_id: req.user.userId, status: 'accepted' });
        trip.status = 'completed';
        await trip.save();
        res.json({ message: 'Trip accepted successfully', orderTrip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to accept trip' });
    }
});

// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
