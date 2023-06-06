var socket = io();

function joinRoom(roomId) {
    console.log(roomId)
    socket.emit('joinRoom', roomId)
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
socket.on('createRoom', function(gamePin) {
    console.log("created room: " + gamePin)
    //redirects user to url
    formAction('/create', 'POST', {'name' : 'gamePin', 'value': gamePin})
})

function getUserId() {
    socket.emit('getUserId', socket.id)
}
socket.on('getUserId', function(data) {
    if (data['success']) {
        console.log('you are logged in as ' + data['id'])
    }
    else {
        console.log('no user id')
    }
})

function getRooms() {
    socket.emit('getRooms', socket.id)
}
socket.on('getRooms', function(data) {
    console.log(data)
})

socket.on('connect', function() {
    getUserId()
    // make the user join the room of their userId (stored in session)
    socket.emit('logUser')
    initFile()
})

function initFile() {
    file = document.getElementById('filename').innerHTML
    console.log(file)
    if (file == 'create.html') {
        gamePin = document.getElementById('gamePin').innerHTML
        joinRoom(gamePin)
    }
}

socket.on('disconnect', function() {

})

socket.on('console.log', function(message) {
    console.log(message)
})

// redirects you to another window
function redirect(destination) {
    window.location.href = destination
}

// redirects you to another window as if you were submitting a form
function formAction(route, method, data) {
    // if the form already exist, get it
    if (document.getElementById('redirectCreate')){
        form = document.getElementById('redirectCreate')
        //remove existing children
        form.removeChild(form.firstChild)
    }
    // if the form doesn't exist, make one
    else{
        form = document.createElement('form')
        document.body.appendChild(form)
    }
    
    form.setAttribute('action', route)
    form.setAttribute('method', method)
    form.setAttribute('id', 'redirectCreate')

    input = document.createElement('input')
    input.setAttribute('hidden', true)
    input.setAttribute('name', data['name'])
    input.setAttribute('value', data['value'])

    form.appendChild(input)

    form.submit()
}