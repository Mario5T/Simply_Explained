import { useEffect } from "react";
import keycloak from "../services/keycloak";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        keycloak
            .init({ onLoad: 'login-required' })
            .then(() => { navigate('/session'); })
    }, [])
    return <p>Redirecting...</p>
}