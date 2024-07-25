import { TasksList } from "../../../types";
import { createSlice } from "@reduxjs/toolkit";
import axiosURL from "../../../axiosConfig/axiosURL";
import { AppDispatch } from "../../store";

interface Tasks {
  allTasks: TasksList;
  tasksDeleted: TasksList;
}

const initialState: Tasks = {
  allTasks: [],
  tasksDeleted: [],
};

export const TaskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    getTasks: (state, action) => {
      state.allTasks = [...action.payload];
    },
    getTasksDeleted: (state, action) => {
      state.tasksDeleted = [...action.payload]
    },
  },
});

export const getTasksAPI = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axiosURL.get("/task");
    if (data) {
      dispatch(getTasks(data));
    } else {
      dispatch(getTasks([]));
    }
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
};

export const getTasksDeletedAPI = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axiosURL.get("/task/deleted");
    if(data) {
      dispatch(getTasksDeleted(data));
    } else {
      dispatch(getTasksDeleted([]));
    }
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
};

export default TaskSlice.reducer;
export const { getTasks, getTasksDeleted } = TaskSlice.actions;
