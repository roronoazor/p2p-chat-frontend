import React from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import logoImg from "../../assets/logo.png";

const SignUpScreen = () => {
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
            name="phone"
            autoComplete="phone"
            sx={{ marginBottom: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: "#6E80A4",
              textTransform: "none",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpScreen;
