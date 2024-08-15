require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { connect } = require("./config/db");
const config = require("./config/config");
const routes = require("./routes/index");

const app = express();
const server = createServer(app);
const io = new Server(server);

const corsOption = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// MIDDLEWARE
app.use(cors(corsOption));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ROUTES
app.use(routes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "TweetSpot backend is ready...." });
});

// SERVER LISTENING
const PORT = config.PORT || 6000;
server.listen(PORT, async () => {
  console.log(`Server running on PORT: http://localhost:${PORT}`);
  await connect();
});
