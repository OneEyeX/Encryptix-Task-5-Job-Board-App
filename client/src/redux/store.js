import { configureStore } from "@reduxjs/toolkit";
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from "react-redux";
import rootReducer from "./rootReducer"; // Assuming rootReducer is the default export

const store = configureStore({
    reducer: rootReducer,
});

const useDispatch = useAppDispatch;
const useSelector = useAppSelector;

export { store, useDispatch, useSelector };
export default store; // Optionally export store as default
