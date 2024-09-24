
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {


  return (
    <>
       <div>
        <Navbar/>
       <Routes>
       <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
    </>
  )
}

export default App
