import { configureStore } from "@reduxjs/toolkit"; 
import userReducer from "../redux/slicer/userSlice"; 
import dailyTargetReducer from "../redux/slicer/dailyTargetSlice";
import habitReducer from "../redux/slicer/habitSlice";
import studyReducer from "../redux/slicer/studySlice";

const store = configureStore({
  reducer: {
    user : userReducer,
    dailyTarget : dailyTargetReducer,
    habit : habitReducer,
    study : studyReducer,
  },
});

export default store;


