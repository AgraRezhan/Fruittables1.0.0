import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useProductStore from '../../store/useProductStore';
import "./loginRegister.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useProductStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state before login attempt
        await login({ email, password }, navigate, setError);
    };

    return (
        <div className="body-loginreg">
            <div className="login-container">
                <h2 className="text-center" style={{ color: "#28a745" }}>Login</h2>
                <form onSubmit={handleLogin}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    <div className="register-link">
                        <Link to="/register">Belum punya akun? Daftar</Link>
                    </div>
                    <div className="social-buttons">
                        <button type="button" className="btn btn-google btn-social"><i className="fab fa-google"></i></button>
                        <button type="button" className="btn btn-facebook btn-social"><i className="fab fa-facebook-f"></i></button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
