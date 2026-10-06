import { configureStore } from "@reduxjs/toolkit"; 
import userReducer from "../redux/slicer/userSlice"; 
import dailyTargetReducer from "../redux/slicer/dailyTargetSlice";


const store = configureStore({
  reducer: {
    user : userReducer,
    dailyTarget : dailyTargetReducer,
  },
});

export default store;


