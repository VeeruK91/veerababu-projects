import "./Login.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        data
      );

      
      if (
        res.data.error ===
        "Your account was removed due to low ratings. You cannot login again."
      ) {
        setMsgType("error");
        setMessage("Your account was removed due to low ratings. You cannot login again.");
        return;
      }

      
      if (
        res.data.error === "User account not approved" ||
        res.data.error === "Provider account not approved"
      ) {
        setMsgType("error");
        setMessage("Awaiting admin approval");
        return;
      }

      
      if (res.data.role === "admin") {
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", "admin");
        navigate("/admin");
        return;
      }

      
      if (res.data.role === "user") {
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", "user");
        navigate("/user");
        return;
      }

      
      if (res.data.role === "serviceprovider") {
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", "serviceprovider");
        navigate("/serviceprovider");
        return;
      }

      setMsgType("error");
      setMessage("Invalid Credentials");

    } catch (err) {
      setMsgType("error");
      setMessage("Invalid username or password");
    }
  };

  return (
    <>
      <main>
        <h2>Login</h2>

        {message && (
          <p className={`msg ${msgType}`} style={{ textAlign: "center" }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              name="username"
              autoFocus
              placeholder="Enter User Name"
              type="text"
              onChange={(e) =>
                setData({ ...data, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              name="password"
              type="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" id="log-btn">
            Submit
          </button>
        </form>
      </main>

      
    </>
  );
};

export default Login;
