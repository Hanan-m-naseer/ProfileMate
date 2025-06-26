import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      setError("Invalid user ID. Please login again.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/profiles/", {
          headers: { Authorization: `Token ${token}` },
        });

        const userProfile = res.data.find((profile) => profile.user === userId);
        if (userProfile) setProfile(userProfile);
        else setError("No profile found for this user.");
      } catch (err) {
        setError("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f3e7e9, #e3eeff)",
        padding: "20px",
      }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px", borderRadius: "15px", background: "#fff" }}>
        <div className="text-center">
          {profile.image && (
            <img
              src={profile.image}
              alt="Profile"
              className="rounded-circle mb-3"
              style={{
                width: "130px",
                height: "130px",
                objectFit: "cover",
                border: "3px solid rgb(17, 16, 18)"
              }}
            />
          )}
          <h4 className="text-dark">{profile.name}</h4>
        </div>

        <hr />

        <div className="mt-3">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>GitHub:</strong> <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a></p>
          <p><strong>LinkedIn:</strong> <a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin}</a></p>
          <p><strong>Skills:</strong> {profile.skills}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
