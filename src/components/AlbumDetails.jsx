import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const AlbumDetails = () => {
  const { albumId } = useParams(); // Get the album ID from URL
  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch album details and reviews
    const fetchAlbumDetails = async () => {
      try {
        const { data } = await axios.get(`/api/albums/${albumId}`);
        setAlbum(data.album);
        const reviewsRes = await axios.get(`/api/reviews/album/${albumId}`);
        setReviews(reviewsRes.data.reviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch album details');
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        albumId,
        rating,
        comment: reviewText,
      };
      await axios.post('http://localhost:3000/api/albums/:albumId/review', reviewData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setReviewText('');
      setRating(1);
      // Re-fetch reviews after adding a new one
      const reviewsRes = await axios.get(`/api/reviews/album/${albumId}`);
      setReviews(reviewsRes.data.reviews);
    } catch (err) {
      setError('Failed to add review');
    }
  };

  return (
    <>
    <Navbar/>
    <br />
    <div className="max-w-7xl mx-auto p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {album && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={album.coverArt} alt={album.title} className="w-full rounded-lg shadow-md" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{album.title}</h1>
            <p className="text-xl text-gray-700">{album.artist}</p>
            <p className="text-gray-600 mt-4">{album.description}</p>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold">Reviews</h2>
              {reviews.length === 0 && <p>No reviews yet.</p>}
              <div className="space-y-4 mt-4">
                {reviews.map((review) => (
                  <div key={review._id} className="p-4 border rounded-lg shadow-sm">
                    <p className="font-semibold">Rating: {review.rating}⭐</p>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-2xl font-semibold">Add a Review</h3>
        <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
          <div>
            <label htmlFor="rating" className="block text-lg font-medium">Rating</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-2 w-full p-2 border rounded-md"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="reviewText" className="block text-lg font-medium">Your Review</label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              className="mt-2 w-full p-2 border rounded-md"
            ></textarea>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md">Submit Review</button>
        </form>
      </div>
    </div>
    <br />
    <Footer/>
  </>
  );
};

export default AlbumDetails;
