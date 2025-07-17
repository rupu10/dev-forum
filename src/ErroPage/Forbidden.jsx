import React from "react";
import { Link } from "react-router";


const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Access Forbidden</h2>
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>
      <Link to="/">
        <button className="btn btn-primary">Go to Homepage</button>
      </Link>
    </div>
  );
};

export default Forbidden;
