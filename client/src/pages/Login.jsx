import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../utils/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const response = await api.post("/auth/login", {email, password});
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch(err){
            setError("Invalid Email or Password");
        } finally  {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Loading in..." : "Login"}
                </button>
            </form>
                
        </div>
    );

}

export default Login;