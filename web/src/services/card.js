import { auth, postJson, patch, del } from "./base";

export const getCardsAPI = async (boardId, token) => {
  return await auth(`/boards/${boardId}/cards`, token);
};

export const getCardByIdAPI = async (boardId, cardId, token) => {
  return await auth(`/boards/${boardId}/cards/${cardId}`, token);
};

export const getCardsByUserAPI = async (boardId, userId, token) => {
  return await auth(`/boards/${boardId}/cards/user/${userId}`, token);
};

export const createCardAPI = async (boardId, data, token) => {
  return await postJson(`/boards/${boardId}/cards`, data, token);
};

export const updateCardAPI = async (boardId, cardId, data, token) => {
  return await patch(`/boards/${boardId}/cards/${cardId}`, data, token);
};

export const deleteCardAPI = async (boardId, cardId, token) => {
  return await del(`/boards/${boardId}/cards/${cardId}`, token);
};

export const inviteToBoardAPI = async (boardId, data, token) => {
  return await postJson(`/boards/${boardId}/invite`, data, token);
};

export const acceptInviteAPI = async (boardId, cardId, data, token) => {
  return await postJson(`/boards/${boardId}/cards/${cardId}/invite/accept`, data, token);
};