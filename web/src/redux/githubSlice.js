import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getGitHubRepoInfoAPI,
  attachGitHubToTaskAPI,
  getTaskAttachmentsAPI,
  removeAttachmentAPI
} from "../services/github";

export const fetchGitHubInfo = createAsyncThunk("github/fetchRepoInfo", async ({ repositoryId, token }, thunkAPI) => {
  try {
    return await getGitHubRepoInfoAPI(repositoryId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const attachGitHubToTask = createAsyncThunk("github/attachToTask", async ({ boardId, cardId, taskId, data, token }, thunkAPI) => {
  try {
    return await attachGitHubToTaskAPI(boardId, cardId, taskId, data, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchGitHubAttachments = createAsyncThunk("github/fetchAttachments", async ({ boardId, cardId, taskId, token }, thunkAPI) => {
  try {
    return await getTaskAttachmentsAPI(boardId, cardId, taskId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeGitHubAttachment = createAsyncThunk("github/removeAttachment", async ({ boardId, cardId, taskId, attachmentId, token }, thunkAPI) => {
  try {
    await removeAttachmentAPI(boardId, cardId, taskId, attachmentId, token);
    return attachmentId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const githubSlice = createSlice({
  name: "github",
  initialState: {
    repoInfo: null,
    attachments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGitHubInfo.fulfilled, (state, action) => {
        state.repoInfo = action.payload;
      })
      .addCase(fetchGitHubAttachments.fulfilled, (state, action) => {
        state.attachments = action.payload;
      })
      .addCase(attachGitHubToTask.fulfilled, (state, action) => {
        state.attachments.push(action.payload);
      })
      .addCase(removeGitHubAttachment.fulfilled, (state, action) => {
        state.attachments = state.attachments.filter(a => a.attachmentId !== action.payload);
      });
  },
});

export default githubSlice.reducer;