// import { CreateLogin, UpdateLogin } from "./components/login";
import { Routes, Route } from "react-router-dom"
import './App.css';
import HomePage from "./pages/HomePage";
import Data from "./components/RegisterData";
import LoginData from "./components/LoginData";
function App() {
  return (
    <Routes>
      <Route path="/" exact element={<HomePage />}/>
      <Route path="/register" element={<Data />} />
      <Route path="/login" element={<LoginData/>} />
    </Routes>
  );
}

export default App;
