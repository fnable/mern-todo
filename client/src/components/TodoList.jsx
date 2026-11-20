
import { useEffect, useState } from 'react';
import api from '../api/axios';
import AddTodo from './AddTodo';
import FilterTodo from './FilterTodo';
import { useAuth } from '../context/AuthContext';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // Edit states
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const { user, logout } = useAuth();

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

    const filteredTodos = todos.filter((todo) => {
        const searchTerm = search.toLowerCase();

        const matchesSearch =
            todo.title.toLowerCase().includes(searchTerm) ||
            (todo.description || '').toLowerCase().includes(searchTerm);

        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && !todo.completed) ||
            (filter === 'completed' && todo.completed);

        return matchesSearch && matchesFilter;
    });

    const addTodo = async ({ title, description }) => {
        try {
            await api.post('/todos', { title, description });
            fetchTodos();
            return true;
        } catch (error) {
            console.error('Error adding todo:', error);
            return false;
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
            <div className="todo-header">
                <div>
                    <h1>My Todo App</h1>
                    <p>Welcome, {user?.name}!</p>
                </div>

                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </div>

            <AddTodo onAdd={addTodo} />

            <FilterTodo
                search={search}
                filter={filter}
                onSearchChange={setSearch}
                onFilterChange={setFilter}
            />

            <div className="todo-list">
                {filteredTodos.length === 0 ? (
                    <p>
                        {todos.length === 0
                            ? 'No todos yet. Add one!'
                            : 'No matching todos found.'}
                    </p>
                ) : (
                    filteredTodos.map((todo) => (
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
