import { useState } from "react";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("additionalInfo", additionalInfo);
      formData.append("password", password);

      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        const data = await response.json();
        alert(data.message || "Registration successful");
      } else if (response.status === 409) {
        alert("User already exists");
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message || "Validation error");
      } else {
        alert("Server error");
      }
    } catch (error) {
      alert("Unable to connect to server");
    }
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];

    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="page">
      <div className="card" style={{ width: "500px" }}>
        <div
          className="avatar"
          onClick={() => document.getElementById("photoInput").click()}
          style={{
            backgroundImage: photoPreview ? `url(${photoPreview})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
        >
          <input
            id="photoInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>

        <div className="grid">
          <input
            className="input"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="grid-single">
          <input
            className="input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid">
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="input"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid">
          <input
            className="input"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            className="input"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <textarea
          className="textarea"
          placeholder="Additional Information..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />

        <button
          className="btn"
          style={{ marginTop: "15px" }}
          onClick={handleRegister}
        >
          Register User
        </button>
      </div>
    </div>
  );
}
