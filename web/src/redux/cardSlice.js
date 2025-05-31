import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCardsAPI,
  getCardByIdAPI,
  getCardsByUserAPI,
  createCardAPI,
  updateCardAPI,
  deleteCardAPI,
  inviteToBoardAPI,
  acceptInviteAPI
} from "../services/card";

export const fetchCards = createAsyncThunk("cards/fetchCards", async ({ boardId, token }, thunkAPI) => {
  try {
    return await getCardsAPI(boardId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchCardById = createAsyncThunk("cards/fetchCardById", async ({ boardId, cardId, token }, thunkAPI) => {
  try {
    return await getCardByIdAPI(boardId, cardId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchCardsByUser = createAsyncThunk("cards/fetchCardsByUser", async ({ boardId, userId, token }, thunkAPI) => {
  try {
    return await getCardsByUserAPI(boardId, userId, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const createCard = createAsyncThunk("cards/createCard", async ({ boardId, data, token }, thunkAPI) => {
  try {
    return await createCardAPI(boardId, data, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateCard = createAsyncThunk("cards/updateCard", async ({ boardId, cardId, data, token }, thunkAPI) => {
  try {
    return await updateCardAPI(boardId, cardId, data, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteCard = createAsyncThunk("cards/deleteCard", async ({ boardId, cardId, token }, thunkAPI) => {
  try {
    await deleteCardAPI(boardId, cardId, token);
    return cardId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const inviteToBoard = createAsyncThunk("cards/inviteToBoard", async ({ boardId, data, token }, thunkAPI) => {
  try {
    return await inviteToBoardAPI(boardId, data, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const acceptCardInvite = createAsyncThunk("cards/acceptCardInvite", async ({ boardId, cardId, data, token }, thunkAPI) => {
  try {
    return await acceptInviteAPI(boardId, cardId, data, token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const cardSlice = createSlice({
  name: "cards",
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCard: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchCardById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      });
  },
});

export const { clearSelectedCard } = cardSlice.actions;
export default cardSlice.reducer;