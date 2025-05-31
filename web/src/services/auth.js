import { postJson, auth } from "./request";

export const requestVerificationCodeAPI = async (email) => {
  return await postJson("/auth/signup", { email });
};

export const verifyCodeAndLoginAPI = async (email, verificationCode) => {
  return await postJson("/auth/signin", { email, verificationCode });
};

export const fetchUserInfoAPI = async (token) => {
  return await auth("/auth/me", token); // giả sử có endpoint này để lấy info
};