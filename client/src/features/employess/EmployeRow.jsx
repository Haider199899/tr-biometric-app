import { Grid, TableCell, TableRow } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import DeletUser from "./DeleteUser";
import EditUser from "./EditUser";
import { getEmployeeById } from "./employeeSlice";
const EmployeRow = ({ id }) => {
  const employee = useSelector((state) => getEmployeeById(state, id));

  return (
    <>
      <TableRow hover>
        <TableCell>{employee.deviceId}</TableCell>
        <TableCell>{employee.name}</TableCell>
        <TableCell>{employee.email}</TableCell>
        <TableCell>{employee.designation}</TableCell>
        <TableCell>
          {new Date(employee.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell>
        <Grid
  container
  direction="row"
  justifyContent="center"
  alignItems="center"
>
          <EditUser data={employee} />
          <DeletUser id={employee.id}/>
          </Grid>
        </TableCell>
      </TableRow>
    </>
  );
};

export default EmployeRow;
