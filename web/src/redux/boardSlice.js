import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBoardsAPI,
  createBoardAPI,
  getBoardByIdAPI,
  updateBoardAPI,
  deleteBoardAPI,
} from "../services/board";

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (token, thunkAPI) => {
    try {
      const data = await getBoardsAPI(token);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchBoardById = createAsyncThunk(
  "boards/fetchBoardById",
  async ({ id, token }, thunkAPI) => {
    try {
      const data = await getBoardByIdAPI(id, token);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async ({ boardData, token }, thunkAPI) => {
    try {
      const data = await createBoardAPI(boardData, token);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async ({ id, updatedData, token }, thunkAPI) => {
    try {
      const data = await updateBoardAPI(id, updatedData, token);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async ({ id, token }, thunkAPI) => {
    try {
      await deleteBoardAPI(id, token);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const boardSlice = createSlice({
  name: "boards",
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedBoard: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      });
  },
});

export const { clearSelectedBoard } = boardSlice.actions;
export default boardSlice.reducer;