import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    persons: [],
    selectedPerson: {},
    messages: [],
  },
  reducers: {
    // Set the persons array with the incoming payload, while preserving lastMessage
    // and unreadCount if they exist
    setPersons: (state, action) => {
      const newPersons = action.payload;
      state.persons = newPersons.map((newPerson) => {
        // Find the existing person in the current state
        const existingPerson = state.persons.find(
          (person) => person.id === newPerson.id
        );
        return {
          ...newPerson,
          // Preserve the lastMessage if it exists in the current state, otherwise use the new value
          lastMessage: existingPerson?.lastMessage ?? newPerson.lastMessage,
          // Preserve the unreadCount if it exists in the current state, otherwise use the new value
          unreadCount: existingPerson?.unreadCount ?? newPerson.unreadCount,
        };
      });
    },

    // Set the selected person in the state
    setSelectedPerson: (state, action) => {
      state.selectedPerson = action.payload;
    },

    // Mark a user as online or add them to the persons array if they don't exist
    setUserJoined: (state, action) => {
      const index = state.persons.findIndex(
        (person) => person.id === action.payload.id
      );
      if (index !== -1) {
        // Update online status if user exists
        state.persons[index].online = true;
      } else {
        // Add new user with online status
        state.persons.push({ ...action.payload, online: true });
      }
    },

    // Mark a user as offline
    setUserDropped: (state, action) => {
      const index = state.persons.findIndex(
        (person) => person.id === action.payload.userId
      );
      if (index !== -1) {
        // Update online status if user exists
        state.persons[index].online = false;
      }
    },

    // Append a new message to the messages array and update the unread count for the sender
    appendMessage: (state, action) => {
      const { myId, message } = action.payload;
      // Add timestamp to the message and push it to the messages array
      state.messages.push({
        ...message,
        timestamp: new Date().toISOString(),
      });

      // Find the person who sent the message
      const personIndex = state.persons.findIndex(
        (person) => person.id == message.from
      );
      if (personIndex !== -1) {
        // Increment unread count if the message is for the current user
        if (message.to == myId) {
          state.persons[personIndex].unreadCount =
            (state.persons[personIndex].unreadCount || 0) + 1;
          state.persons[personIndex].lastMessage = message.message;
        }
      }
    },

    // Update the unread count for the selected person to 0
    updateReadCount: (state, action) => {
      const { selectedPersonId } = action.payload;
      const personIndex = state.persons.findIndex(
        (person) => person.id == selectedPersonId
      );

      if (personIndex !== -1) {
        state.persons[personIndex].unreadCount = 0;
      }
    },

    // Set offline messages for the current user and update the unread count for the sender
    setOfflineMessages: (state, action) => {
      const { myId, messages } = action.payload;

      messages.forEach((message) => {
        // Add timestamp to the message and push it to the messages array
        state.messages.push({
          ...message,
          timestamp: new Date().toISOString(),
        });

        // Find the person who sent the message
        const personIndex = state.persons.findIndex(
          (person) => person.id == message.from
        );
        if (personIndex !== -1) {
          // Increment unread count if the message is for the current user
          if (message.to == myId) {
            state.persons[personIndex].unreadCount =
              (state.persons[personIndex].unreadCount || 0) + 1;
            state.persons[personIndex].lastMessage = message.message;
          }
        }
      });
    },
  },
});

export const {
  setPersons,
  setSelectedPerson,
  setUserJoined,
  setUserDropped,
  appendMessage,
  updateReadCount,
  setOfflineMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
