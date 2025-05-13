import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to track hamburger menu open/close

  return (
    <nav className="border-gray-200 bg-gray-50 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-2">
        <Link to="/" className="text-2xl font-semibold">
          Blog App
        </Link>

        {/* Hamburger button */}
        <button
          className="sm:hidden p-2 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        {/* Navigation links */}
        <div
          className={`w-full sm:inline-block sm:w-auto ${
            isOpen ? 'block' : 'hidden'
          } sm:block`}
        >
          <ul className="flex flex-col items-center space-y-4 font-medium mt-4 sm:flex-row sm:space-x-9 sm:space-y-0 sm:mt-0">
            {userInfo ? (
              <>
                <li>
                  <NavLink to="/blog/add">Add Blog</NavLink>
                </li>
                <li>
                  <NavLink to="/blog/profile">Profile</NavLink>
                </li>
                <button
                  className="btn-primary"
                  onClick={() => logout(navigate)}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <li>
                  <Link to="/auth/login" className="btn-primary">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register" className="btn-primary">
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
