import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../src/redux/auth/authSlice";
import chatReducer from "../src/redux/chat/chatSlice";

const loadState = () => {
  try {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
      return {
        auth: {
          ...userData,
        },
      };
    }
  } catch (e) {
    console.error("Could not load state from sessionStorage:", e);
  }
  return undefined;
};

export default configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
  preloadedState: loadState(),
});
