import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import axiosAuth from "../../api/axios";

const employeeAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});
const initialState = employeeAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchAllEmployees = createAsyncThunk(
  "employees/fetchAllEmployees",
  async () => {
    try {
      const res = await axiosAuth.get('/employees', {});
    
      
       // console.log(res);
      return [...res.data.data];
    } catch (error) {

      console.log("error occured in fetching users");
      console.log(error);
      throw error;
    }
  }
);


export const addNewEmployee = createAsyncThunk(
  "employees/addNewEmployee",

  async (newEmployee) => {
    console.log(newEmployee);
    try {
      const res = await axiosAuth({
        method: "post",
        url: `/employees`,
        data: newEmployee,
      });
      console.log(res);
      return res.data.data;
    } catch (error) {
      console.log("error occured in adding users");
      console.log(error);
      throw error;
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (intialVal) => {
    try {
      const { name, designation, email, id,role } = intialVal;

      const res = await axiosAuth({
        method: "put",
        url: `/employees/${id}`,
        data: { name, designation, email,role },
      });
      console.log(res);
      return res.data.data;
    } catch (error) {
      console.log("error occured in updating users");
      console.log(error);
      return error;
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (intialVal) => {
    try {
      const { id } = intialVal;
      console.log(id);
      const res = await axiosAuth({
        method: "delete",
        url: `/employees/${id}`,
      });
      console.log(res);
      return id;
    } catch (error) {
      console.log("error occured in deleting users");
      console.log(error);
      throw error;
    }
  }
);

const employeeSlice = createSlice({
  name: "attandacne",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchAllEmployees.fulfilled, (state, action) => {
      state.status = "fulfilled";
      employeeAdapter.upsertMany(state, action.payload);
    }),
      builder.addCase(fetchAllEmployees.pending, (state, action) => {
        state.status = "pending";
      }),
      builder.addCase(fetchAllEmployees.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      }),
      builder.addCase(addNewEmployee.fulfilled, (state, action) => {
        employeeAdapter.addOne(state, action.payload);
      }),
      builder.addCase(updateEmployee.fulfilled, (state, action) => {
        employeeAdapter.upsertOne(state, action.payload);
      }),
      builder.addCase(deleteEmployee.fulfilled, (state, action) => {
        employeeAdapter.removeOne(state, action.payload);
      });
  },
});

export const {
  selectAll: selectAllEmployees,
  selectById: getEmployeeById,
  selectIds: selectEmployeeIds,
} = employeeAdapter.getSelectors((state) => state.Employee);

export const getEmployeeStatus = (state) => state.Employee.status;

export default employeeSlice.reducer;
