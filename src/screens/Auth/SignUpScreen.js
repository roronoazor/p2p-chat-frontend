import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Alert,
  Snackbar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import logoImg from "../../assets/logo.png";
import axios from "axios";
import { SIGNUP_URL } from "../../config/serverUrls";
import { ALERT_TYPES } from "../../config/alerts";
import { extractErrorMessage } from "../../modules/helpers";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/auth/authSlice";

const SignUpScreen = () => {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
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
    if (!formData?.email || !formData?.name || !formData?.phoneNumber) {
      setMessage("Please fill all relevant fields");
      setSeverity("error");
      setOpen(true);
      return;
    }

    setLoading(true);
    axios
      .post(SIGNUP_URL, formData)
      .then((response) => {
        if (response.status === 201) {
          setLoading(false);
          setSeverity(ALERT_TYPES.SUCCESS);
          setMessage("Signup Successful");
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
        <Box sx={{ marginBottom: 4 }}>
          <img src={logoImg} alt="Chat Logo" />
        </Box>
        <Box>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            onChange={handleChange}
            autoComplete="name"
            autoFocus
            sx={{ marginBottom: 1 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            onChange={handleChange}
            autoComplete="email"
            sx={{ marginBottom: 1 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phoneNumber"
            onChange={handleChange}
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
            Sign Up
          </LoadingButton>
          <Typography sx={{ marginTop: 2 }}>
            Have an account?{" "}
            <Link href="/login" color="primary">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpScreen;
