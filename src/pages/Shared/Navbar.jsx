import React from "react";
import { FaBell } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import UserMenu from "./UserMenu";

const Navbar = () => {
    const {user} = useAuth();
    // console.log(user);
  const navItems = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/membership">Membership</NavLink>
      </li>
      <li>
        <FaBell size={37}></FaBell>
      </li>
      {!user && <li>
        <NavLink to="/join">Join Us</NavLink>
      </li>}
    </>
  );
  return (
    <div className="navbar shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <Link className="btn btn-ghost text-3xl">
          <p>
            Dev<span className="text-[#748DAE]">Forum</span>
          </p>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
       {user && <UserMenu></UserMenu>}
      </div>
    </div>
  );
};

export default Navbar;

