export const getUserToken = (state) => {
  return state.auth.access_token;
};

export const getUserData = (state) => {
  return state.auth;
};
