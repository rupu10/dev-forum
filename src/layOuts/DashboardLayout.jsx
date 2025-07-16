import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaListUl,
  FaPlusCircle,
  FaRegNewspaper,
  FaUserCog,
  FaUserEdit,
  FaUsers,
  FaUserSecret,
} from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";


const DashboardLayOut = () => {
    const { role, roleLoading } = useUserRole();
    console.log(role);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Page content here */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">
            <Link className="text-3xl font-semibold mb-5" to='/'>
          <p>
            Dev<span className="text-[#748DAE]">Forum</span>
          </p>
        </Link>
          </div>
        </div>
        {/* page content here */}
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <Link className="text-3xl font-semibold mb-5" to='/'>
          <p>
            Dev<span className="text-[#748DAE]">Forum</span>
          </p>
        </Link>
          <li>
            <NavLink to="/dashboard">
              <FaHome className="inline-block mr-2" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile">
              <FaUserEdit className="inline-block mr-2" />
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/addPost">
              <FaPlusCircle className="inline-block mr-2" />
              Add Post
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myPost">
              <FaListUl className="inline-block mr-2" />
              My Posts
            </NavLink>
          </li>


          {/* admin links */}
          {!roleLoading && role === "admin" && 
          <>
          <li>
            <NavLink to="/dashboard/adminProfile">
              <FaUserCog className="inline-block mr-2" />
              Admin Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manageUsers">
              <FaUserSecret className="inline-block mr-2" />
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/reports">
              <FaUsers className="inline-block mr-2" />
              Reported Activities
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/makeAnnouncement">
              <FaRegNewspaper className="inline-block mr-2" />
              Make Announcement
            </NavLink>
          </li>
          </>
          }

          

          
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayOut;

