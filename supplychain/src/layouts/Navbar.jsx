import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../services/notification.service";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Fetch notifications periodically
  useEffect(() => {
    let interval;
    const fetchNotifications = async () => {
      try {
        const data = await getMyNotifications();
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    if (user) {
      fetchNotifications();
      interval = setInterval(fetchNotifications, 15000); // Check every 15 seconds
    }

    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification._id || notification.id);
        setNotifications(
          notifications.map((n) =>
            n._id === notification._id || n.id === notification.id
              ? { ...n, isRead: true }
              : n,
          ),
        );
      } catch (error) {
        console.error("Failed to mark read", error);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <span className="font-bold text-xl text-blue-600">SupplyChain</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              to="/market"
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 text-sm transition-colors"
            >
              Market
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 text-sm transition-colors"
            >
              Services
            </Link>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  Hi, {user.name?.split(" ")[0] || "User"}
                </span>

                {/* Notifications Bell */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-700">
                          Notifications
                        </span>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="px-4 py-4 text-sm text-gray-500 text-center">
                          No notifications yet.
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? "bg-blue-50/50" : ""}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span
                                  className={`text-sm font-medium ${!notification.isRead ? "text-blue-800" : "text-gray-700"}`}
                                >
                                  {notification.title}
                                </span>
                                {!notification.isRead && (
                                  <span className="h-2 w-2 rounded-full bg-blue-600 mt-1"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {notification.message}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium py-1.5 px-4 rounded text-sm transition-colors ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded text-sm transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notification Bell */}
            {user && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu & Notifications */}
      {showNotifications && user && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full left-0 top-16 shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-100 font-bold text-gray-700">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-500 text-center">
              No notifications yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification, idx) => (
                <div
                  key={idx}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 active:bg-gray-50 cursor-pointer ${!notification.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-sm font-medium ${!notification.isRead ? "text-blue-800" : "text-gray-700"}`}
                    >
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full left-0 top-16 shadow-lg z-40">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2 rounded-md transition-colors"
            >
              Home
            </Link>
            <Link
              to="/market"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2 rounded-md transition-colors"
            >
              Market
            </Link>
            <Link
              to="/services"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2 rounded-md transition-colors"
            >
              Services
            </Link>

            {/* Mobile User Actions */}
            <div className="pt-4 pb-2 border-t border-gray-200 mt-2">
              {user ? (
                <>
                  <div className="px-3 mb-3 text-sm font-medium text-gray-700">
                    Hi, {user.name?.split(" ")[0] || "User"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium py-2 px-5 rounded text-sm transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded text-sm transition-colors text-left"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
