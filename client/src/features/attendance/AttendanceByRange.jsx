import {
  Autocomplete,
  Container,
  TextField,
  Button,
  ClickAwayListener,
} from "@mui/material";
import React, { useEffect } from "react";
import "react-date-range/dist/styles.css";
import { DateRangePicker } from "react-date-range";
import { sub, subDays } from "date-fns";
import { useState } from "react";
import "react-date-range/dist/theme/default.css";
import { Box } from "@mui/system";
import DateRangeIcon from "@mui/icons-material/DateRange";
import {
  fetchAllAttendanceBetweenDate,
  selectAllAttendance,
} from "./attandaceSlice";
import { useDispatch, useSelector } from "react-redux";
import RangeAttendancesTable from "./RangeAttendancesTable";
import {
  selectAllEmployees,
  selectEmployeeIds,
} from "../employess/employeeSlice";
import { getDaysArray, get_productive_hours } from "./usefulFunctions";
import useAuth from "../../hooks/useAuth";
import { lastDayOfWeek } from 'date-fns'
import { startOfWeek } from 'date-fns'
import { subWeeks } from 'date-fns'

 const AttendanceByRange = () => {
  const {isAdmin,user,loading}=useAuth();
  const [oneEmployee, setOneEmployee] = React.useState("");
  const [range, setRange] = useState([
    {
      startDate: new Date(subWeeks(startOfWeek(new Date()), 1)),
      endDate: new Date(subDays(startOfWeek(new Date()),1)),
      key: "selection",
    },
  ]);





  const employees = useSelector(selectAllEmployees);
  const employeesList = employees.map((item) => {
    return { id: item.id, label: item.name};
  });
 


 

  const get_Allattendance = (ar) => {
    if (ar) {
      const result = ar
        .map((item) => {
          return { attendanceTime: item.attendanceTime, state: item.state };
        })
        .filter((item) => item && item);
      result.sort((a, b) => {
        return new Date(a.attendanceTime) - new Date(b.attendanceTime);
      });
      return result;
    }
    return null;
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchAllAttendanceBetweenDate({
        from: new Date(range[0].startDate).toISOString(),
        to:new Date( range[0].endDate).toISOString(),
      })
    );
  }, [range]);

  const attendances = useSelector(selectAllAttendance);
  const allemployees  = useSelector(selectEmployeeIds);
  
  const emplids  = allemployees.filter((item) => {
    if (!isAdmin) return item === user.id;
    return item;
  });

    

  const employeeList = [];
  for (let i = 0; i < emplids.length; i++) {
    let arr;
    arr = attendances.filter((item) => {
      const flag = item.employeeId == emplids[i];
      if (flag) return item;
    });
    employeeList.push({ [emplids[i]]: arr });
  }


  const daysArray = getDaysArray(range[0].startDate, range[0].endDate);
  const newAttendance = [];
  for (let e = 0; e < employeeList.length; e++) {
    let myar = { employeeId: null, dayHours: [] };
    if (employeeList[e]) {
      myar.employeeId = Object.keys(employeeList[e])[0];
      for (let i = 0; i < daysArray.length; i++) {
        const onedayAttendance = employeeList[e][myar.employeeId].filter(
          (item) => {
            const flag =
              new Date(item.attendanceTime).toDateString() ===
              new Date(daysArray[i]).toDateString();
            if (flag) return item;
          }
        );

        if (onedayAttendance.length > 1) {
          const biomatricTime = get_Allattendance(onedayAttendance);
      
          const phours = get_productive_hours(biomatricTime);
          myar.dayHours.push({
            biomatricTime,
            phours,
            date: daysArray[i],
          });
        } else {
          myar.dayHours.push({
            biomatricTime: null,
            phours: null,
            date: daysArray[i],
          });
        }
      }
    }
    newAttendance.push(myar);
  }
   


  const allAttendeces2 = newAttendance.filter((item) => {
    if (oneEmployee) return item.employeeId == oneEmployee.id;
    return item;
  });

  const [open, setOpen] = useState(false);
  const styles = {
    position: "fixed",
    bgcolor: "background.paper",
    zIndex: 2,
  };
  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  const handleClickAway = () => {
    setOpen(false);
  };
  const handleDate = (item) => {
    setRange([item.selection]);
  };
  const hanldeAutoCompleteChanges = (event, newValue) => {
    setOneEmployee(newValue);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Autocomplete
         sx={{ display:isAdmin?'flex':'none' ,width: 300,}}
          // disabled={!isAdmin}
          onChange={hanldeAutoCompleteChanges}
          disablePortal
          options={employeesList}
          isOptionEqualToValue={(option, value) => option.id === value.id}
       
          renderInput={(params) => <TextField {...params} label="Name" />}
        />
      </Container>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={handleClickAway}
        >
          <Box>
            <Button
              variant="outlined"
              startIcon={<DateRangeIcon />}
              onClick={handleClick}
              size="large"
            >
              Select Range
            </Button>
            {open ? (
              <Box sx={styles}>
                <DateRangePicker
                  onChange={handleDate}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={range}
                  direction="horizontal"
                />
              </Box>
            ) : null}
          </Box>
        </ClickAwayListener>
      </Container>
   
      <RangeAttendancesTable days={daysArray} attendances={allAttendeces2} />
    </>
  );
};

export default AttendanceByRange;