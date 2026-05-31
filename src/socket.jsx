import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.PROD
    ? "https://clinic-backend-r2of.onrender.com"
    : "http://localhost:5000";

const socket = io(
  SOCKET_URL,
  {
    withCredentials: true,
  }
);

export default socket;