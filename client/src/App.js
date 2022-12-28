import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import Room from "./pages/Room/Room";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";

function App() {
  //call refresh endpoint
  const { loading } = useLoadingWithRefresh();

  return loading ? (
    <Loader message="Loading, please wait..." />
  ) : (
    <Router>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />
        <Route
          path="/activate"
          element={
            <SemiProtectedRoute>
              <Activate />
            </SemiProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:id"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

const GuestRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return isAuth ? (
    <Navigate to="/rooms" state={{ from: rest.location }} />
  ) : (
    children
  );
};

const SemiProtectedRoute = ({ children, ...rest }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  return !isAuth ? (
    <Navigate to="/" state={{ from: rest.location }} />
  ) : isAuth && !user.activated ? (
    children
  ) : (
    <Navigate to="/rooms" state={{ from: rest.location }} />
  );
};

const ProtectedRoute = ({ children, ...rest }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  return !isAuth ? (
    <Navigate to="/" state={{ from: rest.location }} />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" state={{ from: rest.location }} />
  ) : (
    children
  );
};

export default App;
