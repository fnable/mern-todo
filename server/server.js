const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'MERN Todo API is running!'
    });
});

// Todo API routes
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, '127.0.0.1', () => {
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    });
};

startServer();