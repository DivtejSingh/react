import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videoData: null,
    videoList: null,
}

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideoData: (state, action) => {
            state.videoData = action.payload;
        },
        setVideoList: (state, action) => {
            state.videoList = action.payload;
        },
    }
});

export const { setVideoData, setVideoList } = videoSlice.actions;

export default videoSlice;
