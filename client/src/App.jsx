import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<h1>Landing Page</h1>}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/menu/:slug" element={<Menu/>}/>
      </Routes>
      </BrowserRouter>
    
  );
}
export default App;