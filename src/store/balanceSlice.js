import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchBalance = createAsyncThunk("balance/fetch", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data; // expecting { balance: number }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Gagal mengambil saldo");
  }
});

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    value: null, // angka saldo
    isLoading: false,
    error: null,
  },
  reducers: {
    setBalance(state, action) {
      state.value = action.payload;
    },
    clearBalance(state) {
      state.value = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.value = action.payload?.balance ?? action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Gagal mengambil saldo";
      });
  },
});

export const { setBalance, clearBalance } = balanceSlice.actions;
export default balanceSlice.reducer;
