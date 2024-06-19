import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import logoImg from "../../assets/logo.png";
import axios from "axios";
import { LOGIN_URL } from "../../config/serverUrls";
import { extractErrorMessage } from "../../modules/helpers";
import { ALERT_TYPES } from "../../config/alerts";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/auth/authSlice";
import { LoadingButton } from "@mui/lab";

const LoginScreen = () => {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onFormSubmit = (event) => {
    if (!formData?.email || !formData?.phoneNumber) {
      setMessage("Please fill all relevant fields");
      setSeverity("error");
      setOpen(true);
      return;
    }

    setLoading(true);
    axios
      .post(LOGIN_URL, formData)
      .then((response) => {
        if (response.status === 201) {
          setLoading(false);
          setSeverity(ALERT_TYPES.SUCCESS);
          setMessage("Login Successful");
          setOpen(true);

          let userData = response.data;
          sessionStorage.setItem("userData", JSON.stringify(userData));
          dispatch(loginUser(userData));
          navigate("/chat"); // go to chat
        } else {
          setLoading(false);
          setSeverity(ALERT_TYPES.ERROR);
          setMessage("Could not login with this credentials");
          setOpen(true);
        }
      })
      .catch((error) => {
        setLoading(false);

        // Start with a default message
        let message = "An error occurred while logging in";

        // Check if there's a response and data, and collect all messages
        const messages = extractErrorMessage(error);

        // Join all messages into a single string if there are any
        if (messages.length > 0) {
          message = messages.join("; ");
        }

        setMessage(message);
        setSeverity(ALERT_TYPES?.ERROR);
        setOpen(true);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#8BABD8",
      }}
    >
      <Box
        maxWidth="420px"
        sx={{
          backgroundColor: "#FFFFFF",
          padding: 8,
          borderRadius: 2,
          boxShadow: 5,
          textAlign: "center",
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
        <Box sx={{ marginBottom: 4 }}>
          <img src={logoImg} alt="Chat Logo" />
          <Typography variant="h5">Login</Typography>
        </Box>
        <Box>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            onChange={handleChange}
            name="email"
            autoComplete="email"
            sx={{ marginBottom: 1 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            onChange={handleChange}
            name="phoneNumber"
            autoComplete="phone"
            sx={{ marginBottom: 2 }}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: "#6E80A4",
              textTransform: "none",
            }}
            onClick={onFormSubmit}
            loading={isLoading}
          >
            Login
          </LoadingButton>
          <Typography sx={{ marginTop: 2 }}>
            Don't have an account?{" "}
            <Link href="/signup" color="primary">
              Signup
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginScreen;
