import React, { useState, useEffect, useCallback } from "react";
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
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";
import { getPersons } from "../../../redux/chat/chatSelectors";
import {
  setSelectedPerson,
  updateReadCount,
} from "../../../redux/chat/chatSlice";
import { getUserData } from "../../../redux/auth/authSelectors";

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
  const [searchTerm, setSearchTerm] = useState("");
  const persons = useSelector(getPersons);
  const blockedPersons = useSelector((state) => state.chat.blockedUsers);
  const userData = useSelector(getUserData);
  const dispatch = useDispatch();

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (window.socket) {
        window.socket.emit("searchUsers", query);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                border: "none",
              },
            },
          }}
        />
      </Box>
      <Box sx={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
        <List>
          {persons.map((user, index) => (
            <ListItem
              button
              key={index}
              selected={selectedIndex === index}
              onClick={() => {
                handleListItemClick(index);
                dispatch(setSelectedPerson(user));
                dispatch(updateReadCount({ selectedPersonId: user.id }));
              }}
              sx={{
                backgroundColor:
                  selectedIndex === index ? "#f5f5f5" : "inherit",
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
                  invisible={!user.online}
                >
                  <Avatar sx={{ bgcolor: "#6E80A4", fontSize: 16 }}>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>
                </StyledBadge>
              </Box>
              <ListItemText
                primary={
                  user.id === userData.id ? `${user.name} (You)` : user.name
                }
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
                    {user.lastMessage && user.lastMessage.length > 15
                      ? `${user.lastMessage.substring(0, 17)}...`
                      : user.lastMessage}
                  </Typography>
                }
              />
              <Stack spacing={2}>
                <Typography textAlign={"right"} variant="caption">
                  {user.date}
                </Typography>
                <Badge badgeContent={user.unreadCount} color="primary"></Badge>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
