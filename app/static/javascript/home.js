var socket = io();

function joinRoom() {
    gamePin = document.getElementById('gamePin').value
    console.log(gamePin)
    socket.emit('joinRoom', gamePin)
}
socket.on('joinRoom', function(data) {
    if (data['success']) {
        console.log(socket.id + " has joined the room: " + data['gamePin'])
        //put code here to take them to the game page
    }
    else {
        console.log('that room does not exist')
        //put code here to display an error message
    }
})

function createRoom() {
    socket.emit('createRoom')
}
socket.on('roomCreated', function(gamePin) {
    console.log("created room: " + gamePin)
})