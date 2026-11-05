import "./Admin.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [providers, setProviders] = useState([]);

    const [showUsers, setShowUsers] = useState(true);
    const [showProviders, setShowProviders] = useState(false);

    
    const loadUsers = async () => {
        const res = await axios.get("http://127.0.0.1:8000/api/admin/users/");
        setUsers(res.data.users);
    };

    
    const loadProviders = async () => {
        const res = await axios.get("http://127.0.0.1:8000/api/admin/providers/");
        setProviders(res.data.providers);
    };

    useEffect(() => {
        loadUsers();
        loadProviders();
    }, []);

    
    const approveUser = async (username) => {
        const res = await axios.post("http://127.0.0.1:8000/api/approve/user/", { username });
        alert(res.data.success);
        loadUsers();
    };

    
    const approveProvider = async (username) => {
        const res = await axios.post("http://127.0.0.1:8000/api/approve/provider/", { username });
        alert(res.data.success);
        loadProviders();
    };

    return (
        <>
            <header>
                <div id="brand-name"><h1>Local Service Finder</h1></div>

                <div className="components">
                    <NavLink to="/">Home</NavLink>

                   <button
                    id="details-btn"
                    onClick={() => {
                        setShowUsers(true);
                        setShowProviders(false);
                    }}
                    >
                    User Details
                    </button>

                    <button
                    id="details-btn"
                    onClick={() => {
                        setShowProviders(true);
                        setShowUsers(false);
                    }}
                    >
                    Service Providers
                    </button>

                    <NavLink to="/login">Logout</NavLink>
                </div>
            </header>

            <main>
                <h2>Admin Dashboard</h2>

                
                {showUsers && (
                
                    <table id="admin-table" border="1">
                        <caption>Users Table</caption>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Mobile</th>                              
                                <th>Approved</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u, i) => (
                                <tr key={i}>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.mobile}</td>
                                    <td>{u.approved}</td>
                                    <td>
                                        {u.approved === 0 ? (
                                            <button id="approve-btn" onClick={() => approveUser(u.username)}>
                                                Approve
                                            </button>
                                        ) : "Approved"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                
                {showProviders && (
  <table id="admin-table" border="1">
    <caption>Providers Table</caption>
    <thead>
      <tr>
        <th>Provider name</th>
        <th>Email</th>
        <th>Mobile</th>
        <th>Approved</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {providers
        .filter(p => p.username !== "admin")
        .map((p, i) => (
          <tr key={i}>
            <td>{p.username}</td>
            <td>{p.email}</td>
            <td>{p.mobile}</td>
            <td>{p.approved}</td>
            <td>
              {p.approved === 0 ? (
                <button
                  id="approve-btn"
                  onClick={() => approveProvider(p.username)}
                >
                  Approve
                </button>
              ) : "Approved"}
            </td>
          </tr>
        ))}
    </tbody>
  </table>
)}


            </main>

            <footer>
                <h4>© 2026 All Rights Reserved SAK Informatics</h4>
            </footer>
        </>
    );
};

export default Admin;
