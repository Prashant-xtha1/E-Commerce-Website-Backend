// Creating a server
const http = require("http");
const app = require("./src/config/express.config");

const httpServer = http.createServer(app)

const HOST = "localhost";
const PORT = 9005;

httpServer.listen(PORT, HOST, (err) => {
  if(!err) {
    console.log("Server is running on PORT: ",PORT);
    console.log("Press CTRL + C to disconnect server....");
  }
})