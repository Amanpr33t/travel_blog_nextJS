import { configureStore } from "@reduxjs/toolkit";
import EditSlice from "./slices/editSlice";

const store = configureStore({
  reducer: {
    edit: EditSlice.reducer
  }
})

export default store