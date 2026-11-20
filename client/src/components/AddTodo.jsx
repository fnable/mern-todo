import { useState } from 'react';

function AddTodo({ onAdd }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim()) return;

        const wasAdded = await onAdd({
            title: title.trim(),
            description: description.trim()
        });

        if (wasAdded) {
            setTitle('');
            setDescription('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-todo-form">
            <input
                type="text"
                placeholder="Todo title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
            />

            <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />

            <button type="submit">Add Todo</button>
        </form>
    );
}

export default AddTodo;