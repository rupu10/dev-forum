import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PaymentForm from './PayemntForm';



const stripePromise = loadStripe(import.meta.env.VITE_payment_key);
// console.log(stripePromise);
// const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Payment = () => {


  return (
    <Elements stripe={stripePromise}>
      <PaymentForm/>
    </Elements>
  );
};

export default Payment;
