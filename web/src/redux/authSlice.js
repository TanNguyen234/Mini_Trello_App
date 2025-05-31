import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  requestVerificationCodeAPI,
  verifyCodeAndLoginAPI,
  fetchUserInfoAPI,
} from "../services/auth";
import { setCookie, deleteAllCookie } from "../helpers/cookie";

export const sendVerificationCode = createAsyncThunk(
  "auth/sendCode",
  async (email, thunkAPI) => {
    try {
      return await requestVerificationCodeAPI(email);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const loginWithCode = createAsyncThunk(
  "auth/login",
  async ({ email, code }, thunkAPI) => {
    try {
      const data = await verifyCodeAndLoginAPI(email, code);
      if (!data.accessToken) throw new Error("Đăng nhập thất bại!");

      setCookie("access_token", data.accessToken, 0.0208);
      const userData = await fetchUserInfoAPI(data.accessToken);

      return { ...userData, accessToken: data.accessToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  id: null,
  email: "",
  accessToken: "",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.id = null;
      state.email = "";
      state.accessToken = "";
      state.error = null;
      deleteAllCookie();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendVerificationCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Gửi mã xác nhận thất bại";
      })
      .addCase(loginWithCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithCode.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginWithCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;