import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import QRCode from "react-qr-code";

function Dashboard() {
    const [restaurant, setRestaurant] = useState(null);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category_id: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchData();
    }, []);

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
        } catch (err) {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    
    const addCategory = async () => {
        try {
            const response = await api.post("/categories/add", { name: newCategory });
            setCategories([...categories, response.data]);
            setNewCategory("");
        } catch (err) {
            setError("Failed to add category");
        }
    };

    
    const editCategory = async (id) => {
        try {
            const response = await api.put(`/categories/${id}`, { name: editCategoryName });
            setCategories(categories.map((cat) => 
                cat.id === id ? response.data : cat
            ));
            setEditCategoryId(null);
            setEditCategoryName("");
        } catch (err) {
            setError("Failed to edit category");
        }
    };

    
    const deleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter((cat) => cat.id !== id));
        } catch (err) {
            setError("Failed to delete category");
        }
    };

    
    const addItem = async () => {
        try {
            const response = await api.post("/items/add", newItem);
            setItems([...items, response.data]);
            setNewItem({
                name: "",
                description: "",
                price: "",
                image_url: "",
                category_id: "",
            });
        } catch (err) {
            setError("Failed to add item");
        }
    };

    
    const deleteItem = async (id) => {
        try {
            await api.delete(`/items/${id}`);
            setItems(items.filter((item) => item.id !== id));
        } catch (err) {
            setError("Failed to delete item");
        }
    };

    
    const toggleAvailability = async (id) => {
        try {
            const response = await api.put(`/items/${id}/toggle`);
            setItems(items.map((item) =>
                item.id === id ? response.data : item
            ));
        } catch (err) {
            setError("Failed to toggle availability");
        }
    };

    
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div>
                <h1>{restaurant?.name}</h1>
                <button onClick={logout}>Logout</button>
            </div>
            <div>
                <h2>Your QR Code</h2>
                <p>Customers scan this to see your menu</p>
                <QRCode value={`http://192.168.1.5:5173/menu/${restaurant?.slug}`} size={200}/>
            </div>

            
            <div>
                <h2>Categories</h2>
                {categories.map((category) => (
                    <div key={category.id}>
                        {editCategoryId === category.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editCategoryName}
                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                />
                                <button onClick={() => editCategory(category.id)}>Save</button>
                                <button onClick={() => setEditCategoryId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>{category.name}</p>
                                <button onClick={() => {
                                    setEditCategoryId(category.id);
                                    setEditCategoryName(category.name);
                                }}>Edit</button>
                                <button onClick={() => deleteCategory(category.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}

                
                <input
                    type="text"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={addCategory}>Add Category</button>
            </div>

            
            <div>
                <h2>Menu Items</h2>
                {items.map((item) => (
                    <div key={item.id}>
                        <p>{item.name}</p>
                        <p>{item.price} ETB</p>
                        <p>{item.is_available ? "Available" : "Unavailable"}</p>
                        <button onClick={() => toggleAvailability(item.id)}>
                            {item.is_available ? "Mark Unavailable" : "Mark Available"}
                        </button>
                        <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </div>
                ))}

                
                <h3>Add New Item</h3>
                <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={newItem.image_url}
                    onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                />
                <select
                    value={newItem.category_id}
                    onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <button onClick={addItem}>Add Item</button>
            </div>
        </div>
    );
}

export default Dashboard;