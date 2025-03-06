import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NFT {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    rootCategory: string; 
    mainCategory: string;
    address: string;
    uri: string;
    symbol: string;
}

interface NFTState {
    products: NFT[];
    retrieveId: number;
}

const initialState: NFTState = {
    products: [],
    retrieveId: 0,
};

const nftSlice = createSlice({
    name: "nft",
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<NFT[]>) => {
            const newProducts = action.payload.filter(
                (newProduct) => !state.products.some((product) => product.id === newProduct.id)
            );
            state.products.push(...newProducts);
        },
        removeProduct: (state, action: PayloadAction<number>) => {
            state.products = state.products.filter((product) => product.id !== action.payload);
        },
        addRetrieveId: (state, action: PayloadAction<number>) => {
            state.retrieveId = action.payload;
        }
    },
});

export const { addProduct, removeProduct, addRetrieveId } = nftSlice.actions;

export default nftSlice.reducer;