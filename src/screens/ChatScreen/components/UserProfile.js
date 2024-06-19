import React from "react";
import { Box, Typography, Avatar, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { getSelectedPerson } from "../../../redux/chat/chatSelectors";

const UserProfile = ({ onClose }) => {
  const selectedPerson = useSelector(getSelectedPerson);

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

      {selectedPerson?.email && (
        <>
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
            <Typography variant="body1">{selectedPerson?.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedPerson?.phoneNumber}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedPerson?.email}
            </Typography>
          </Box>
          <Divider />
        </>
      )}
    </Box>
  );
};

export default UserProfile;
