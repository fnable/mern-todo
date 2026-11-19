
import { useEffect, useState } from 'react';
import api from '../api/axios';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    // Edit states
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const fetchTodos = async () => {
        try {
            const response = await api.get('/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const addTodo = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        try {
            await api.post('/todos', { title, description });
            setTitle('');
            setDescription('');
            fetchTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (todo) => {
        try {
            await api.put(`/todos/${todo._id}`, {
                completed: !todo.completed
            });
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}`);

            if (editingId === id) {
                cancelEdit();
            }

            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    // Start editing a todo
    const startEdit = (todo) => {
        setEditingId(todo._id);
        setEditTitle(todo.title);
        setEditDescription(todo.description || '');
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
    };

    // Save edited todo
    const saveEdit = async (e, id) => {
        e.preventDefault();

        if (!editTitle.trim()) return;

        try {
            await api.put(`/todos/${id}`, {
                title: editTitle,
                description: editDescription
            });

            cancelEdit();
            fetchTodos();
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    if (loading) return <p>Loading todos...</p>;

    return (
        <div className="todo-container">
            <h1>My Todo App</h1>

            <form onSubmit={addTodo}>
                <input
                    type="text"
                    placeholder="Todo title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button type="submit">Add Todo</button>
            </form>

            <div className="todo-list">
                {todos.length === 0 ? (
                    <p>No todos yet. Add one!</p>
                ) : (
                    todos.map((todo) => (
                        <div key={todo._id} className="todo-item">
                            {editingId === todo._id ? (
                                // Edit form
                                <form onSubmit={(e) => saveEdit(e, todo._id)}>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(e.target.value)
                                        }
                                        placeholder="Todo title"
                                        required
                                    />

                                    <textarea
                                        value={editDescription}
                                        onChange={(e) =>
                                            setEditDescription(e.target.value)
                                        }
                                        placeholder="Description"
                                    />

                                    <button type="submit">Save</button>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                // Normal todo display
                                <>
                                    <div>
                                        <h3
                                            style={{
                                                textDecoration: todo.completed
                                                    ? 'line-through'
                                                    : 'none'
                                            }}
                                        >
                                            {todo.title}
                                        </h3>

                                        <p>{todo.description}</p>

                                        <small>
                                            {todo.completed
                                                ? 'Completed'
                                                : 'Pending'}
                                        </small>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => toggleTodo(todo)}
                                        >
                                            {todo.completed
                                                ? 'Undo'
                                                : 'Complete'}
                                        </button>

                                        <button
                                            onClick={() => startEdit(todo)}
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteTodo(todo._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TodoList;
