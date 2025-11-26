// App.js
import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CoursePage from "./pages/CoursePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import DocumentViewer from "./pages/DocumentViewer";

export default function App() {
  const { user, logout } = useAuth();
  const location = useLocation();


  const hideNavbar = location.pathname.startsWith("/video/");

  return (
    <>
      {!hideNavbar && (
        <nav className="navbar navbar-expand-lg navbar-dark " style={{ background: "#035642" }}>
          <div className="container">
            <Link className="navbar-brand" to="/">Imarticus LMS</Link>

            <div>
              {!user ? (
                <>
                  <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                  <Link className="btn btn-light" to="/register">Register</Link>
                </>
              ) : (
                <button className="btn btn-light" onClick={logout}>Logout</button>
              )}
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/document/:id" element={<DocumentViewer />} />

      </Routes>
    </>
  );
}
