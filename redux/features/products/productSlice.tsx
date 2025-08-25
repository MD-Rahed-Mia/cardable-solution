import readDataFromFirestore from "@/services/common/readDataFromFirestore";
import { ProductType } from "@/types/products/product.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InitialSteteType {
  products: ProductType[] | null;
  isLoading: boolean;
  isError: string | undefined;
}

const initialState: InitialSteteType = {
  products: [],
  isLoading: false,
  isError: undefined,
};

export const fetchProduct = createAsyncThunk(
  "products/fetchProducts",
  async (userId: string) => {
    const collectionRef = ["users", userId, "products"];

    const result = await readDataFromFirestore(collectionRef);
    return result;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProductSlice: (state, action) => {
      const newProduct = [...(state.products || []), action.payload];
      state.products = newProduct;
    },
    setNewProductList: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = undefined;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {

        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.products = [];
        state.isError = action.error.message;
      });
  },
});

export const { addProductSlice, setNewProductList } = productSlice.actions;

export default productSlice.reducer;
