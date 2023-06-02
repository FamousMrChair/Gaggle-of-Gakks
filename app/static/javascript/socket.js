var socket = io();

socket.on('connect', function() {
    console.log("connected")
    socket.emit('my event', {data: 'I\'m connected!'});
});

socket.on('setId', function(id) {
    idElement = document.getElementById('id')
    idElement.innerHTML = id
})

function add1() {
    element = document.getElementById('display')
    number = element.innerHTML
    number = Number(number)
    number += 1
    element.innerHTML = number
}



