var socket = io();

socket.on('connect', function() {
    //log the id of the socket that connected
    console.log(socket.id + " connected")
    //send an event to the server with some data attached
    var roomsList = document.getElementById('room')
    newRoom = document.createElement('li')
    newRoom.innerHTML = ` ${socket.id}`
    roomsList.appendChild(newRoom)
});

//when the server sends an update_rooms message, update the rooms list
socket.on('update_rooms', function(room) {
    var roomsList = document.getElementById('room')
    console.log(roomsList)
    newRoom = document.createElement('li')
    newRoom.innerHTML = ` ${room}`
    roomsList.appendChild(newRoom)
})

function joinRoom() {
    roomId = document.getElementById('roomId').value
    socket.emit('join_room', socket.id, roomId)
}

function roomExists(room) {
    console.log(socket.io.socket.rooms)
}




