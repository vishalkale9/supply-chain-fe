import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="font-bold text-xl text-blue-600">SupplyChain</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 text-sm transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 text-sm transition-colors"
            >
              Market
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 text-sm transition-colors"
            >
              Services
            </a>
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded text-sm transition-colors">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full left-0 top-16 shadow-lg">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2 rounded-md transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2 rounded-md transition-colors"
            >
              Market
            </a>
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2 rounded-md transition-colors"
            >
              Services
            </a>
            <div className="pt-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded text-sm transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
