import './App.css'
import {Routes,Route,useLocation} from "react-router-dom"
import Header from './Components/Header'
import Home from './Components/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import User from './Components/User'
import Admin from './Components/Admin'
import ServiceProvider from './Components/ServeceProvider'
function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/admin", "/user"];
  return (<>
  
      {!hideHeaderRoutes.includes(location.pathname) && <Header/>}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin/> }/>
      <Route path="/user" element={ <User/>}/>
      <Route path="/serviceprovider" element={<ServiceProvider/>}/>
      
    </Routes> 
  </>
   
    
  )
}

export default App
