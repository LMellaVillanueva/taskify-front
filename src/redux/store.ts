import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { TaskSlice } from "./slices/Tasks/taskSlice";
import { UserSlice } from "./slices/Users/userSlice";

export const store = configureStore({
    reducer: {
        Task: TaskSlice.reducer,
        User: UserSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;