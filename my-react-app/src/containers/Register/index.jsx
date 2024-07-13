import React, { useState } from "react";
import useProductStore from "../../store/useProductStore";
import { Link, useNavigate } from "react-router-dom";
import "../Login/loginRegister.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const register = useProductStore((state) => state.register);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(
      { username, first_name, last_name, email, password, role },
      navigate,
      setError
    );
  };

  return (
    <div className="body-loginreg">
      <div className="login-container">
        <h2 className="text-center" style={{ color: "#28a745" }}>
          Register
        </h2>
        <form onSubmit={handleRegister}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label htmlFor="new-first-name" className="form-label">
              First Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="new-first-name"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="new-last-name" className="form-label">
              Last Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="new-last-name"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="new-username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              className="form-control"
              id="new-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="new-email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              className="form-control"
              id="new-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="new-password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="new-last-name" className="form-label">
              Address:
            </label>
            <input
              type="text"
              className="form-control"
              id="new-last-name"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="new-select" className="form-label">
              Role:
            </label>
            <select
              className="form-select"
              id="new-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Choose...</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
          <div className="login-link">
            <Link to="/">Sudah punya akun? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
