import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  Badge,
  Avatar,
  Stack,
} from "@mui/material";
import logoImg from "../../../assets/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";

const chatHistory = [
  {
    name: "Jessica Drew",
    date: "8:30 PM",
    text: "Ok, see you later",
  },
  {
    name: "David Moore",
    date: "8:16 PM",
    text: "I dont remember anything",
  },
  {
    name: "Greg James",
    date: "8:02 PM",
    text: "I got a job at SpaceX",
  },
  {
    name: "Emily Dorson",
    date: "7:42 AM",
    text: "Table for four, 5PM. Be there",
  },
  {
    name: "Office Chat",
    date: "7:08 AM",
    text: "Table for four, 5PM. Be there",
  },
  {
    name: "Little Sister",
    date: "Wed",
    text: "Tell momm i will be home for tea",
  },
];

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-dot": {
    height: 10,
    minWidth: 10,
    borderRadius: "50%",
    backgroundColor: "#44b700",
  },
}));

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ width: "300px", borderRight: "1px solid #ddd" }}>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <img
            src={logoImg}
            alt="Chat Logo"
            style={{ width: "112px", height: "42px" }}
          />
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search"
          sx={{
            mb: 2,
            borderRadius: "22px",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            height: "40px",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "22px",
              height: "40px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "22px",
              },
            },
          }}
        />
      </Box>
      <List>
        {chatHistory.map((chat, index) => (
          <ListItem
            button
            key={index}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index)}
            sx={{
              backgroundColor: selectedIndex === index ? "#f5f5f5" : "inherit",
              "&.Mui-selected": {
                backgroundColor: "#f5f5f5",
              },
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
              paddingX: 2,
            }}
          >
            <Box sx={{ position: "relative", mr: 2 }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                variant="dot"
                invisible={!true} // Replace with user's online status
              >
                <Avatar sx={{ bgcolor: "#6E80A4", fontSize: 16 }}>
                  {chat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
              </StyledBadge>
            </Box>
            <ListItemText
              primary={chat.name}
              secondary={
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "150px",
                  }}
                >
                  {chat.text.length > 15
                    ? `${chat.text.substring(0, 17)}...`
                    : chat.text}
                </Typography>
              }
            />
            <Stack spacing={2}>
              <Typography textAlign={"right"} variant="caption">
                {chat.date}
              </Typography>
              <Badge badgeContent={4} color="primary"></Badge>{" "}
              {/* Replace with actual number of new messages */}
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
