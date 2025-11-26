import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Session from "./pages/session";
import Login from "./pages/login";
import { initKeycloak } from "./services/keycloak";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    initKeycloak().then(() => {
      console.log("Keycloak Authenticated");
      if (location.pathname === "/") navigate("/");
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session/:id" element={<Session />} />
      <Route path="/auth/callback" element={<Login />} />
    </Routes>
  );
}

