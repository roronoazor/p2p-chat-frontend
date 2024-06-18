import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUpScreen from "./screens/Auth/SignUpScreen";
import ChatScreen from "./screens/ChatScreen";

const queryClient = new QueryClient();

function RequireAuth({ children }) {
  let location = useLocation();
  const storedData = JSON.parse(localStorage.getItem("user")) || {};
  if (!storedData.token) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
}

function RedirectIfLoggedIn({ children }) {
  const storedData = JSON.parse(localStorage.getItem("user")) || {};
  if (storedData.token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn>
                <SignUpScreen />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/chat"
            element={
              <RedirectIfLoggedIn>
                <ChatScreen />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
