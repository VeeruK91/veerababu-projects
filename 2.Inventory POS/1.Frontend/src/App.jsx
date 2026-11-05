import './App.css'
import {Routes,Route,useLocation} from "react-router-dom"
import Header from './Components/Header'
import Home from './Components/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import User from './Components/User'
import Admin from './Components/Admin'
import Staff from './Components/Staff'
function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/admin", ];
  return (<>
  
      {!hideHeaderRoutes.includes(location.pathname) && <Header/>}

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin/> }/>
      <Route path="/user" element={ <User/>}/>
      <Route path="/staff" element={<Staff/>}/>
      
    </Routes> 
  </> )}
export default App