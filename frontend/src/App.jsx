import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import useGetCurrentUser from "./customHooks/getCurrentUser";
import useGetOtherUsers from "./customHooks/getOtherUsers";
import { useEffect } from "react";
import io from "socket.io-client";
import { serverUrl } from "./main";
import { useDispatch } from "react-redux";
import { setSocket } from "./redux/userSlice";
import { setOnlineUsers } from "./redux/userSlice";
function App() {
  // Fetch current user & other users
useGetCurrentUser();
useGetOtherUsers();

const { userData, loading} = useSelector(
  (state) => state.user
);

const dispatch = useDispatch();

useEffect(() => {
  // Don't connect until the logged-in user's ID is available
  if (!userData?._id) return;

  // Create socket connection
  const socketio = io(serverUrl, {
    query: {
      userId: userData._id,
    },
  });

  // Save socket in Redux
  dispatch(setSocket(socketio));

  // Listen for online users
  socketio.on("getOnlineUsers", (users) => {
    dispatch(setOnlineUsers(users));
  });

  // Cleanup when component unmounts or user changes
  return () => {
    socketio.close();
    dispatch(setSocket(null));
  };
}, [userData?._id, dispatch]);



  // Wait until authentication check completes
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={userData ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/signup"
        element={userData ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/login" replace />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={userData ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;