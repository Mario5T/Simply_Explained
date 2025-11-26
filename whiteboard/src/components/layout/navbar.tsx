import keycloak from "../../services/keycloak";

export default function Navbar() {
    return (
        <div className="excali-navbar">
            <div className="navbar-content">
                <img
                    src="/assets/logo.png"
                    alt="Simply Explained"
                    style={{ height: '100px', width: 'auto', marginRight: '20px' }}
                />
                <button
                    className="excali-btn btn-danger"
                    onClick={() => keycloak.logout()}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
