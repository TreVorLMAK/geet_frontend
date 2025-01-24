import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const UserProfile = () => {
  const { username } = useParams(); 
  const [userDetails, setUserDetails] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:3000/api/user/${username}` 
        );
        const { data } = userResponse.data;
        setUserDetails(data); 
        setReviews(data.reviewedAlbums || []); 
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [username]); // Trigger effect when username changes

  return (
    <>
      <Navbar />
      <br />
      <div className="max-w-4xl mx-auto my-8 p-4 border rounded-lg shadow-lg">
        {userDetails ? (
          <>
            {/* Display Profile Picture */}
            <div className="flex items-center mb-4">
              <img
                src={userDetails.profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold">{userDetails.username}</h2>
                <p className="text-gray-600">{userDetails.email}</p>
              </div>
            </div>

            {/* Display Bio */}
            <p className="text-lg mb-4">{userDetails.bio || "This user has not added a bio yet."}</p>

            {/* Reviews Section */}
            <h3 className="text-xl font-semibold mb-4">Reviews by {userDetails.username}</h3>
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className="p-4 bg-gray-100 rounded-md mb-2">
                  <p className="font-bold">Album: {rev.albumTitle}</p>
                  <p>Rating: {rev.rating}</p>
                  <p>{rev.reviewText}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <br />
      <Footer />
    </>
  );
};

export default UserProfile;
