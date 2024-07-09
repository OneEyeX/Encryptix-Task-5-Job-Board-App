import { createSlice } from "@reduxjs/toolkit";

// Initialize user state from localStorage or set to an empty object
const initialState = {
  user: JSON.parse(localStorage.getItem("userInfo")) ?? {},
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(state.user));
    },
    logout(state) {
      state.user = {};
      localStorage.removeItem("userInfo");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

export const Login = (user) => (dispatch) => {
  dispatch(login(user));
};

export const Logout = () => (dispatch) => {
  dispatch(logout());
};
