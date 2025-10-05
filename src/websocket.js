const WebSocket = require("ws");

const setupWebsocket = (server, app) => {
  const wss = new WebSocket.Server({ server });
  app.wss = wss; // Gán WebSocket Server vào app để dùng ở các nơi khác

  console.log("✅ WebSocket Server đã được khởi tạo");
  // console.log(wss);

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ message: "Kết nối WebSocket thành công!" }));
  });
};

const broadcastMessage = (wss, type, payload) => {
  const message = {
    type: type,
    payload: payload,
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = {
  setupWebsocket,
  broadcastMessage,
};
