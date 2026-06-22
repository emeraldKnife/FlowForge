import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";

import WorkerDashboard from "./pages/WorkerDashboard";

import AdminDashboard from "./pages/AdminDashboard";

import CEODashboard from "./pages/CEODashboard";

import HeadDashboard from "./pages/HeadDashboard";

import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/worker"
          element={
            <RoleRoute
              allowedRoles={["worker"]}
            >
              <WorkerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute
              allowedRoles={["admin"]}
            >
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/ceo"
          element={
            <RoleRoute
              allowedRoles={["ceo"]}
            >
              <CEODashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/head"
          element={
            <RoleRoute
              allowedRoles={[
                "design_head",
                "production_head",
                "quality_head",
                "dispatch_head",
              ]}
            >
              <HeadDashboard />
            </RoleRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
