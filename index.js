let express = require("express");
let app = express();
let path = require("path")
let http = require("http").createServer(app);
let io = require("socket.io")(http)
let socketIdToUsername={}
app.use(express.static(path.resolve(__dirname)))
let manageSockets = function(socket)
{
socket.on("join",function(username)
{
    let socketId = socket.id;
    socketIdToUsername[socketId] = username
    socket.broadcast.emit("join",`${username} has joined the conversation`)
}); 
socket.on("disconnect",function()
{
    let socketId = socket.id;
    if(socketIdToUsername[socketId]!==undefined)
    {
    socket.broadcast.emit("disconnected",`${socketIdToUsername[socketId]} has left the conversation`)
    }
})   
socket.on("chatMessage",function(msg)
{
    io.emit("chatMessage",msg)
})
socket.on("userTyping",function(typingMessage)
{
    socket.broadcast.emit("userTyping",typingMessage)
})
}
io.on("connection",manageSockets)
http.listen(process.env.PORT || 3000,function()
{
console.log("Listening on port 3000")
});
