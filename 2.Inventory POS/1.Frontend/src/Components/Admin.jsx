import "./Admin.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    stock: "",
  })
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const loadUsers = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/admin/users/");
    setUsers(res.data.users || []);};
  const loadStaff = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/admin/staff/");
    setStaff(res.data.staff || []);};
  const loadProducts = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/products/");
    setProducts(res.data.products || []);};
  const loadSales = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/all-sales/");
    setSales(res.data.sales || []);};
  useEffect(() => {
    loadUsers();
    loadStaff();
    loadProducts();
    loadSales();}, []);
  const approveUser = async (username) => {
    await axios.post("http://127.0.0.1:8000/api/approve/user/", { username });
    loadUsers();};
  const approveStaff = async (username) => {
    await axios.post("http://127.0.0.1:8000/api/approve/staff/", { username });
    loadStaff();};
  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });};
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: productForm.name,
      price: productForm.price,
      stock: productForm.stock,
      id: editProductId,};
    if (isEditing) {
      await axios.post("http://127.0.0.1:8000/api/update-product/", payload);
    } else {
      await axios.post("http://127.0.0.1:8000/api/add-product/", payload); }
    setProductForm({ name: "", price: "", stock: "" });
    setIsEditing(false);
    setEditProductId(null);
    loadProducts();
  };

  const handleEditProduct = (p) => {
    setIsEditing(true);
    setEditProductId(p.id);
    setProductForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
    });
    setActiveSection("products");
  };

  const handleDeleteProduct = async (id) => {
    await axios.post("http://127.0.0.1:8000/api/delete-product/", { id });
    loadProducts();
  };

  return (
    <>
      <header>
        <div id="brand-name"><h1>Inventory Point of Sale System</h1></div>
        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main >
      <div className="adminPage-layout">
         <div className="bubble-area">
              <div className="float-text">admin</div>
              <div className="float-text">admin</div>
              <div className="float-text">admin</div>
              <div className="float-text">admin</div>
              <div className="float-text">admin</div>  
              </div>

        
        <aside className="adminPage-sidebar">
          <button className={activeSection === "dashboard" ? "active" : ""} onClick={() => setActiveSection("dashboard")}>Dashboard</button>
          <button className={activeSection === "users" ? "active" : ""} onClick={() => setActiveSection("users")}>Users</button>
          <button className={activeSection === "staff" ? "active" : ""} onClick={() => setActiveSection("staff")}>Staff</button>
          <button className={activeSection === "products" ? "active" : ""} onClick={() => setActiveSection("products")}>Products</button>
          <button className={activeSection === "sales" ? "active" : ""} onClick={() => setActiveSection("sales")}>Sales</button>
          <button className={activeSection === "notifications" ? "active" : ""} onClick={() => setActiveSection("notifications")}> Notifications</button>

        </aside>

        
        <section className="adminPage-content">

          
          {activeSection === "dashboard" && (
            <>
              <h2>Admin Dashboard</h2>

              <div className="adminPage-cards">
                <div className="adminPage-card"><h3>Total Users</h3><p>{users.length}</p></div>
                <div className="adminPage-card"><h3>Total Staff</h3><p>{staff.length}</p></div>
                <div className="adminPage-card"><h3>Total Products</h3><p>{products.length}</p></div>
                <div className="adminPage-card"><h3>Total Sales</h3><p>{sales.length}</p></div>
              </div>
            </>
          )}

         
          {activeSection === "users" && (
            <>
              <h2>User Details</h2>
              <table className="adminPage-table">
                <thead>
                  <tr>
                    <th>Username</th><th>Email</th><th>Mobile</th><th>Approved</th><th>Action</th>
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
                          <button className="adminPage-approveBtn" onClick={() => approveUser(u.username)}>Approve</button>
                        ) : "Approved"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          
          {activeSection === "staff" && (
            <>
              <h2>Service Staff</h2>
              <table className="adminPage-table">
                <thead>
                  <tr>
                    <th>Staff Name</th><th>Email</th><th>Mobile</th><th>Approved</th><th>Action</th>
                  </tr>
                </thead>
<tbody>
  {staff
    .filter((s) => s.username !== "admin")
    .map((s, i) => (
      <tr key={i}>
        <td>{s.username}</td>
        <td>{s.email}</td>
        <td>{s.mobile}</td>
        <td>{s.approved}</td>
        <td>
          {s.approved === 0 ? (
            <button onClick={() => approveStaff(s.username)}>Approve</button>
          ) : "Approved"}
        </td>
      </tr>
    ))}
</tbody>

              </table>
            </>
          )}

         
          {activeSection === "products" && (
            <>
              <h2>Manage Products</h2>

              <div className="adminPage-formBox">
                <form className="adminPage-form" onSubmit={handleProductSubmit}>
                  <input type="text" name="name" placeholder="Product Name" value={productForm.name} onChange={handleProductChange} required />
                  <input type="number" name="price" placeholder="Price" value={productForm.price} onChange={handleProductChange} required />
                  <input type="number" name="stock" placeholder="Stock" value={productForm.stock} onChange={handleProductChange} required />

                  <button type="submit">{isEditing ? "Update" : "Add Product"}</button>

                  {isEditing && (
                    <button type="button" className="cancel-btn" onClick={() => { setIsEditing(false); setEditProductId(null); }}>Cancel</button>
                  )}
                </form>
              </div>

              <table className="adminPage-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="5">No products found</td></tr>
                  ) : (
                    products.map((p, i) => (
                      <tr key={i}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.stock}</td>
                        <td>
                          <button className="adminPage-editBtn" onClick={() => handleEditProduct(p)}>Edit</button>&nbsp;
                          <button className="adminPage-deleteBtn" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}

         
          {activeSection === "sales" && (
            <>
              <h2>Sales Report (By Staff)</h2>
              <table className="adminPage-table">
                <thead>
                  <tr>
                    <th>Staff</th><th>Product</th><th>Qty</th><th>Total Price</th><th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {sales.length === 0 ? (
                    <tr><td colSpan="5">No sales recorded yet</td></tr>
                  ) : (
                    sales.map((s, i) => (
                      <tr key={i}>
                        <td>{s.staff_username}</td>
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

         
{activeSection === "notifications" && (
  <>
    <h2>Low Stock Notifications</h2>

    {products.filter((p) => p.stock < 5).length === 0 ? (
      <p className="no-warning">All products have enough stock ✔</p>
    ) : (
      <div className="warning-box">
        <h3>⚠ Low Stock Alert!</h3>
        <p>The following products need restocking:</p>

        <table className="adminPage-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products
              .filter((p) => p.stock < 5)
              .map((p, i) => (
                <tr key={i}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {p.stock}
                  </td>
                  <td>
                    <button
                      className="adminPage-editBtn"
                      onClick={() => handleEditProduct(p)}
                    >
                      Add Stock
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>)}</>)}
        </section>
        </div>
      </main>
      <footer>
        <h4>© 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>);};

export default Admin;
