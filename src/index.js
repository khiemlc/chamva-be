const http = require("http");
const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const {setupWebsocket} = require('./websocket');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
setupWebsocket(server, app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});