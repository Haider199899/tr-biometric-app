import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Link,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Outlet, useNavigate } from "react-router-dom";
import SideBarList from "./SideBarList";
import { fetchAllEmployees } from "../features/employess/employeeSlice";
import { useDispatch } from "react-redux";
import { Logout } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://technologyrivers.com">
        Technology-Rivers
      </Link>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));



export default function Home() {
  const [open, setOpen] = React.useState(true);
   const {logout}=useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleLogOut = () => {
    console.log("logout");
     logout();
    navigate("/signin", { replace: true });
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };
    const dispatch=useDispatch();
  React.useEffect(() => {
   dispatch(fetchAllEmployees());
  }, [])
  

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Main Navbar */}
         
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
            backgroundColor: "#ffffff", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon color="primary" />
          </IconButton>
          <Typography noWrap sx={{ flexGrow: 1 }}>
            <a href="">
              <img
                width="100"
                height="50"
                src="https://technologyrivers.com/wp-content/uploads/2019/04/technology-rivers.png"
                className="attachment-full size-full entered lazyloaded"
                alt=""
                data-lazy-src="https://technologyrivers.com/wp-content/uploads/2019/04/technology-rivers.png"
                data-ll-status="loaded"
              />
            </a>
          </Typography>
          <IconButton color="inherit" onClick={handleMenu}>
            <Avatar alt="Remy Sharp" src="https://i.ibb.co/7rGgWws/Img1.jpg" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* side bar  */}

      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon color="primary" />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
         <SideBarList/>
          <Divider sx={{ my: 1 }} />
        </List>
      </Drawer>

      {/* sidebar end  */}

      <Box
        sx={{
     
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />

        {/* this is main page which is showing productive hours for yesterday Attendance */}

        <Outlet />
        
        <Copyright sx={{ pt: 4 }} />
      </Box>
    </Box>
  );
}
