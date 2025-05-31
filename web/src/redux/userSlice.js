import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginForAccess,
  loginForRefresh,
  loginInfoUser,
} from "../services/auth";
import { deleteAllCookie, setCookie } from "../helpers/cookie";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginForAccess(credentials);
      if (!data.access_token) throw new Error("Đăng nhập thất bại!");
      setCookie("access_token", data.access_token, 0.0208); // ví dụ set cookie 30 phút
      setCookie("refresh_token", data.refresh_token, 30); // ví dụ set cookie 30 phút

      const userData = await loginInfoUser(data.access_token);
      if (!userData) throw new Error("Đăng nhập thất bại!");
      return {
        ...userData,
        access_token: data.access_token,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const autoLoginUser = createAsyncThunk(
  "user/autoLoginUser",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginForRefresh(credentials);
      if (!data) throw new Error("Đăng nhập thất bại!");
      setCookie("access_token", data.access_token, 0.0208); // ví dụ set cookie 30 phút
      const userData = await loginInfoUser(data.access_token);
      if (!userData) throw new Error("Đăng nhập thất bại!");
      return {
        ...userData,
        access_token: data.access_token,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  id: null,
  username: "",
  email: "",
  access_token: "",
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.id = null;
      state.username = "";
      state.email = "";
      state.access_token = "";
      state.error = null;

      deleteAllCookie()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.access_token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(autoLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.access_token = action.payload.access_token;
      })
      .addCase(autoLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Tự động đăng nhập thất bại";
      });
  },
});

export const { logout } = userSlice.actions;
