import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './utils/PrivateRoute'
import Home from './pages/Home'
  import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout'
import TopUp from './pages/TopUp'
import Transaction from './pages/Transaction'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
       <Routes>
        <Route element={<PrivateRoute/>}>
          <Route element={<Layout/>}>
            <Route path="/" element={<Home/>} />
            <Route path="/topup" element={<TopUp/>} />
            <Route path="/transaction" element={<Transaction/>} />
            <Route path="/profile" element={<Profile/>} /> 
            <Route path="/profile/edit" element={<ProfileEdit/>} />
            <Route path="*" element={<div className="p-4">Page Not Found</div>} />       
          </Route>
          
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
    
  )
}

export default App
