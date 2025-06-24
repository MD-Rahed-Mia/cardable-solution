import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import profileReducer from "../features/profile/profileSlice";

const store = configureStore({
  reducer: {
    productR: productReducer,
    profileR: profileReducer,
  },
});

export default store;
