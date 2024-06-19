import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../src/redux/auth/authSlice";
import chatReducer from "../src/redux/chat/chatSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});
