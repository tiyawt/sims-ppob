import { createSlice } from "@reduxjs/toolkit";

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    value: null, // angka saldo
    isLoading: false,
  },
  reducers: {
    setBalance(state, action) {
      state.value = action.payload;
    },
    clearBalance(state) {
      state.value = null;
    },
  },
});

export const { setBalance, clearBalance } = balanceSlice.actions;
export default balanceSlice.reducer;
