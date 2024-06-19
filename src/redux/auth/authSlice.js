import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    access_token: "",
    email: "",
    name: "",
    phoneNumber: "",
    id: "",
  },
  reducers: {
    loginUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    logoutUser: (state, action) => {
      return {};
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
