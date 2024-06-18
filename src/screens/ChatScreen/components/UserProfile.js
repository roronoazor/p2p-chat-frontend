import React from "react";
import { Box, Typography, Avatar, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserProfile = ({ onClose }) => {
  return (
    <Box sx={{ width: "300px", borderLeft: "1px solid #ddd", padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Avatar
          src="/path/to/avatar.jpg"
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="body1">Daina Moore</Typography>
        <Typography variant="body2" color="textSecondary">
          +032165487924
        </Typography>
        <Typography variant="body2" color="textSecondary">
          dianamoore@gmail.com
        </Typography>
      </Box>
      <Divider />
    </Box>
  );
};

export default UserProfile;
