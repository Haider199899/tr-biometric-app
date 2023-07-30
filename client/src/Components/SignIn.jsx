import * as React from "react";
import {
  CssBaseline,
  Link,
  Box,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthLogin } from "./AuthLogin";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

function Copyright(props) {
  const { getaccessToken } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const token = getaccessToken();
  const navigate = useNavigate();
  React.useEffect(() => {
    console.log(token);
    if (token) {
      {
        navigate(from, { replace: true });
      }
    }
  }, [token]);

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
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const theme = createTheme();
export default function SignIn() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Stack direction="row">
              <img
                width="190"
                height="87"
                src="https://technologyrivers.com/wp-content/uploads/2019/04/technology-rivers.png"
                className="attachment-full size-full entered lazyloaded"
                alt=""
                data-lazy-src="https://technologyrivers.com/wp-content/uploads/2019/04/technology-rivers.png"
                data-ll-status="loaded"
              />
            </Stack>
          </Box>
          <AuthLogin />
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
