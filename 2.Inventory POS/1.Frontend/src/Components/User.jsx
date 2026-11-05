import "./User.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const User = () => {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("dashboard");

  const [products, setProducts] = useState([]);
  const [mySales, setMySales] = useState([]);

  const [buyProductId, setBuyProductId] = useState("");
  const [buyQty, setBuyQty] = useState("");

 
  const loadUser = async () => {
    const username = localStorage.getItem("username");

    const res = await axios.get(
      `http://127.0.0.1:8000/api/userdetails/?username=${username}`
    );

    if (res.data.user) setUser(res.data.user);
  };

  
  const loadProducts = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/products/");
    setProducts(res.data.products || []);
  };

 
  const loadMySales = async () => {
    const username = localStorage.getItem("username");
    const res = await axios.get(
  `http://127.0.0.1:8000/api/sales/user/?username=${username}`
   );
    setMySales(res.data.sales || []);
  };

  useEffect(() => {
    loadUser();
    loadProducts();
    loadMySales();
  }, []);

  
  const handleBuyProduct = async () => {
    const staff = null; 
    const username = user.username;

    if (!buyProductId || !buyQty) {
      alert("Please select a product and quantity");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/products/sell/", {
        staff: null,
        user: username,
        product_id: buyProductId,
        quantity: buyQty,
      });

      alert("Purchase Successful!");

      setBuyProductId("");
      setBuyQty("");

      loadProducts();
      loadMySales();
    } catch (err) {
      alert(err.response?.data?.error || "Error buying product");
    }
  };

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Inventory Point of Sale System</h1>
        </div>

        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main >
        <div className="user-layout">

       
        
        <aside className="user-sidebar">
          <button
            className={section === "dashboard" ? "active" : ""}
            onClick={() => setSection("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={section === "products" ? "active" : ""}
            onClick={() => setSection("products")}
          >
            View Products
          </button>

          <button
            className={section === "buy" ? "active" : ""}
            onClick={() => setSection("buy")}
          >
            Buy Product
          </button>

          <button
            className={section === "history" ? "active" : ""}
            onClick={() => setSection("history")}
          >
            My Purchase History
          </button>
           <button
          
            onClick={() =>
              setSection(section === "profile" ? "dashboard" : "profile")
            }
          >
            My Profile
          </button>
        </aside>

        
        <section className="user-content">
          
          {section === "dashboard" && (
            <>
              <h2>User Dashboard</h2>
              <p className="welcome-text">
                Welcome, <strong>{user?.username}</strong> 👋
              </p>
            </>
          )}

         
          {section === "profile" && user && (
            <div className="user-box">
              <h2>My Profile</h2>
              <table className="user-table">
                <tbody>
                  <tr>
                    <th>Username</th>
                    <td>{user.username}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <th>Mobile</th>
                    <td>{user.mobile}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{user.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          
          {section === "products" && (
            <>
              <h2>Available Products</h2>
              <table className="user-table">
                <thead>
                  <tr>
                   
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i}>
                     
                      <td>{p.name}</td>
                      <td>{p.price}</td>
                      <td>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

         
          {section === "buy" && (
            <div className="user-box">
              <h2>Buy Product</h2>

              <select
                value={buyProductId}
                onChange={(e) => setBuyProductId(e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={buyQty}
                onChange={(e) => setBuyQty(e.target.value)}
              />

              <button onClick={handleBuyProduct}>Buy Now</button>
            </div>
          )}

          
          {section === "history" && (
            <>
              <h2>My Purchase History</h2>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total Price</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {mySales.length === 0 ? (
                    <tr>
                      <td colSpan="4">No purchases yet</td>
                    </tr>
                  ) : (
                    mySales.map((s, i) => (
                      <tr key={i}>
                        <td>{s.product_name}</td>
                        <td>{s.quantity}</td>
                        <td>{s.total_price}</td>
                        <td>{s.sale_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </section>
        <div className="bubble-area">
              <div className="float-text">{user?.username}</div>
              <div className="float-text">{user?.username}</div>
              <div className="float-text">{user?.username}</div>
              <div className="float-text">{user?.username}</div>
              <div className="float-text">{user?.username}</div>  
              </div>
               </div>
      </main>

      <footer>
        <h4>© 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default User;

 