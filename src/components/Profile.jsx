import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { artistName } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bio, setBio] = useState(""); // State for the bio
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const navigate = useNavigate(); // React Router navigate hook

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        setUser(userData);
        setBio(userData.data.bio || ""); // Initialize bio with existing value
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const reviewsResponse = await fetch("http://localhost:3000/api/reviews/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchUserData();
    fetchUserReviews();
  }, []);

  const handleBioSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/user/update-bio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bio");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <br />
      <div className="max-w-screen-xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* User Details */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-purple-700">User Info</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <strong>Name:</strong> {user.data.username}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {user.data.email}
            </p>
            {/* Bio Section */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-purple-700">Bio</h2>
              {isEditing ? (
                <>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    rows="4"
                    placeholder="Write something about yourself..."
                  />
                  <button
                    onClick={handleBioSave}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{bio || "No bio added yet."}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit Bio
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Reviews */}
          <div>
            <h2 className="text-2xl font-semibold text-purple-700">Reviewed Albums</h2>
            {reviews.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() =>
                      navigate(
                        `/albums/${encodeURIComponent(review.artistName)}/${encodeURIComponent(
                          review.albumName
                        )}/${review.album}`
                      )
                    } // Redirect to the detailed album route
                  >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      <strong>Album: </strong> {review.albumName}
                    </h3>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      <strong>Artist:</strong> {review.artistName}
                    </p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      <strong>Your Review:</strong> {review.reviewText}
                    </p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      <strong>Rating:</strong> {review.rating} / 5
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                You haven’t reviewed any albums yet.
              </p>
            )}
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
};

export default Profile;
