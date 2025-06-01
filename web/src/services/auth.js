import { postJson, auth, get } from "./request";

export const requestVerificationCodeAPI = async (email) => {
  return await postJson("/auth/signup", { email });
};

export const verifyCodeAndLoginAPI = async (email, verificationCode) => {
  return await postJson("/auth/signin", { email, verificationCode });
};

export const fetchUserInfoAPI = async (token) => {
  return await get("/auth/me", token); // giả sử có endpoint này để lấy info
};