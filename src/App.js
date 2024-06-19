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
import NotFound from "./screens/NotFound";
import LoginScreen from "./screens/Auth/LoginScreen";
import { Provider } from "react-redux";
import store from "./store";

const queryClient = new QueryClient();

function RequireAuth({ children }) {
  let location = useLocation();
  const storedData = JSON.parse(sessionStorage.getItem("userData")) || {};
  if (!storedData.access_token) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return children;
}

function RedirectIfLoggedIn({ children }) {
  const storedData = JSON.parse(sessionStorage.getItem("userData")) || {};
  if (storedData.access_token) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}

function App() {
  return (
    <Provider store={store}>
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
              path="/login"
              element={
                <RedirectIfLoggedIn>
                  <LoginScreen />
                </RedirectIfLoggedIn>
              }
            />
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <ChatScreen />
                </RequireAuth>
              }
            />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
