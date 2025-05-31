import { auth, postJson, patch, del } from "./request"; // base chứa hàm gọi API như get, postJson...

export const getBoardsAPI = async (token) => {
  return await auth("/boards", token);
};

export const getBoardByIdAPI = async (id, token) => {
  return await auth(`/boards/${id}`, token);
};

export const createBoardAPI = async (data, token) => {
  return await postJson("/boards", data, token);
};

export const updateBoardAPI = async (id, data, token) => {
  return await patch(`/boards/${id}`, data, token);
};

export const deleteBoardAPI = async (id, token) => {
  return await del(`/boards/${id}`, token);
};