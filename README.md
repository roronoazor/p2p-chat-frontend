## README

# React P2P Chat Application

## Overview

The React P2P Chat Application is a real-time chat service built using React and Socket.IO. This application allows users to register, login, and engage in real-time messaging with other users. It includes features like online/offline user status tracking, search functionality for users, and offline message storage, ensuring messages are delivered when users come online.

## Features

- User Registration and Authentication
- Real-time messaging with Socket.IO
- Online/offline user status tracking
- Offline message storage and delivery
- Search functionality for users
- Integration with a NestJS backend

## Design Choices

To minimize the number of dependencies required to set up the application for both the frontend and backend, Node.js was chosen for the backend. This allows a user to only need Node.js and npm to get up and running without the hassle of installing Node.js for the frontend and another programming language like Python or Java for the backend. The use of Socket.IO provides real-time communication capabilities. SQLite was chosen as the database on the backend for its simplicity and ease of setup, but it is expected to be swapped out for a production-grade database in a production environment.

## Requirements

- Node.js v16 or above
- React

## Getting Started

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/roronoazor/p2p-chat-frontend.git
   cd p2p-chat-frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory and add the following:
   ```
   REACT_APP_SOCKET_URL="http://localhost:3000"
   ```

### Running the Application

#### Using Makefile

1. Install dependencies

   ```bash
   make install
   ```

2. Start the application in development mode

   ```bash
   make start-dev
   ```

3. Build the application for production

   ```bash
   make build
   ```

#### Without Makefile

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the application in development mode

   ```bash
   npm start
   ```

3. Build the application for production

   ```bash
   npm run build
   ```

## Application Structure

The application is structured into the following main components:

- **LoginScreen/Signup**: Handles user authentication.
- **ChatScreen**: The main chat interface, containing the Sidebar, ChatWindow, and UserProfile components.
- **Sidebar**: Displays the list of users and search functionality.
- **ChatWindow**: Displays the chat messages and input field for sending messages.
- **UserProfile**: Displays the profile information of the selected user.

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user
- **POST /auth/login**: Login a user

### Users

- **GET /users**: Get a list of users
- **GET /users/:id**: Get a specific user by ID

### WebSocket Events

- **userOnline**: Notify when a user is online
- **userOffline**: Notify when a user is offline
- **sendMessage**: Send a message to another user
- **messageReceived**: Receive a message from another user
- **searchUsers**: Search for users by email or phone number
