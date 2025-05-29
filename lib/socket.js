// lib/socket.js
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_API_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket; 