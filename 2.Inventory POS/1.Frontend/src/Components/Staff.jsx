import "./Staff.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const Staff = () => {
  const [staff, setStaff] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

 
  const [sellProductId, setSellProductId] = useState("");
  const [sellQty, setSellQty] = useState("");
  const [sellUser, setSellUser] = useState("");

  
  const loadStaff = async () => {
    const username = localStorage.getItem("username");
    const res = await axios.get(
      `http://127.0.0.1:8000/api/staffdetails/?username=${username}`
    );
    setStaff(res.data.staff);
  };

  
  const loadProducts = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/products/");
    setProducts(res.data.products);
  };

  
  const loadSales = async () => {
    const username = localStorage.getItem("username");
    const res = await axios.get(
      `http://127.0.0.1:8000/api/sales/staff/?username=${username}`
    );
    setSales(res.data.sales);
  };

  useEffect(() => {
    loadStaff();
    loadProducts();
    loadSales();
  }, []);

  
  const handleSell = async (e) => {
    e.preventDefault();
    const staffName = localStorage.getItem("username");

    const res = await axios.post("http://127.0.0.1:8000/api/products/sell/", {
      staff: staffName,
      user: sellUser || null,
      product_id: sellProductId,
      quantity: sellQty,
    });

    alert(res.data.success + " | Total Amount: " + res.data.total_price);

    
    setSellProductId("");
    setSellQty("");
    setSellUser("");

    loadProducts();
    loadSales();
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
        <div className="staff-layout2">
          
              <div className="bubble-area">Staff
              <div className="float-text">Staff</div>
              <div className="float-text">Staff</div>
              <div className="float-text">Staff</div>
              <div className="float-text">Staff</div>
              <div className="float-text">Staff</div>  
              </div>
        <aside className="sidebar2">
          <button
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            My Profile
          </button>

          <button
            className={activeSection === "products" ? "active" : ""}
            onClick={() => setActiveSection("products")}
          >
            View Products
          </button>

          <button
            className={activeSection === "sell" ? "active" : ""}
            onClick={() => setActiveSection("sell")}
          >
            Sell Product
          </button>

          <button
            className={activeSection === "sales" ? "active" : ""}
            onClick={() => setActiveSection("sales")}
          >
            My Sales
          </button>
        </aside>
        <section className="staff-content">
          {activeSection === "dashboard" && (
            <>
              <h2>Staff Dashboard</h2>
              <div className="dashboard-cards2">
                <div className="dash-card2">
                  <h3>Total Products</h3>
                  <p>{products.length}</p>
                </div>

                <div className="dash-card2">
                  <h3>My Total Sales</h3>
                  <p>{sales.length}</p>
                </div>
              </div>
            </> )}
          {activeSection === "profile" && staff && (
            <div className="section-box2">
              <h2>My Profile</h2>
              <table border="1" id="provider-table">
                <tbody>
                  <tr><th>User name</th><td>{staff.username}</td></tr>
                  <tr><th>Email</th><td>{staff.email}</td></tr>
                  <tr><th>Mobile</th><td>{staff.mobile}</td></tr>
                  <tr><th>Address</th><td>{staff.address}</td></tr>
                </tbody>
              </table>
            </div>)}
          {activeSection === "products" && (
            <div className="section-box2">
              <h2>Available Products</h2>

              <table border="1" id="admin-table">
                <thead>
                  <tr>
                   
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="4">No products found</td></tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id}>
                       
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.stock}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>)}
          {activeSection === "sell" && (
            <div className="section-box2">
              <h2>Sell Product</h2>
              <form className="sell-form2" onSubmit={handleSell}>
                <select
                  required
                  value={sellProductId}
                  onChange={(e) => setSellProductId(e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={sellQty}
                  onChange={(e) => setSellQty(e.target.value)}
                  required />
                <input
                  type="text"
                  placeholder="Customer Name (optional)"
                  value={sellUser}
                  onChange={(e) => setSellUser(e.target.value)}/>
                <button type="submit">Sell Now</button>
              </form>
            </div>)}
          {activeSection === "sales" && (
            <div className="section-box2">
              <h2>My Sales</h2>
              <table border="1" id="admin-table">
                <thead>
                  <tr>
                    
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr><td colSpan="5">No sales yet</td></tr>
                  ) : (
                    sales.map((s) => (
                      <tr key={s.id}>
                        <td>{s.user_username || "Walk-in"}</td>
                        <td>{s.product_name}</td>
                        <td>{s.quantity}</td>
                        <td>{s.total_price}</td>
                        <td>{s.sale_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>)}
        </section>
        </div>
      </main>
      <footer>
        <h4>© 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};
export default Staff;