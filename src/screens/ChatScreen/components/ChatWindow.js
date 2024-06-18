// import React from "react";
// import { Box, Typography, TextField, IconButton } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";

// const ChatWindow = () => {
//   return (
//     <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//       <Box sx={{ flex: 1, padding: 2, overflowY: "auto" }}>
//         {/* Replace with dynamic messages */}
//         <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
//           <Typography
//             sx={{ backgroundColor: "#f1f1f1", padding: 1, borderRadius: 1 }}
//           >
//             OMG do you remember what you did last night at the work night out?
//           </Typography>
//           <Typography variant="caption" sx={{ ml: 1, alignSelf: "flex-end" }}>
//             8:12 am
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//           <Typography
//             sx={{ backgroundColor: "#e1f5fe", padding: 1, borderRadius: 1 }}
//           >
//             no haha
//           </Typography>
//           <Typography variant="caption" sx={{ ml: 1, alignSelf: "flex-end" }}>
//             18:16
//           </Typography>
//         </Box>
//         {/* Add more messages as needed */}
//       </Box>
//       <Box sx={{ display: "flex", padding: 2, borderTop: "1px solid #ddd" }}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Message"
//           sx={{ mr: 2 }}
//         />
//         <IconButton color="primary">
//           <SendIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };

// export default ChatWindow;

import React from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatWindow = () => {
  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Avatar
          src="/path/to/avatar.jpg"
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="h6">David Moore</Typography>
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
        {/* Replace with dynamic messages */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#e1f5fe",
              padding: 1,
              borderRadius: 1,
            }}
          >
            no haha
          </Typography>
          <Typography variant="caption" sx={{ ml: 1, alignSelf: "flex-end" }}>
            18:16
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#e1f5fe",
              padding: 1,
              borderRadius: 1,
            }}
          >
            i don't remember anything
          </Typography>
          <Typography variant="caption" sx={{ ml: 1, alignSelf: "flex-end" }}>
            18:16
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#f1f1f1",
              padding: 1,
              borderRadius: 1,
            }}
          >
            OMG do you remember what you did last night at the work night out?
          </Typography>
          <Typography variant="caption" sx={{ ml: 1, alignSelf: "flex-end" }}>
            8:12 am
          </Typography>
        </Box>
        {/* Add more messages as needed */}
      </Box>

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
                <SendIcon sx={{ color: "#8BABD8" }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "12px",
              height: "56px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatWindow;
