import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

function Menu() {
    const { slug } = useParams();
    const [menu, setMenu] = useState([]);
    const [restaurant, setRestaurant] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/restaurants/${slug}`);
                setMenu(response.data);
            } catch (err) {
                setError("Menu not found");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [slug]);

    if (loading) return <p>Loading menu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Menu</h1>
            {menu.map((section) => (
                <div key={section.category}>
                    <h2>{section.category}</h2>
                    {section.items.map((item) => (
                        <div key={item.id}>
                            <p>{item.name}</p>
                            <p>{item.price} ETB</p>
                            <p>{item.is_available ? "Available" : "Unavailable"}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Menu;