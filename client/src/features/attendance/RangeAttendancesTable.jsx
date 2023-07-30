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
import React from "react";
import { useSelector } from "react-redux";
import { getStatus } from "./attandaceSlice";
import { selectAllEmployees } from "../employess/employeeSlice";
import SimpleDialogue from "./SimpleDialogue";
import EnhancedTableHead from "./subcomponents/EnhancedTableHead";
import { getComparator, stableSort } from "./usefulFunctions";
import CircularLoader from "../../Components/CircularLoader";
import Title from "./Title";
import WeekendIcon from '@mui/icons-material/Weekend';
import PoolIcon from '@mui/icons-material/Pool';
export default function RangeAttendancesTable({ days, attendances }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("deviceId");
  const employees = useSelector(selectAllEmployees);
  const attendanceStatus = useSelector(getStatus);

  const columns = days.map((item) => {
    return { id: item, label: new Date(item).toDateString() };
  });
  columns.unshift({ id: "Employeename", label: "Name" });
  columns.unshift({ id: "deviceId", label: "DeviceId" });
  columns.push({ id: "working_hours", label: "Total Hours" });


  const attendances2 = attendances.map((item) => {
    const result = item.dayHours.reduce((sum, { phours }) => {
      if (phours) sum = sum + phours;
      return sum;
    }, 0);
    item.working_hours = result;
    item.employeeName = employees.find(
      (emp) => emp.id === item.employeeId
    ).name;
    item.deviceId = employees.find(
      (emp) => emp.id === item.employeeId
    ).deviceId;
    return item;
  });


  const handleRequestSort = (e,property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <>
      <Container
        sx={{
          mb: 4,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Paper sx={{ width: "100%", overflow: "hidden" ,p: 2}}>
        <Title>Report</Title>
          <TableContainer sx={{ maxHeight: 560 }}>
            <Table aria-label="sticky table">
              <EnhancedTableHead
                headCells={columns}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={attendances2.length}
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
                      attendances2,
                      getComparator(order, orderBy)
                    ).map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.deviceId}
                        >
                          <TableCell> {row.deviceId} </TableCell>
                          <TableCell> {row.employeeName} </TableCell>
                          
                          {row.dayHours.map((column, index) => {
                            return (
                              <TableCell key={index} align='center' sx={{backgroundColor:new Date(column.date).getDay()==6 || new Date(column.date).getDay()==0 ?'#E4ECAF':''}}>
                            
                                  {column.phours
                                    ?<p style={{whiteSpace:'nowrap'}}>{`${column.phours} Hours`}</p>
                                    : isNaN(column.phours)
                                    ? <p style={{whiteSpace:'nowrap'}}>TBD Hours</p>
                                    : ""}
                                  {column.biomatricTime ? (
                                    <SimpleDialogue
                                      biometricTime={column.biomatricTime}
                                      name={row.employeeName}
                                    />
                                  ) : 
                                  new Date(column.date).getDay()==6 || new Date(column.date).getDay()==0 ?
                                  (
                                    <>Weekend <PoolIcon/> </>
                                  ):
                                  (
                                    <h4 style={{color:'#9c2222'}}>Absent</h4>
                                  )}
                              
                              </TableCell>
                            );
                          })}
                          <TableCell sx={{ fontWeight: "bold" }} align="right">
                          <p style={{whiteSpace:'nowrap'}}>{`${row.working_hours} Hours`}</p>
                         
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
      </Container>
    </>
  );
}