require.paths.unshift(__dirname + "/node_modules");

var channel = process.argv[2];
if(!channel) {
  console.log("Usage: node app.js [redis channel]");
  process.exit(1);
}

var redis = require("redis"),
  http = require("http"),
  io = require("socket.io"),
  client = redis.createClient();

// Set up websockets
var server = http.createServer(function(req, res) {
  res.writeHeader(200, {'Content-Type': 'text/html'});
  res.writeBody('<h1>Hello world</h1>');
  res.finish();
});
server.listen(8080, "0.0.0.0")
var socket = io.listen(server);
socket.on("connection", function(client) {
  console.log("New client!");
});

// Watch redis
console.log("Watching channel: " + channel);

client.on("message", function(channel, message) {
  console.log(message.toString());
  socket.broadcast(message.toString());
});

client.subscribe(channel);
