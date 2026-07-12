import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import User from './pages/User'
import Senha from './pages/Senha'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path='/user' element={<User />} />
        <Route path='/senha' element={<Senha />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App