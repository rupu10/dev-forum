import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaListUl,
  FaPlusCircle,
  FaUserEdit,
} from "react-icons/fa";
// import useUserRole from "../hooks/UseUserRole";

const DashboardLayOut = () => {
  //   const { role, roleLoading } = useUserRole();
  //   console.log(role);

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
            <NavLink to="/dashboard/myPosts">
              <FaListUl className="inline-block mr-2" />
              My Posts
            </NavLink>
          </li>

          {/* rider link */}

          {/* {!roleLoading && role === "rider" && (
            <>
              <li>
                <NavLink to="/dashboard/pending-deliveries">
                  <FaTasks className="inline-block mr-2" />
                  Pending Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/completed-deliveries">
                  <FaCheckCircle className="inline-block mr-2" />
                  Completed Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-earnings">
                  <FaWallet className="inline-block mr-2" />
                  My Earnings
                </NavLink>
              </li>
            </>
          )} */}

          {/* admin links */}


          

          
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayOut;


// {!roleLoading && role === "admin" && (
//             <>
//               <li>
//                 <NavLink to="/dashboard/assign-rider">
//                   <FaMotorcycle className="inline-block mr-2" />
//                   Assign Rider
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/dashboard/active-riders">
//                   <FaUserCheck className="inline-block mr-2" />
//                   Active Riders
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/dashboard/pending-riders">
//                   <FaUserClock className="inline-block mr-2" />
//                   Pending Riders
//                 </NavLink>
//               </li>
//               {/* admin routes */}
//               <li>
//                 <NavLink to="/dashboard/makeAdmin">
//                   <FaUserShield className="inline-block mr-2" />
//                   Make Admin
//                 </NavLink>
//               </li>
//             </>
//           )}