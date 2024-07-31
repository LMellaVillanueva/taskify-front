import { createSlice } from "@reduxjs/toolkit";
import { UsersList } from "../../../types";
import { AppDispatch } from "../../store";
import axiosURL from "../../../axiosConfig/axiosURL";

// el ! significa que nunca es null
const userFromLocaleStorage = window.localStorage.getItem('User') ? JSON.parse(window.localStorage.getItem('User')!) : [];

// que siempre sea un Array
const userLocaleStorageArray = Array.isArray(userFromLocaleStorage) ? userFromLocaleStorage : [userFromLocaleStorage];

interface Users {
  user: UsersList;
  allUsers: UsersList;
}

const initialState: Users = {
  user: userLocaleStorageArray,
  allUsers: [],
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logInUser: (state, action) => {
        state.user.push(action.payload);
    },
    logOutUser: (state) => {
        state.user = [];
    },
    getUsers: (state, action) => {
        state.allUsers = [...action.payload];
    },
  },
});

export const getUsersAPI = () => async (dispatch: AppDispatch) => {
    try {
        const { data } = await axiosURL.get('/user');
        if (data) {
            dispatch(getUsers(data));
        } else {
            dispatch(getUsers([]));
        }
    } catch (error) {
    if (error instanceof Error) console.error(error.message);
    }
}

export default UserSlice.reducer;
export const { logInUser, logOutUser, getUsers } = UserSlice.actions;