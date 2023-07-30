import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";
const initialState = {
  attendance: [],
  status: "idle",
  error: null,
};

export const fetchAllAttendanceOfDate = createAsyncThunk(
  "/attandace/fetchAllAttendanceOfDate",
  async ({ date }) => {
    console.log(date)
    try {
      const res = await axios.get(`/attendances/employees`, {
        params: {date },
      });
        console.log(res.data.data);
      return [...res.data.data];
    } catch (error) {
      console.log("error occured in fetchAllAttendanceOfDate ");
      console.log(error);
      throw error;
    }
  }
);

export const fetchAllAttendanceBetweenDate = createAsyncThunk(
  "attandace/fetchAllAttendanceBetweenDate",
  async ({ from, to }) => {
    console.log(to)
    try {
      const res = await axios.get("/report", {
        params: {from,to},
      });
      console.log(res);
      return [...res.data.data];
    } catch (error) {
      console.log("error occured in  fetchAllAttendanceBetweenDate");
      console.log(error);
      throw error;
    }
  }
);


const attendanceSlice = createSlice({
  name: "attandacne",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchAllAttendanceOfDate.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.attendance = [...action.payload];
    }),
      builder.addCase(fetchAllAttendanceOfDate.pending, (state) => {
        state.status = "pending";
      }),
      builder.addCase(fetchAllAttendanceOfDate.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      }),
      builder.addCase(fetchAllAttendanceBetweenDate.pending, (state) => {
        state.status = "pending";
      }),
      builder.addCase(fetchAllAttendanceBetweenDate.rejected, (state) => {
        state.status = "rejected";
      });

    builder.addCase(
      fetchAllAttendanceBetweenDate.fulfilled,
      (state, action) => {
        state.status = "fulfilled";
        state.attendance = [...action.payload];
      }
    );
  },
});


export const selectAllAttendance = (state) => state.Attandace.attendance;
export const getStatus = (state) => state.Attandace.status;
export const getError = (state) => state.Attandace.error;
export default attendanceSlice.reducer;
