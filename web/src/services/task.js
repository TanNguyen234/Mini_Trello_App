import { auth, postJson, patch, del } from "./request";

export const getTasksAPI = async (boardId, cardId, token) => {
  return await auth(`/boards/${boardId}/cards/${cardId}/tasks`, token);
};

export const getTaskDetailsAPI = async (boardId, cardId, taskId, token) => {
  return await auth(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, token);
};

export const createTaskAPI = async (boardId, cardId, data, token) => {
  return await postJson(`/boards/${boardId}/cards/${cardId}/tasks`, data, token);
};

export const updateTaskAPI = async (boardId, cardId, taskId, data, token) => {
  return await patch(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, data, token);
};

export const deleteTaskAPI = async (boardId, cardId, taskId, token) => {
  return await del(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, token);
};

export const assignTaskAPI = async (boardId, cardId, taskId, memberId, token) => {
  return await postJson(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`, { memberId }, token);
};

export const getTaskMembersAPI = async (boardId, cardId, taskId, token) => {
  return await auth(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`, token);
};

export const removeTaskMemberAPI = async (boardId, cardId, taskId, memberId, token) => {
  return await del(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign/${memberId}`, token);
};