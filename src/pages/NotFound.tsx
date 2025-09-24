import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-200 animate-fadeIn">
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500 animate-bounce" />
        <h1 className="mb-4 text-6xl font-extrabold text-red-600">404</h1>
        <p className="mb-6 text-lg text-gray-700">
          Oops! The page <span className="font-mono text-red-500">{location.pathname}</span> does not exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary-glow to-secondary-glow text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
