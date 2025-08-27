import React, { useEffect, useState } from "react";
import { FaBell, FaCrown, FaHome } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import UserMenu from "./UserMenu";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch announcements count
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
    staleTime: 60 * 1000, // optional: cache for 1 minute
  });

  const announcementCount = announcements.length;


  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // Change after 50px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = (
    <>
      <li className="mr-1">
        <NavLink to="/">
        <FaHome className="inline-block" />Home</NavLink>
      </li>
      <li>
        <NavLink to="/membership">
        <FaCrown></FaCrown>Membership</NavLink>
      </li>

      {/* Announcement Bell with badge */}
      <li className="relative">
        <NavLink to="/announcement" className="flex items-center">
          <FaBell size={20} />
          {announcementCount > 0 && (
            <span className="badge badge-error badge-sm indicator-item absolute -top-1 -right-2">
              {announcementCount}
            </span>
          )}
        </NavLink>
      </li>

      {!user && (
        <li>
          <NavLink to="/join">Join Us</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/40 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}>
      <div className="navbar lg:w-10/12 mx-auto">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <Link className="font-semibold text-3xl">
          <p>
            Dev<span className="text-[#748DAE]">Forum</span>
          </p>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end space-x-4">
        <ThemeToggle></ThemeToggle>
        {user && <UserMenu />}
        </div>
    </div>
    </div>
  );
};

export default Navbar;
