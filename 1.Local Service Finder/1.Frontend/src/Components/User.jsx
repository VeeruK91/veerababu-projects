import "./User.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const User = () => {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("profile");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [bookedProviders, setBookedProviders] = useState([]);
  const [providers, setProviders] = useState([]);

  const loadUser = async () => {
    const username = localStorage.getItem("username");

    const res = await axios.get(
      `http://127.0.0.1:8000/api/userdetails/?username=${username}`
    );

    if (res.data.user) {
      setUser(res.data.user);
    }
  };

  const loadProviders = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/services/");
    setProviders(res.data.services);
  };

  const loadBookedProviders = async () => {
    const username = localStorage.getItem("username");

    const res = await axios.get(
      `http://127.0.0.1:8000/api/booked-providers/?username=${username}`
    );

    setBookedProviders(res.data.booked.map(b => b.provider_username));
  };

  useEffect(() => {
    loadUser();
    loadProviders();
    loadBookedProviders();
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
          onClick={() => setSection("profile")}
        >
          My Profile
        </button>

        <button
          id="details-btn"
          onClick={() => setSection("view")}
        >
          View Services
        </button>

        <button
          id="details-btn"
          onClick={() => setSection("ratings")}
        >
          Give Ratings
        </button>


          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2>User Page</h2>

        {section === "profile" && user && (
          <div className="section-box">
            <h3>Your Profile</h3>
            <table border="1" id="admin-table">
              <tbody>
                <tr><th>Username</th><td>{user.username}</td></tr>
                <tr><th>Email</th><td>{user.email}</td></tr>
                <tr><th>Mobile</th><td>{user.mobile}</td></tr>
                <tr><th>Address</th><td>{user.address}</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {section === "view" && (
          <div className="section-box">
            <h3>Available Service Providers</h3>
            <table border="1" id="admin-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr><td colSpan="4">No providers found</td></tr>
                ) : (
                  providers.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.username}</td>
                      <td>{p.service_name || "N/A"}</td>
                      <td>{p.price || "N/A"}</td>
                      <td>
                        <button
                          style={{
                            background: p.booked ? "green" : "",
                            color: p.booked ? "white" : "",
                            cursor: p.booked ? "not-allowed" : "pointer"
                          }}
                          disabled={p.booked}
                          onClick={async () => {
                            const user = localStorage.getItem("username");

                            const res = await axios.post(
                              "http://127.0.0.1:8000/api/book/",
                              {
                                user,
                                provider: p.username,
                                service_name: p.service_name,
                                price: p.price
                              }
                            );

                            alert(res.data.success);

                            const updated = [...providers];
                            updated[idx].booked = true;
                            setProviders(updated);

                         
                            setBookedProviders(prev => [...prev, p.username]);
                          }}
                        >
                          {p.booked ? "Booking Confirmed" : "Book"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {section === "ratings" && (
          <div className="section-box1 rating-container">
            <h3 className="profile-h3">Give Rating</h3>

            <form
              className="rating-form1"
              onSubmit={async (e) => {
                e.preventDefault();

                const user = localStorage.getItem("username");

                if (!bookedProviders.includes(selectedProvider)) {
                  alert("You cannot rate this provider because you have not booked their service.");
                  return;
                }

                const res = await axios.post(
                  "http://127.0.0.1:8000/api/rating/",
                  { provider: selectedProvider, user, rating, feedback }
                );

                alert(res.data.success || res.data.message);

                setSelectedProvider("");
                setRating("");
                setFeedback("");
              }}
            >
              <select
                required
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                <option value="">Select Service Provider</option>
                {providers.map((p, i) => (
                  <option key={i} value={p.username}>{p.username}</option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                max="5"
                placeholder="Rating 1–5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />

              <textarea
                placeholder="Write your feedback…"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>

              <button type="submit">Submit Rating</button>
            </form>
          </div>
        )}
      </main>

      <footer>
        <h4>© 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default User;
