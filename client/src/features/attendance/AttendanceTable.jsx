import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAttendanceOfDate,
  getStatus,
  selectAllAttendance,
} from "./attandaceSlice";
import { selectAllEmployees } from "../employess/employeeSlice";
import SimpleDialogue from "./SimpleDialogue";
import EnhancedTableHead from "./subcomponents/EnhancedTableHead";
import Title from "./Title";
import { getComparator, get_productive_hours, stableSort } from "./usefulFunctions";
import useAuth from '../../hooks/useAuth'
import CircularLoader from "../../Components/CircularLoader";


const headCells = [
  {
    id: "deviceId",
    numeric: true,
    disablePadding: true,
    label: "DeviceId",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "working_hours",
    numeric: true,
    disablePadding: true,
    label: "Working Hours",
  },
];

export default function AttendanceTable({ date }) {
  const {isAdmin,user}=useAuth();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("deviceId");
  const employees = useSelector(selectAllEmployees);
  const attendanceData = useSelector(selectAllAttendance);
  const attendanceStatus = useSelector(getStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchAllAttendanceOfDate({
        date: new Date(date).toISOString(),
      })
    );
  }, [date]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const get_Allattendance = (id) => {
    const result = attendanceData
      .map((item) => {
        return item.employeeId == id
          ? { attendanceTime: item.attendanceTime, state: item.state }
          : null;
      })
      .filter((item) => item && item);
    result.sort((a, b) => {
      return new Date(a.attendanceTime) - new Date(b.attendanceTime);
    });
    return result.length ? result : null;
  };

  const allemployees = employees.filter((item) => {
    if (!isAdmin) return item.id == user.id;
    return item;
  });
  //  console.log(allemployees)

   
  const attendanceRows = allemployees.map((item) => {
    return {
      id:item.id,
      deviceId: item.deviceId,
      name: item.name,
      working_hours: get_productive_hours(get_Allattendance(item.id)),
      biometricTime: get_Allattendance(item.id),
    };
  });

  // const attendanceRows2 = attendanceRows.filter((item) => {
  //   if (localStorage.getItem('employeeId')) return item.id == localStorage.getItem('employeeId')
  //   return item;
  // });
  
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
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ p: 2 }}>
            <Title>Attendance of {new Date(date).toDateString()} </Title>
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table aria-labelledby="tableTitle" size={"small"}>
                <EnhancedTableHead
                  headCells={headCells}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={attendanceRows.length}
                />
                <TableBody>
                  {attendanceStatus == "pending" ? (
                    <TableRow>
                      <TableCell>
                     <CircularLoader/>
                      </TableCell>
                    </TableRow>
                  ) : attendanceStatus == "rejected" ? (
                    <TableRow>
                      <TableCell>
                        <h2>No Result Found</h2>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {stableSort(
                        attendanceRows,
                        getComparator(order, orderBy)
                      ).map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.name}
                          >
                            <TableCell>{row.deviceId}</TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              {row.name}
                            </TableCell>
                            <TableCell align="right">
                              <Stack  justifyContent="left" direction='column' sx={{paddingRight: '10px'}}>
                              {row.working_hours
                                ? `${row.working_hours} Hours`
                                : isNaN(row.working_hours)
                                ? "TBD Hours"
                                : " "}
                              {row.biometricTime ? (
                              <Box  sx={{paddingRight: '10px'}}>  <SimpleDialogue
                              
                                  //sending props as array of all checkin and chechkout
                                  biometricTime={row.biometricTime}
                                  name={row.name}
                                /></Box>
                              ) : (
                     
                                     <h4 style={{color:'#9c2222'}}>Absent</h4>
                           
                              )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
