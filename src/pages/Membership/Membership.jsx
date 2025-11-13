import React from 'react';
import Payment from '../../Dashboard/Payment/Payment';


const Membership = () => {
  return (
    <div className="max-w-3xl mt-15 mx-auto p-6">
      <h2 className="text-3xl text-center font-bold mb-6">Upgrade to Gold Membership</h2>
      <p className="mb-6 text-center">Pay now to become a Gold User and unlock premium features!</p>
      <Payment />
    </div>
  );
};

export default Membership;
