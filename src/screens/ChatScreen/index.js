import React, { useState, useEffect } from "react";
import { Box, Alert, Stack } from "@mui/material";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import UserProfile from "./components/UserProfile";
import { Transition } from "react-transition-group";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config/serverUrls";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, getUserToken } from "../../redux/auth/authSelectors";
import {
  setPersons,
  setUserJoined,
  setUserDropped,
  appendMessage,
  setOfflineMessages,
} from "../../redux/chat/chatSlice";

const duration = 300;

const defaultStyle = {
  transition: `width ${duration}ms ease-in-out`,
  width: "300px",
};

const transitionStyles = {
  entering: { width: "300px" },
  entered: { width: "300px" },
  exiting: { width: "0px" },
  exited: { width: "0px" },
};

const ChatScreen = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [connected, setConnected] = useState(false);

  const userData = useSelector(getUserData);
  const dispatch = useDispatch();
  const token = useSelector(getUserToken);

  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("userJoined", { userId: userData.id });
    });

    const handleAllUsers = (users) => {
      dispatch(setPersons(users));
    };

    const handleOfflineMessages = (messages) => {
      dispatch(setOfflineMessages({ myId: userData.id, messages }));
    };

    const handleUserJoined = (user) => {
      dispatch(setUserJoined(user));
    };

    const handleUserDropped = (user) => {
      dispatch(setUserDropped(user));
    };

    const handleMessageReceived = (message) => {
      dispatch(appendMessage({ myId: userData.id, message }));
    };

    const handleSearchResults = (users) => {
      dispatch(
        setPersons(
          users.map((user) => ({
            ...user,
            date: "",
            lastMessage: "",
            unreadCount: 0,
          }))
        )
      );
    };

    // register event handlers for socket events
    socket.on("allUsers", handleAllUsers);
    socket.on("userJoined", handleUserJoined);
    socket.on("userDropped", handleUserDropped);
    socket.on("messageReceived", handleMessageReceived);
    socket.on("searchResults", handleSearchResults);
    socket.on("offlineMessages", handleOfflineMessages);

    socket.emit("searchUsers", "");
    socket.emit("userOnline", { userId: userData?.id });

    socket.on("disconnect", () => {
      socket.emit("userDropped", { userId: userData.id });
      setConnected(false);
    });

    window.socket = socket;

    return () => {
      socket.disconnect();
    };
  }, [userData.id, token]);

  return (
    <>
      {!connected && (
        <Stack sx={{ width: "100%" }}>
          <Alert variant="filled" severity="error">
            Disconnected from chat socket
          </Alert>
        </Stack>
      )}
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Box sx={{ flex: 1, display: "flex" }}>
          <ChatWindow />
          <Transition in={isProfileOpen} timeout={duration} unmountOnExit>
            {(state) => (
              <Box
                sx={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                  overflow: "hidden",
                  borderLeft: "1px solid #ddd",
                }}
              >
                <UserProfile onClose={handleToggleProfile} />
              </Box>
            )}
          </Transition>
        </Box>
      </Box>
    </>
  );
};

export default ChatScreen;
