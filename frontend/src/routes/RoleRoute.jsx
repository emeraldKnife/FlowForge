import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({
  children,
  allowedRoles,
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (
    !allowedRoles.includes(
      user.role.toLowerCase()
    )
  ) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default RoleRoute;
