import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

// Wraps protected pages — redirects to /login if user is not authenticated
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking saved token, show a loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;