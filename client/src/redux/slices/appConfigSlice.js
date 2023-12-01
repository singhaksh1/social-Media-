import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk("user/getMyInfo", async () => {
  try {
    const response = await axiosClient.get("/user/getMyInfo");
    // console.log("api call data", response);
    return response.result;
  } catch (e) {
    return Promise.reject(e);
  }
});

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (body) => {
    try {
      const response = await axiosClient.put("/user/", body);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);
export const deleteMyProfile = createAsyncThunk(
  "user/deleteMyProfile",
  async () => {
    try {
      const response = await axiosClient.delete("/user/");
      console.log("delete response", response);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    isLoading: false,
    toastData: {},
    myProfile: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      })
      .addCase(deleteMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload;
      });
  },
});

export default appConfigSlice.reducer;
export const { setLoading, showToast } = appConfigSlice.actions;
