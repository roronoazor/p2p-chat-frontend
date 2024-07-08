import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { getSelectedPerson } from "../../../redux/chat/chatSelectors";
import { getUserData } from "../../../redux/auth/authSelectors";
import { addAllowedUser, getAllowedUsers } from "../../../utils/indexedDb";

const ChatWindow = () => {
  const selectedPerson = useSelector(getSelectedPerson);
  const userData = useSelector(getUserData);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedByMe, setBlockedByMe] = useState(false);
  const [blockedByOther, setBlockedByOther] = useState(false);

  // Select messages from the state and filter them based on the selected person and the current user
  const messages = useSelector((state) =>
    state.chat.messages
      .filter(
        (msg) =>
          (msg.from === userData.id && msg.to === selectedPerson.id) ||
          (msg.from === selectedPerson.id && msg.to === userData.id)
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  );

  const blockedUsers = useSelector((state) => state.chat.blockedUsers);

  const [message, setMessage] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);

  const handleUserBlocked = (blockedUser) => {
    if (blockedUser.userIdToBlock == selectedPerson.id) {
      setIsBlocked(true);
      setBlockedByOther(true);
    }
  };

  useEffect(() => {
    const checkBlockedStatus = async () => {
      const allowedUsers = await getAllowedUsers(userData.id);
      const blockedByMe = blockedUsers.some(
        (user) =>
          user.userId === userData.id &&
          user.blockedUserId === selectedPerson.id
      );
      const blockedByOther = blockedUsers.some(
        (user) =>
          user.userId === selectedPerson.id &&
          user.blockedUserId === userData.id
      );
      const isAllowed = allowedUsers.some(
        (user) =>
          (user.userId === userData.id &&
            user.allowedUserId === selectedPerson.id) ||
          (user.userId === selectedPerson.id &&
            user.allowedUserId === userData.id)
      );

      setBlockedByMe(blockedByMe);
      setBlockedByOther(blockedByOther);
      setIsBlocked(blockedByMe || blockedByOther);
      setIsAllowed(isAllowed);
    };

    if (selectedPerson) {
      checkBlockedStatus();
    }
  }, [selectedPerson, userData.id, blockedUsers]);

  useEffect(() => {
    if (window.socket) {
      window.socket.on("userBlocked", handleUserBlocked);
    }
  }, []);

  const whiteList = () => {
    addAllowedUser({ userId: userData.id, allowedUserId: selectedPerson.id });
    setIsAllowed(true);
  };

  const blackList = () => {
    // emit a block user signal
    window.socket.emit("blockUser", { userIdToBlock: selectedPerson.id });
    setIsBlocked(true);
    setBlockedByMe(true);
  };

  const sendMessage = () => {
    if (window.socket) {
      const payload = {
        from: userData.id,
        to: selectedPerson.id,
        message,
        timestamp: new Date().toISOString(),
      };
      window.socket.emit("sendMessage", payload);
      setMessage("");
    } else {
      alert("socket disconnected");
    }
  };

  if (isBlocked) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {blockedByMe && (
          <Typography variant="h4">You blocked this user.</Typography>
        )}
        {blockedByOther && (
          <Typography variant="h4">You were blocked by this user.</Typography>
        )}
      </Box>
    );
  }

  const isCurrentUserReceiver = messages.every(
    (msg) => msg.from !== userData.id && msg.to === userData.id
  );

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
        {isAllowed ? (
          <>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.from === userData.id ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    backgroundColor:
                      msg.from === userData.id ? "#e1f5fe" : "#f1f1f1",
                    padding: 1,
                    borderRadius: 1,
                  }}
                >
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ ml: 1, alignSelf: "flex-end" }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            ))}
          </>
        ) : messages.length == 0 ? (
          <></>
        ) : isCurrentUserReceiver ? (
          <>
            {messages
              .reverse()
              .slice(0, 1)
              .map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.from === userData.id ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      backgroundColor:
                        msg.from === userData.id ? "#e1f5fe" : "#f1f1f1",
                      padding: 1,
                      borderRadius: 1,
                    }}
                  >
                    {msg.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ ml: 1, alignSelf: "flex-end" }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
            <Box>
              <Typography variant="h6">
                You have messages from {selectedPerson.name}. Do you want to
                accept or block this user?
              </Typography>
              <Button
                onClick={whiteList}
                color="primary"
                sx={{ marginRight: 1 }}
                variant="contained"
              >
                Accept
              </Button>
              <Button
                onClick={blackList}
                color="secondary"
                sx={{ marginRight: 1 }}
                variant="contained"
              >
                Block
              </Button>
            </Box>
          </>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.from === userData.id ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    backgroundColor:
                      msg.from === userData.id ? "#e1f5fe" : "#f1f1f1",
                    padding: 1,
                    borderRadius: 1,
                  }}
                >
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ ml: 1, alignSelf: "flex-end" }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            ))}
          </>
        )}
      </Box>
      {isAllowed ? (
        <>
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
        </>
      ) : messages.length == 0 ? (
        <>
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
        </>
      ) : isCurrentUserReceiver ? null : (
        <>
          {" "}
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
        </>
      )}
    </Box>
  );
};

export default ChatWindow;
