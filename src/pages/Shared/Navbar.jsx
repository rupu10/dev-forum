import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaCrown, FaHome, FaList, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Fetch announcements count
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  // Fetch user role
  const { data: userRole } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;
    },
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const announcementCount = announcements.length;

  const handleSignOut = () => {
    logOut()
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Base navigation links
  const baseNavLinks = [
    { to: "/", icon: FaHome, label: "Home" },
    { to: "/allPosts", icon: FaList, label: "All Posts" },
    { to: "/announcement", icon: FaBell, label: "Announcements", badge: announcementCount },
  ];

  // Conditionally add Membership route only for bronze users
  const navLinks = [
    ...baseNavLinks,
    ...(user && userRole === "bronze_user" 
      ? [{ to: "/membership", icon: FaCrown, label: "Membership" }]
      : []
    ),
  ];

  const NavLinkItem = ({ to, icon: Icon, label, badge, onClick, isSubItem = false }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center gap-1.5 px-4 py-3 rounded-xl transition-all duration-300 group relative text-base-content/90 hover:text-base-content`
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            <Icon 
              size={20} 
              className="transition-transform duration-300 group-hover:scale-110" 
            />
            {badge > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </div>
          <span className={`font-medium ${isSubItem ? "text-sm" : ""}`}>{label}</span>
          
          {/* Active purple underline - only visible when active */}
          {!isSubItem && (
            <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 ${
              isActive 
                ? "w-4/5 left-2" 
                : "w-0"
            }`} />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-base-90/80 backdrop-blur-md shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between md:w-10/12 lg:max-w-7xl mx-auto py-3">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl transition-all duration-300 text-base-content hover:bg-base-content/10"
          >
            <div className={`w-6 h-6 relative transition-transform duration-300 ${mobileMenuOpen ? "rotate-90" : ""}`}>
              <span className={`absolute left-0 top-1 w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 top-3" : ""
              }`} />
              <span className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`} />
              <span className={`absolute left-0 top-5 w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 top-3" : ""
              }`} />
            </div>
          </button>
          
          {/* Logo */}
          <Link to="/" className="cursor-pointer group">
            <div className="flex items-center gap-1">
              <span className="text-xl md:text-2xl font-bold text-base-content">
                Dev<span className="text-purple-600">Forum</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center xl:gap-1">
          {navLinks.map((link) => (
            <NavLinkItem key={link.to} {...link} />
          ))}
          
          {/* Join Us link for non-logged in users */}
          {!user && (
            <NavLink
              to="/join"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-3 rounded-xl transition-all duration-300 group relative text-base-content/90 hover:text-base-content`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="font-medium">Join Us</span>
                  {/* Active purple underline - only visible when active */}
                  <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 ${
                    isActive 
                      ? "w-4/5 left-2" 
                      : "w-0"
                  }`} />
                </>
              )}
            </NavLink>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              
              <div className="relative" ref={userMenuRef}>
                {/* User Avatar */}
                <button
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="relative group"
                >
                  <img
                    className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 border-base-100 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer"
                    src={user.photoURL || "/default-avatar.png"}
                    referrerPolicy="no-referrer"
                    alt="Profile"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-base-100" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-56 bg-base-100 rounded-2xl shadow-2xl shadow-base-content/10 overflow-hidden animate-in fade-in duration-200 z-50"
                    onMouseEnter={() => setUserMenuOpen(true)}
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="p-2">
                      {/* User Info */}
                      <div className="px-3 py-3 border-b border-base-content/10">
                        <p className="font-semibold truncate text-base-content">{user.displayName || 'User'}</p>
                        <p className="text-sm truncate text-base-content/70">{user.email}</p>
                        {userRole && (
                          <p className={`text-xs font-medium mt-1 ${
                            userRole === "admin" 
                              ? "text-red-600" 
                              : userRole === "gold_user" 
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}>
                            {userRole === "admin" ? "Administrator" : userRole === "gold_user" ? "Gold Member" : "Bronze Member"}
                          </p>
                        )}
                      </div>
                      
                      {/* Dashboard Link */}
                      <NavLink
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-300 group ${
                            isActive
                              ? "bg-purple-100 text-purple-700"
                              : "hover:bg-base-200 text-base-content"
                          }`
                        }
                      >
                        <FaTachometerAlt size={16} className="transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-medium">Dashboard</span>
                      </NavLink>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-300 text-red-600 hover:bg-red-50 hover:text-red-700 group mt-1"
                      >
                        <FaSignOutAlt size={16} className="transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <NavLink
                to="/join"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border shadow-sm hover:shadow-lg border-base-content/20 hover:border-purple-600 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-purple-600 to-violet-600 border-purple-600"
                      : "text-base-content hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600"
                  }`
                }
              >
                Join Us
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
        mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="bg-base-100/95 backdrop-blur-md shadow-2xl">
          <div className="py-4 px-6 space-y-1">
            {navLinks.map((link) => (
              <NavLinkItem 
                key={link.to} 
                {...link} 
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
            
            {/* Dashboard link for mobile */}
            {user && (
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-3 rounded-xl transition-all duration-300 group relative text-base-content/90 hover:text-base-content`
                }
              >
                {({ isActive }) => (
                  <>
                    <FaTachometerAlt size={20} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">Dashboard</span>
                    {/* Active purple underline - only visible when active */}
                    <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 ${
                      isActive 
                        ? "w-4/5 left-2" 
                        : "w-0"
                    }`} />
                  </>
                )}
              </NavLink>
            )}
            
            {/* Join Us link for mobile */}
            {!user && (
              <NavLink
                to="/join"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-3 rounded-xl transition-all duration-300 group relative text-base-content/90 hover:text-base-content`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="font-medium">Join Us</span>
                    {/* Active purple underline - only visible when active */}
                    <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 ${
                      isActive 
                        ? "w-4/5 left-2" 
                        : "w-0"
                    }`} />
                  </>
                )}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;