const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const todoRoutes = require('./Routes/todoRoutes');
const authRoutes = require('./Routes/authRoutes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.CLIENT_URL
    ].filter(Boolean)
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'MERN Todo API is running!'
    });
});

// Todo API routes
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
};

startServer();