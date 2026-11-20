
import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const saveAuth = (data) => {
        localStorage.setItem('token', data.token);

        const userData = {
            _id: data._id,
            name: data.name,
            email: data.email
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', {
            name,
            email,
            password
        });

        saveAuth(response.data);
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        saveAuth(response.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, register, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
