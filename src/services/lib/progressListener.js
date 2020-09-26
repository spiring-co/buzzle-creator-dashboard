const io = require("socket.io-client");

module.exports = function (socketUrl) {
  const socket = io.connect(socketUrl);
  console.log("socket", socketUrl);
  return socket;
};
