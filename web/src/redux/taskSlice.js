import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTasksAPI,
  getTaskDetailsAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  assignTaskAPI,
  getTaskMembersAPI,
  removeTaskMemberAPI,
} from "../services/task";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async ({ boardId, cardId, token }, thunkAPI) => {
  try {
    return await getTasksAPI(boardId, cardId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchTaskDetails = createAsyncThunk("tasks/fetchTaskDetails", async ({ boardId, cardId, taskId, token }, thunkAPI) => {
  try {
    return await getTaskDetailsAPI(boardId, cardId, taskId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const createTask = createAsyncThunk("tasks/createTask", async ({ boardId, cardId, data, token }, thunkAPI) => {
  try {
    return await createTaskAPI(boardId, cardId, data, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ boardId, cardId, taskId, data, token }, thunkAPI) => {
  try {
    return await updateTaskAPI(boardId, cardId, taskId, data, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async ({ boardId, cardId, taskId, token }, thunkAPI) => {
  try {
    await deleteTaskAPI(boardId, cardId, taskId, token);
    return taskId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const assignMemberToTask = createAsyncThunk("tasks/assignMember", async ({ boardId, cardId, taskId, memberId, token }, thunkAPI) => {
  try {
    return await assignTaskAPI(boardId, cardId, taskId, memberId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchTaskMembers = createAsyncThunk("tasks/fetchTaskMembers", async ({ boardId, cardId, taskId, token }, thunkAPI) => {
  try {
    return await getTaskMembersAPI(boardId, cardId, taskId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeMemberFromTask = createAsyncThunk("tasks/removeTaskMember", async ({ boardId, cardId, taskId, memberId, token }, thunkAPI) => {
  try {
    await removeTaskMemberAPI(boardId, cardId, taskId, memberId, token);
    return memberId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    selected: null,
    members: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedTask: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchTaskDetails.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      })
      .addCase(fetchTaskMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      });
  },
});

export const { clearSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;