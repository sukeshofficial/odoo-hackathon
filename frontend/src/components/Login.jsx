import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [emailStatus, setEmailStatus] = useState("");
  const navigate = useNavigate();

  async function checkEmail(emailValue) {
    if (!emailValue.includes("@")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/user-by-email?email=${emailValue}`
      );

      if (response.status === 200) {
        const data = await response.json();
        setUserProfile(data);
        setEmailStatus("User found");
      } else {
        setUserProfile(null);
        setEmailStatus("User not found");
      }
    } catch (err) {
      console.error("Email lookup failed");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Unable to connect to server");
    }
  }

  console.log("userProfile state:", userProfile);

  return (
    <div className="page">
      <div className="card">
        {userProfile && (
          <p style={{ textAlign: "center", marginBottom: "10px" }}>
            Welcome back, {userProfile.firstName}
          </p>
        )}

        <div
          className="avatar"
          style={{
            backgroundImage: userProfile?.profilePhoto
              ? `url(http://localhost:5000${userProfile.profilePhoto})`
              : undefined,

            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <input
          type="text"
          name="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            checkEmail(e.target.value);
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
