import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import AddMovie from "./pages/AddMovie/AddMovie.jsx";
import EditMovie from "./pages/EditMovie/EditMovie.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/add" element={<AddMovie />} />
          <Route path="/movies/edit/:id" element={<EditMovie />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
