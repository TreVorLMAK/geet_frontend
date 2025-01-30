import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CompleteDonation = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const params = {
        pidx: searchParams.get("pidx"),
        transaction_id: searchParams.get("transaction_id"),
        amount: searchParams.get("amount"),
        purchase_order_id: searchParams.get("purchase_order_id"),
      };

      try {
        const response = await fetch(`https://geet-backend.onrender.com/api/khalti/complete-donation?${new URLSearchParams(params)}`);
        const result = await response.json();
        setLoading(false);
        if (result.success) {
          setPaymentStatus("Payment Successful!");
        } else {
          setPaymentStatus("Payment Failed. Please try again.");
        }
      } catch (error) {
        setLoading(false);
        setError("An error occurred. Please try again.");
      }
    };

    fetchPaymentStatus();
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <h2 className="text-xl font-bold text-green-600">{paymentStatus}</h2>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompleteDonation;
