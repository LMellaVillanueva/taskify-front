import { TasksList } from "../../../types";
import { createSlice } from "@reduxjs/toolkit";
import axiosURL from "../../../axiosConfig/axiosURL";
import { AppDispatch } from "../../store";

interface Tasks {
  allTasks: TasksList;
  searchTasks: TasksList;
  tasksDeleted: TasksList;
}

const initialState: Tasks = {
  allTasks: [],
  searchTasks: [],
  tasksDeleted: [],
};

export const TaskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    getTasks: (state, action) => {
      state.allTasks = [...action.payload];
      state.searchTasks = [...action.payload];
    },
    getTasksDeleted: (state, action) => {
      state.tasksDeleted = [...action.payload];
      state.searchTasks = [...action.payload];
    },
    searchTasks: (state, action) => {
      state.allTasks = state.searchTasks.filter((task) => {
        return task.description.toUpperCase().startsWith(action.payload);
      });
      state.tasksDeleted = state.searchTasks.filter((task) => {
        return task.description.toUpperCase().startsWith(action.payload);
      })
    },
    newOrder: (state, action) => {
      state.allTasks = [...action.payload];
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
    if (data) {
      dispatch(getTasksDeleted(data));
    } else {
      dispatch(getTasksDeleted([]));
    }
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
};

export const searchATask = (task: string) => (dispatch: AppDispatch) => {
  if (task) {
    dispatch(searchTasks(task));
  }
};

export const reOrderTasks =
  (newArray: TasksList) => async (dispatch: AppDispatch) => {
    if (newArray) {
      dispatch(newOrder(newArray));
    }
    try {
      const { data } = await axiosURL.post("/task/newOrder", newArray);
      if (data) {
        dispatch(newOrder(data));
        console.log(data);
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

export default TaskSlice.reducer;
export const { getTasks, getTasksDeleted, searchTasks, newOrder } =
  TaskSlice.actions;
