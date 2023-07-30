import * as React from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { NavLink } from "react-router-dom";
import DateRangeIcon from "@mui/icons-material/DateRange";
import useAuth from "../hooks/useAuth";

const SideBarList = () => {
    const {isAdmin}=useAuth();
  return (
    <>
    <ListItemButton component={NavLink} to="employee"  sx={{ display:isAdmin?'flex':'none'}}>
      <ListItemIcon>
        <GroupsIcon />
      </ListItemIcon>
      <ListItemText
        sx={{ color: "black", textDecoration: "none" }}
        primary="Employees"
      />
    </ListItemButton>

    <ListItemButton component={NavLink} to="attendance">
      <ListItemIcon>
        <FingerprintIcon />
      </ListItemIcon>

      <ListItemText primary="Attendance" />
    </ListItemButton>

    <ListItemButton component={NavLink} to="report">
      <ListItemIcon>
        <DateRangeIcon />
      </ListItemIcon>

      <ListItemText primary="Report" />
    </ListItemButton>
  </>
  )
}

export default SideBarList

