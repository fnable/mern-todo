
const express = require('express');
const Todo = require('../models/Todo');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below require authentication
router.use(protect);

// GET: Retrieve only the logged-in user's todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json(todos);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve todos.'
        });
    }
});

// POST: Create a todo belonging to the logged-in user
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Todo title is required.'
            });
        }

        const todo = await Todo.create({
            user: req.user.id,
            title,
            description
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create todo.'
        });
    }
});

// PUT: Update only a todo owned by the logged-in user
router.put('/:id', async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        const updates = {};

        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (completed !== undefined) updates.completed = completed;

        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found.'
            });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update todo.'
        });
    }
});

// DELETE: Delete only a todo owned by the logged-in user
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found.'
            });
        }

        res.json({
            message: 'Todo deleted successfully.'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete todo.'
        });
    }
});

module.exports = router;
