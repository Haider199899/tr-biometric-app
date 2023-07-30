import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from '../features/attendance/attandaceSlice'
import employeeReducer from '../features/employess/employeeSlice'
const store=configureStore({
    reducer:{
        Attandace:attendanceReducer,
        Employee:employeeReducer
    }
})

export default store;