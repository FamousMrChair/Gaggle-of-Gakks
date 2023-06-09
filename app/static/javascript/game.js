socket = io();
var playerName;
var gamePin;
var team;

socket.on('connect', function() {
    console.log('connected');
    playerName = document.getElementById('playerName').innerHTML
    gamePin = document.getElementById('gamePin').innerHTML
    team = document.getElementById('team').innerHTML

    socket.emit('registerSocket', gamePin, playerName, team)
})


// debug
function getRooms() {
    socket.emit('getRooms', socket.id)
    socket.once('getRooms', function(rooms){
        console.log(rooms)
    })
}

function getGame() {
    socket.emit('getGame', gamePin)
    socket.once('getGame', function(game) {
        console.log(game)
    })
}