import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import UserProfile from "./components/UserProfile";
import { Transition } from "react-transition-group";

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

  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
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
  );
};

export default ChatScreen;
