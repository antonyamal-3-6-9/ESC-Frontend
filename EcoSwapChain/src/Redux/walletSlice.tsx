import { createSlice } from "@reduxjs/toolkit";

interface WalletState {
  isOpen: boolean;
}

const initialState: WalletState = {
  isOpen: false,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    triggerWallet: (state) => {
      state.isOpen = !state.isOpen
    },
  },
});

export const { triggerWallet } = walletSlice.actions;

export default walletSlice.reducer;