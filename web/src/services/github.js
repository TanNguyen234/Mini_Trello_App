import { auth, postJson, del } from "./request";

export const getGitHubRepoInfoAPI = async (repositoryId, token) => {
  return await auth(`/repositories/${repositoryId}/github-info`, token);
};

export const attachGitHubToTaskAPI = async (boardId, cardId, taskId, data, token) => {
  return await postJson(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attach`, data, token);
};

export const getTaskAttachmentsAPI = async (boardId, cardId, taskId, token) => {
  return await auth(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments`, token);
};

export const removeAttachmentAPI = async (boardId, cardId, taskId, attachmentId, token) => {
  return await del(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments/${attachmentId}`, token);
};