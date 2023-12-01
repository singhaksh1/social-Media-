import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getUserProfile", body);
      console.log("user Profile response", response);
      return response.result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);
export const likedandUnlikePost = createAsyncThunk(
  "post/likedandUnlike",
  async (body) => {
    try {
      const response = await axiosClient.post("/posts/like", body);
      // console.log("user like response", response.result.post);
      return response.result.post;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    userProfile: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(likedandUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id === post._id
        );
        if (index !== undefined && index !== -1) {
          state.userProfile.posts[index] = post;
        }
      });
  },
});

export default postsSlice.reducer;
