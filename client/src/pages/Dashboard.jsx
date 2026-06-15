import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import api from "../utils/api";

function Dashboard() {
    const [restaurant, setRestaurant] = useState(null);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [restaurantRes, categoriesRes, itemsRes] = await Promise.all([
                    api.get("/restaurants/profile"),
                    api.get("/categories"),
                    api.get("/items"),
                ]);

                setRestaurant(restaurantRes.data);
                setCategories(categoriesRes.data);
                setItems(itemsRes.data);


            } catch(err){
                setError("Failed to load Dahboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addCategory = async (e) => {
        try {
            const response = await api.post("/categories/add", {name: newCategory});
            setCategories([...categories, response.data]);
            setNewCategory("");
        } catch(err){
            setError("Failed to add category");
        }
    };

    const deleteCategory = async (e) => {
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter((cat) => cat.id !== id));

        } catch(err){
            setError("Failed to delete category");
        }
    };

    if(loading) return <p>Loading...</p>;
    if(error) return <p>{error}</p>;

    return (
        <div>
            <h1>{restaurant?.name}</h1>
            <h2>Categories</h2>
            {categories.map((category) => (
                <p key={category.id}> {category.name}</p>
            ))}

            <h2>Menu Items</h2>
            {items.map((item) => (
                <div key={item.id}>
                    <p>{item.name}</p>
                    <p>{item.price}</p>
                    <p>{item.is_available ? "Available" : "unavailable"}</p>
                </div>
            ))}
        

        <div>
            <input type="text" placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}/>
            <button onClick={addCategory}>Add Category</button>
            {categories.map((category) => (
                <div key={category.id}>
                    <p>{category.name}</p>
                    <button onClick={() => deleteCategory(category.id)}>Delete</button>

                </div>
            ))}
        </div>

        </div>



    );
   
    
}

export default Dashboard;

