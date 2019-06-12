let socket = io();
let username = ""
socket.on("connect",function()
{
  if(username!="")
  {
      socket.emit("join",username)
  }
})
socket.on("join",function(joinMessage)
{
    joinOrLeft(joinMessage,"join");  
})
function joinOrLeft(message,event)
{
  let list = document.createElement("ul")
   list.id = "joinedList"
    let element = document.createElement("li");
    element.innerText = message
    if(event==="join")
    {
    element.className = "joinedChat"
    }
    else
    {
      element.className = "leftChat"
    }
    list.append(element)
    let allMessages = document.querySelectorAll("#messages")
    let messages  = allMessages[allMessages.length-1]
    messages.insertAdjacentElement("afterend",list)
    let newMessages = document.createElement("ul")
    newMessages.id = "messages"
    list.insertAdjacentElement("afterend",newMessages)
    let typing = document.createElement("p")
    typing.id = "typing"
    newMessages.insertAdjacentElement("afterend",typing)
    let chatBoard = document.getElementById("chatBoard")
    chatBoard.scrollTo(0,chatBoard.scrollHeight)
}
function handleChatMessage(e)
{
  let message = document.getElementById("m").value;
  if(username!==""&&message!=="")
  {
  socket.emit("chatMessage",username+": "+message);
  socket.emit("userTyping","");
  document.getElementById("m").value = "";
  }
}
function handleUsername()
{
  username = document.getElementById("username").value
  if(username!=="")
  {
  document.getElementById("username").disabled = true
  document.getElementById("joinChat").style.backgroundColor="grey"
  document.getElementById("joinChat").disabled = true

  socket.emit("join",username)
  }
}
function handleTyping(event)
{
  if(event.target.value!=="" && username!=="")
      socket.emit("userTyping",`${username} is typing`)
  else
      socket.emit("userTyping","")
}
socket.on("chatMessage",function(msg)
  {
      if(username!=="")
      {
      let allMessages = document.querySelectorAll("#messages")
      let messages  = allMessages[allMessages.length-1]
      let item = document.createElement("li")
      let nameSplit = msg.split(':');
      if(nameSplit[0]===username)
      {
          item.style.textAlign="right"
          item.className = "sender"
          item.innerText = nameSplit[1]
      }
      else{
          item.className = "receiver"
          item.innerText = msg
      }
      messages.append(item)
      let chatBoard = document.getElementById("chatBoard")
        chatBoard.scrollTo(0,chatBoard.scrollHeight)
  }
  })
  socket.on("userTyping",function(typingMessage)
  {
      let typing = document.getElementById("typing")
      typing.innerText = typingMessage
  })
  socket.on("disconnected",function(disconnectMessage)
  {
      joinOrLeft(disconnectMessage,"disconnected");
  })