import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  requestVerificationCodeAPI,
  verifyCodeAndLoginAPI,
  fetchUserInfoAPI,
} from "../services/auth";
import { setCookie, deleteAllCookie, getCookie } from "../helpers/cookie";

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

      setCookie("accessToken", data.accessToken, 0.0208);
      const userData = await fetchUserInfoAPI(data.accessToken);

      return { ...userData, accessToken: data.accessToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const autoLogin = createAsyncThunk(
  "auth/autoLogin",
  async (_, thunkAPI) => {
    try {
      const accessToken = getCookie("accessToken");
      if (!accessToken) throw new Error("No access token");

      const userData = await fetchUserInfoAPI(accessToken);

      const payloadToReturn = { ...userData, accessToken };
      return payloadToReturn;
    } catch (err) {
      deleteAllCookie();
      return thunkAPI.rejectWithValue(err.message || "Tự động đăng nhập thất bại");
    }
  }
);

const initialState = {
  id: null,
  email: "",
  accessToken: "",
  loading: false,
  error: null,
  isAuthChecked: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.id = null;
      state.email = "";
      state.accessToken = "";
      state.error = null;
      state.isAuthChecked = true;
      deleteAllCookie();
    },
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
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
        state.isAuthChecked = true;
      })
      .addCase(loginWithCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
        state.isAuthChecked = true;
      })
      .addCase(autoLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.id = action.payload.id;
          state.email = action.payload.email;
          state.accessToken = action.payload.accessToken;
        } else {
          state.error = "Dữ liệu đăng nhập tự động không hợp lệ";
        }
        state.isAuthChecked = true;
      })
      .addCase(autoLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Tự động đăng nhập thất bại";
        state.id = null;
        state.email = "";
        state.accessToken = "";
        state.isAuthChecked = true;
      });
  },
});

// Export logout and setIsAuthChecked directly from authSlice.actions
export const { logout, setIsAuthChecked } = authSlice.actions;

export default authSlice.reducer;