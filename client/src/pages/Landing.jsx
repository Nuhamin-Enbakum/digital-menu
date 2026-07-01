import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Digital Menu</h1>
            <p>The easiest way to manage your restaurant's menu digitally.</p>
            <button onClick={() => navigate("/register")}>Get Started</button>
            <button onClick={() => navigate("/login")}>Login</button>
        </div>
    );
}

export default Landing;