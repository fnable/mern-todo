function FilterTodo({ search, filter, onSearchChange, onFilterChange }) {
    return (
        <div className="todo-controls">
            <input
                type="text"
                placeholder="Search todos..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
            />

            <div className="filter-buttons">
                <button
                    type="button"
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => onFilterChange('all')}
                >
                    All
                </button>

                <button
                    type="button"
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => onFilterChange('pending')}
                >
                    Pending
                </button>

                <button
                    type="button"
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => onFilterChange('completed')}
                >
                    Completed
                </button>
            </div>
        </div>
    );
}

export default FilterTodo;