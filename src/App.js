// import { CreateLogin, UpdateLogin } from "./components/login";
import { Routes, Route } from "react-router-dom"
import './App.css';
import HomePage from "./pages/HomePage";
import Data from "./components/RegisterData";
import LoginData from "./components/LoginData";
import MyProjects from "./pages/MyProjects";
import { CreateProjects, UpdateProjects } from "./pages/ProjectDetails.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" exact element={<HomePage />}/>
      <Route path="/register" element={<Data />} />
      <Route path="/login" element={<LoginData/>} />
      <Route path="/projects" element={<MyProjects />} />
      <Route path="/projects/create" element={<CreateProjects />} />
      <Route path="/projects/update/:id" element={<UpdateProjects />} />
    </Routes>
  );
}

export default App;
