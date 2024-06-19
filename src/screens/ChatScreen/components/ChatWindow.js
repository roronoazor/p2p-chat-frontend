import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { getSelectedPerson } from "../../../redux/chat/chatSelectors";
import { getUserData } from "../../../redux/auth/authSelectors";

const ChatWindow = () => {
  const selectedPerson = useSelector(getSelectedPerson);
  const userData = useSelector(getUserData);
  // Select messages from the state and filter them based on the selected person and the current user
  const messages = useSelector((state) =>
    state.chat.messages
      // Filter messages where either the current user is the sender and the selected person
      // is the receiver,
      // or the selected person is the sender and the current user is the receiver
      .filter(
        (msg) =>
          (msg.from === userData.id && msg.to === selectedPerson.id) ||
          (msg.from === selectedPerson.id && msg.to === userData.id)
      )
      // Sort messages by timestamp in descending order to have the most recent messages
      // at the bottom
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  );

  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (window.socket) {
      // Send a message to the server
      const payload = {
        from: userData.id,
        to: selectedPerson.id,
        message,
      };
      window.socket.emit("sendMessage", payload);
      setMessage("");
    }
  };

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          minHeight: 40,
          borderBottom: "1px solid #ddd",
        }}
      >
        {selectedPerson?.email && (
          <>
            <Avatar
              src="/path/to/avatar.jpg"
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="h6">{selectedPerson?.name}</Typography>
          </>
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column-reverse",
          paddingY: 2,
          paddingX: 8,
          overflowY: "auto",
          backgroundColor: "#f6f6f6",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                msg.from == userData.id ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                backgroundColor:
                  msg.from == userData.id ? "#e1f5fe" : "#f1f1f1",
                padding: 1,
                borderRadius: 1,
              }}
            >
              {msg.message}
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, alignSelf: "flex-end" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
      </Box>
      {selectedPerson?.email && (
        <>
          <Box
            sx={{
              display: "flex",
              paddingY: 2,
              paddingX: 8,
              backgroundColor: "#f6f6f6",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              sx={{
                mb: 2,
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                border: 0,
                height: "56px",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={sendMessage}>
                      <SendIcon sx={{ color: "#8BABD8" }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "12px",
                  height: "56px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatWindow;
