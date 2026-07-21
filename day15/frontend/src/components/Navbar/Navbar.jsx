import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">
        🎬 CineVault
      </NavLink>

      {isAuthenticated && (
        <nav className="navbar-links">
          <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
            Movies
          </NavLink>
          <NavLink to="/movies/add" className={({ isActive }) => (isActive ? "active" : "")}>
            Add Movie
          </NavLink>
          {user?.username && <span className="navbar-user">Hi, {user.username}</span>}
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}
