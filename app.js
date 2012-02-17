var redis = require("redis"),
  http = require("http"),
  socketio = require("socket.io"),
  client = redis.createClient();

var io = socketio.listen(8080, "0.0.0.0")

// Redis channel to listen on
var channel = process.argv[2];
if(!channel) {
  console.log("Usage: node app.js [redis channel]");
  process.exit(1);
}

// For debugging only
io.sockets.on("connection", function(socket) {
  console.log("New client!");
});

client.on("message", function(channel, message) {
  // You could emit this on a uid rather than 'message' to send
  // different messages to different users
  io.sockets.emit('message', message.toString());
});

// Watch redis
client.subscribe(channel);
console.log("Watching channel: " + channel);
