import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate()

  const amount = 4999; // $49.99 in cents

  // ✅ Fetch user info from DB using email to get the MongoDB _id
  const { data: userInfo = {}, isPending } = useQuery({
    queryKey: ['userInfo', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      return res.data; // should return { _id, email, role, ... }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (isPending) return;

    setProcessing(true);
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    try {
      // Step 1: Create payment intent on server
      const { data: paymentIntentData } = await axiosSecure.post('/create-membership-intent', {
        amount,
      });

      const clientSecret = paymentIntentData.clientSecret;

      // Step 2: Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        // ✅ Step 3: Update user role using MongoDB _id
        const res = await axiosSecure.patch(`/user/role/${userInfo._id}`, {
          role: 'gold_user',
        });

        if (res.data.modifiedCount) {
          await Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: 'Your membership has been upgraded to Gold User.',
            confirmButtonText: 'Awesome!',
          });
          setProcessing(false);
          navigate('/dashboard')
        } else {
          throw new Error('Role update failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md bg-white mx-auto p-6 rounded shadow">
      <CardElement className="p-2 border rounded mb-4" />
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={!stripe || processing || isPending}
      >
        {processing ? 'Processing...' : 'Pay $49.99'}
      </button>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </form>
  );
};

export default PaymentForm;
