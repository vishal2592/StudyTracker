import { configureStore } from "@reduxjs/toolkit"; 
import userReducer from "../redux/slicer/userSlice"; 
import dailyTargetReducer from "../redux/slicer/dailyTargetSlice";
import habitReducer from "../redux/slicer/habitSlice";
import studyReducer from "../redux/slicer/studySlice";
import subjectTrackerReducer from "../redux/slicer/subjectTrackerSlice";
import targetReducer from "../redux/slicer/targetSlice";

const store = configureStore({
  reducer: {
    user : userReducer,
    dailyTarget : dailyTargetReducer,
    habit : habitReducer,
    study : studyReducer,
    subjectTracker : subjectTrackerReducer,
    target : targetReducer,
  },
});

export default store;


