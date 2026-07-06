<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import User from './pages/User'
import Senha from './pages/Senha'
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
>>>>>>> feature/auth

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<<<<<<< HEAD
        <Route path="/home" element={<Home />} />
        <Route path='/user' element={<User />} />
        <Route path='/senha' element={<Senha />} />
=======
>>>>>>> feature/auth
      </Routes>
    </BrowserRouter>
  );
}

export default App;