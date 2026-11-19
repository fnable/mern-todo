const express = require('express');
const router = express.Router();

const Todo = require('../models/Todo');

// GET: Retrieve all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Create a todo
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;

        const todo = await Todo.create({
            title,
            description
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Update a todo
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found'
            });
        }

        res.json(todo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found'
            });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;