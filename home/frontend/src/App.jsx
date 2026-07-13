import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import User from './pages/User'
import Senha from './pages/Senha'
import RutaProtegida from './components/RutaProtegida'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route
          path='/user'
          element={
            <RutaProtegida>
              <User />
            </RutaProtegida>
          }
        />
        <Route path='/senha' element={<Senha />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App