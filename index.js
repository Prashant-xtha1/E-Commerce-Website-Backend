// Creating a server
const http = require("http");
const httpServer = http.createServer((req, res) => {
  res.end("Hello World");
})

const HOST = "localhost";
const PORT = 9005;

httpServer.listen(PORT, HOST, (err) => {
  if(!err) {
    console.log("Server is running on PORT: ",PORT);
    console.log("Press CTRL + C to disconnect server....");
  }
})