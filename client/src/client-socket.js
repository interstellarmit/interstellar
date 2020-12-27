import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});
