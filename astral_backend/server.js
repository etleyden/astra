const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { Pool } = require('pg'); // Use Pool for managing multiple connections

const app = express();
app.use(cors()); 
app.use(cookieParser());
app.use(express.json());

// login/authentication logic 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

function generateToken(userId) {
    return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' }); 
}

// db logic 
const port = 3001;
const pool = new Pool({
    user: process.env.ASTRAL_DB_USER,
    host: process.env.ASTRAL_DB_HOST,
    port: process.env.ASTRAL_DB_PORT,
    database: process.env.ASTRAL_DB_NAME,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to the database');
    release();
});

// endpoints
app.get('/', (req, res) => {
    res.send('Hello from the Node.js backend!');
});

 // Registration endpoint
app.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = await auth.hashPassword(password);

    try {
        const result = await pool.query('INSERT INTO app_user (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)', [first_name, last_name, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    console.log(`Received request: ${first_name} ${last_name} ${email} ${password}`);
    try {
        const result = await pool.query('SELECT * FROM app_user WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = auth.generateToken(user.id);
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});