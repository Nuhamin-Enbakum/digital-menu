import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../utils/api";

function Register() {
    const [restaurant_name, setRestaurant_name] = useState("");
    const [email, setEmail] = useState("");
    const [slug, setSlug] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/register", {restaurant_name, email, slug, password, confirmPassword });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch(err){
            setError("Email alreay exists");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                type="text" 
                placeholder="Restaurant name here" 
                value={restaurant_name} 
                onChange={(e) => setRestaurant_name(e.target.value)}
                />
                 <input 
                type="email" 
                placeholder="example@gmail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                />
                 <input 
                type="text" 
                placeholder="slug" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                />
                 <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                />
                 <input 
                type="password" 
                placeholder="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Loading in..." : "Register"}
                </button>
                
            </form>

        </div>
    );
    

}

export default Register;