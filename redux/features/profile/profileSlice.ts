import { db } from "@/firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";

export interface ProfileState {
  email: string;
  displayName: string;
  phoneNumber: string;
  businessName: string;
  companyName: string;
  groupName: string;
  zoneName: string;
  address: string;
  initialInvestment: number;
}

interface ProfileSliceState {
  profile: ProfileState;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileSliceState = {
  profile: {
    email: "",
    displayName: "",
    phoneNumber: "",
    businessName: "",
    companyName: "",
    groupName: "",
    zoneName: "",
    address: "",
    initialInvestment: 0,
  },
  isLoading: false,
  error: null,
};

// Async thunk to fetch profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const userDoc = await getDoc(
        doc(db, "users", userId, "businessProfile", "profile")
      );

      console.log("user doc: ", userDoc.data());
      if (userDoc.exists()) {
        return userDoc.data() as ProfileState;
      } else {
        return rejectWithValue("Profile not found.");
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
