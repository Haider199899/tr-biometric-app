import { Container, TextField, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { subDays } from "date-fns";
import AttendanceTable from "./AttendanceTable";

export default function Attendance() {
  const [value, setValue] = React.useState();

  useEffect(() => {
    setValue(
      subDays(
        new Date().getDay() == 1
          ? new Date(subDays(new Date(), 2))
          : new Date(),
        1
      )
    );
  }, []);

  const handleDateChange = (newValue) => {
    setValue(newValue.$d);
  };

  return (
    <>
      {value && (
        <Box>
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select a Date"
                value={value}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Container>
          <AttendanceTable date={value} />
        </Box>
      )}
    </>
  );
}
