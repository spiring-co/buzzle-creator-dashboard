import io from "socket.io-client"

export default function (socketUrl) {
  const socket = io.connect(socketUrl);
  console.log("socket", socketUrl);
  return socket;
};
