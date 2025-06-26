// src/components/ProfileForm.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("userId"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    bio: "",
    linkedin: "",
    github: "",
    skills: "",
    image: null,
  });

  const [profileId, setProfileId] = useState(null);

  // Load profile if it already exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/profiles/", {
          headers: { Authorization: `Token ${token}` },
        });
        const userProfile = res.data.find((profile) => profile.user === userId);
        if (userProfile) {
          setFormData({ ...userProfile });
          setProfileId(userProfile.id);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token, userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sendData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) sendData.append(key, value);
    });

    try {
      if (profileId) {
        // Update
        await axios.put(`http://localhost:8000/api/profiles/${profileId}/`, sendData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create
        await axios.post("http://localhost:8000/api/profiles/", sendData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      navigate("/profile");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <div className="container mt-4 col-md-8">
      <h2 className="mb-4 text-center">{profileId ? "Edit" : "Create"} Profile</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        {["name", "email", "age", "phone", "address", "bio", "linkedin", "github", "skills"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              className="form-control"
              value={formData[field] || ""}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="mb-3">
          <label className="form-label">Profile Image</label>
          <input type="file" name="image" className="form-control" onChange={handleChange} />
        </div>
        <button className="btn btn-primary w-100">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;
