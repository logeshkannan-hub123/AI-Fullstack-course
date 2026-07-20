import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import MovieForm from "./components/MovieForm.jsx";
import MovieList from "./components/MovieList.jsx";
import { fetchMovies, addMovie, updateMovie, deleteMovie } from "./api.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authView, setAuthView] = useState("login"); // "login" | "signup"

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingMovie, setEditingMovie] = useState(null);

  const loadMovies = useCallback(async (authToken) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchMovies(authToken);
      setMovies(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch movies whenever we have a logged-in user.
  useEffect(() => {
    if (token) {
      loadMovies(token);
    }
  }, [token, loadMovies]);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setMovies([]);
    setEditingMovie(null);
  };

  // Used for both adding a new movie and saving edits to an existing one.
  const handleSaveMovie = async (movieData) => {
    if (editingMovie) {
      await updateMovie(token, editingMovie._id, movieData);
      setEditingMovie(null);
    } else {
      await addMovie(token, movieData);
    }
    await loadMovies(token);
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Delete this movie?")) {
      return;
    }

    try {
      await deleteMovie(token, id);
      if (editingMovie?._id === id) {
        setEditingMovie(null);
      }
      await loadMovies(token);
    } catch (err) {
      setError(err.message);
    }
  };

  // Not logged in: show login or signup form.
  if (!token) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>🎬 Movie Collection</h1>
        </header>

        <main className="auth-page">
          {authView === "login" ? (
            <Login
              onLoginSuccess={handleLoginSuccess}
              onSwitchToSignup={() => setAuthView("signup")}
            />
          ) : (
            <Signup
              onSignupSuccess={() => setAuthView("login")}
              onSwitchToLogin={() => setAuthView("login")}
            />
          )}
        </main>
      </div>
    );
  }

  // Logged in: show the movie collection.
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎬 Movie Collection</h1>
        <div className="header-actions">
          <span className="welcome-text">Hi, {user?.username}</span>
          <button type="button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <main>
        <MovieForm
          key={editingMovie ? editingMovie._id : "new"}
          initialMovie={editingMovie}
          onSubmit={handleSaveMovie}
          onCancel={() => setEditingMovie(null)}
        />

        <MovieList
          movies={movies}
          loading={loading}
          error={error}
          onEdit={setEditingMovie}
          onDelete={handleDeleteMovie}
        />
      </main>
    </div>
  );
}

export default App;
