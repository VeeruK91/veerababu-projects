import "./Register.css";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    mobile: "",
    address: "",
    role: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://127.0.0.1:8000/api/register/", form);

    if (res.data.error) {
      setMsgType("error");
      setMessage(res.data.error);
    } else {
      setMsgType("success");
      setMessage(res.data.success);
    }
  };

  return (
    <>
      <main>
        <h2>Register</h2>

        {message && <p className={`msg ${msgType}`}>{message}</p>}

        <form onSubmit={handleSubmit}>
          
          <div className="row">
            <label>Name:</label>
            <input
              type="text"
              name="username"
              autoFocus
              placeholder="Enter User Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Re-enter password"
              onChange={handleChange}
              required
            />
          </div>

          
        <div className="row role-row">
            <label>Role:</label>

            <div className="role-box">
              <label className="role-option">
                <input 
                  type="radio" 
                  name="role" 
                  value="user"
                  required
                  onChange={handleChange}
                />
                User
              </label>
              
              <label className="role-option">
                <input 
                  type="radio" 
                  name="role" 
                  value="serviceprovider"
                  onChange={handleChange}
                />
                Service Provider
              </label>
            </div>
          </div>

          <div className="row">
            <label>Mobile Number:</label>
            <input 
                type="tel"
                name="mobile"
                inputMode="numeric" 
                  maxLength="10"
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits"
                placeholder="Enter mobile number"
                onChange={handleChange}
                required
              />
          </div>

          <div className="row">
            <label>Address:</label>
            <textarea
              name="address"
              rows="2"
              placeholder="Enter full address"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button id="btn-sub" type="submit">Submit</button>
        </form>
      </main>

      
    </>
  );
};

export default Register;
