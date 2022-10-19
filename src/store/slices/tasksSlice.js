import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const { REACT_APP_API_ENDPOINT: API_ENDPOINT } = process.env;

const initialState = {
  loading: false,
  tasks: [],
  error: "",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    tasksRequest(state) {
      state.loading = true;
    },
    tasksSuccess(state, action) {
      state.loading = false;
      state.error = "";
      state.tasks = action.payload;
    },
    tasksFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.tasks = [];
    },
  },
});

export const { tasksRequest, tasksFailure, tasksSuccess } = taskSlice.actions;

export const getTasks = (path) => async (dispatch, getState) => {
  try {
    dispatch(tasksRequest());
    const { data } = await axios.get(`${API_ENDPOINT}task/${path}`);
    dispatch(tasksSuccess(data.result));
  } catch (error) {
    dispatch(tasksFailure(error));
  }
};

export default taskSlice.reducer;
