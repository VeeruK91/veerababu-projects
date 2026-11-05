import "./ServiceProvider.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const ServiceProvider = () => {
  const [provider, setProvider] = useState(null);
  const [section, setSection] = useState("profile"); 
  const [bookings, setBookings] = useState([]);
  const [ratings, setRatings] = useState([]);

  const loadProvider = async () => {
    const username = localStorage.getItem("username");
    const res = await axios.get(
      `http://127.0.0.1:8000/api/providerdetails/?username=${username}`
    );
    setProvider(res.data.provider);
  };
 const loadBookings = async () => {
   const provider = localStorage.getItem("username");

  const res = await axios.get(
    `http://127.0.0.1:8000/api/provider-bookings/?username=${provider}`
  );

  setBookings(res.data.bookings);
};

  const loadRatings = async () => {
  const provider = localStorage.getItem("username");

  const res = await axios.get(
    `http://127.0.0.1:8000/api/provider-ratings/?username=${provider}`
  );

  setRatings(res.data.ratings);
};

  useEffect(() => {
    loadProvider();
    loadBookings();
     loadRatings();
  }, []);

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Local Service Finder</h1>
        </div>
        <div className="components">
          <NavLink to="/">Home</NavLink>
          <button
            id="details-btn"
            onClick={() =>
              setSection("profile")}>  My Profile </button>
          <button
            id="details-btn"
            onClick={() =>
              setSection("addservice") } > Add Service </button>
          <button
            id="details-btn"
            onClick={() =>
              setSection("bookings")}>  Receive Bookings </button>
          <button
            id="details-btn"
            onClick={() =>
              setSection("ratings") } >  Ratings  </button>

          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>
      <main>
        <h2>Service Provider Page</h2>
        {section === "profile" && provider && (
          <div className="section-box">
            <h3 className="profile-h3">Your Profile</h3>
            <table border="1" id="provider-table">
              <tbody>
                <tr>
                  <th>Username</th>
                  <td>{provider.username}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{provider.email}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{provider.mobile}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{provider.address}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      {section === "addservice" && (
  <div className="section-box">
    <h3 className="profile-h3">Add Your Service</h3>

    <form className="service-form"
      onSubmit={async (e) => {
        e.preventDefault();

        const provider = localStorage.getItem("username");
        const service_name = e.target.service_name.value;
        const price = e.target.price.value;
        const description = e.target.description.value;

        const res = await axios.post(
          "http://127.0.0.1:8000/api/addservice/",
          { provider, service_name, price, description }
        );

        alert(res.data.success);
        e.target.reset();
      }}
    >
      <input name="service_name" type="text" placeholder="Service Name" required />
      <input name="price" type="number" placeholder="Price" required />
      <textarea name="description" placeholder="Description" required></textarea>
      <br />
      <button>Add Service</button>
    </form>
  </div>
)}


 {section === "bookings" && (
      <div className="section-box">
        <h3 className="profile-h3">Bookings Received</h3>

    {bookings.length === 0 ? (
      <p>No bookings yet.</p>
    ) : (
      <table border="1" id="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Service</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b, i) => (
            <tr key={i}>
              <td>{b.user_username}</td>
              <td>{b.service_name}</td>
              <td>{b.price}</td>
            </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>)}

       {section === "ratings" && (
  <div className="section-box">
    <h3 className="profile-h3">Ratings From Users</h3>

    {ratings.length === 0 ? (
      <p>No ratings yet.</p>
    ) : (
      <table border="1" id="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Rating</th>
            <th>Feedback</th>
          </tr>
        </thead>

        <tbody>
          {ratings.map((r, i) => (
            <tr key={i}>
              <td>{r.user_username}</td>
              <td>{r.rating}</td>
              <td>{r.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

      </main>
      <footer>
        <h4>&copy; 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};
export default ServiceProvider;