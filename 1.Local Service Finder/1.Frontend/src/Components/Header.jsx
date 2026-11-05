import "./Header.css"
import { NavLink } from "react-router-dom"

const Header=()=>{
    return(<>
    <header>
        <div id="brand-name"><h1>Local Service Finder</h1></div>
        <div className="components">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
        </div>
    </header>
     <footer>
             <h4>&copy; 2026 All Rights Reserved SAK Informatics</h4>
        </footer>
    </>)
}
export default Header