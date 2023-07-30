import SignIn from "./Components/SignIn";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import "./styles.css";
import NoFound from "./NoFound";

// import { AttendanceByRange } from "./features/attendance/AttendanceByRange";

import RequireAuth from "./utils/route-guard/RequireAuth";
import { JWTProvider as AuthProvider } from "./context/JWTContext";
import UnAuthorized from "./UnAuthorized";
import AdminAuth from "./utils/route-guard/AdminAuth";
import Loadable from "./Components/Loadable";
import { lazy } from "react";
import ResetPassword from "./Components/ResetPassword";
const AttendanceByRange = Loadable(lazy(() => import("./features/attendance/AttendanceByRange")));
const Attendance = Loadable(lazy(() => import("./features/attendance/Attendance")));
const Employees = Loadable(lazy(() => import("./features/employess/Employees")));
const Home = Loadable(lazy(() => import("./Components/Home")));
function App() {
  return (
    <Box>
      <AuthProvider>
        <Routes>
          <Route element={<RequireAuth allowedRole={[1234, 4567, 7890]} />}>
           
              <Route path="/" element={<Home />}>
                <Route index element={<Attendance />} />

                <Route element={<AdminAuth/>}>
                  <Route path="employee" element={<Employees />} />
                </Route>

                <Route path="attendance" element={<Attendance />} />
                <Route
                  path="report"
                  element={<AttendanceByRange />}
                />
              </Route>
          
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="unauthorized" element={<UnAuthorized />} />
          <Route path="*" element={<NoFound />} />
        </Routes>
      </AuthProvider>
    </Box>
  );
}

export default App;
