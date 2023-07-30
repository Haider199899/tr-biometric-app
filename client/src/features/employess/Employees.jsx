import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import AddButton from "./AddButton";
import Title from "../attendance/Title";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEmployees, getEmployeeStatus, selectEmployeeIds } from "./employeeSlice";
import EmployeRow from "./EmployeRow";
import CircularLoader from "../../Components/CircularLoader";

export default function Employees() {
  const employess = useSelector(selectEmployeeIds);
  const employeeStatus = useSelector(getEmployeeStatus);
  // console.log(employess)
  const dispatch=useDispatch();
  useEffect(() => {
    dispatch(
      fetchAllEmployees({})
    );
  }, []);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          mt: 10,
          mb: 4,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Paper sx={{ p: 2 }}>
          <Title>Employees</Title>
          <TableContainer sx={{ maxHeight: 560 }}>
            <Table size="small">
              <TableHead>
                <TableRow hover>
                  <TableCell>DeviceId</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Desgination</TableCell>
                  <TableCell>CreatedAt</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {employeeStatus == "pending" ? (
                  <TableRow>
                    <TableCell>
                   <CircularLoader/>
                    </TableCell>
                  </TableRow>
                ) : employeeStatus == "rejected" ? (
                  <TableRow>
                    <TableCell>
                      <h2>No Result Found</h2>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {employess.map((item) => (
                      <EmployeRow id={item} key={item} />
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <AddButton />
        </Paper>
      </Container>
    </>
  );
}
