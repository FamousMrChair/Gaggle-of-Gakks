var socket = io();

function joinRoom(roomId) {
    if (document.getElementById('name').value == '') {
        alert('please enter a name')
        return
    }
    console.log(roomId)
    socket.emit('joinRoom', roomId)
}
socket.on('joinRoom', function(data) {
    if (data['success']) {
        console.log(socket.id + " has joined the room: " + data['gamePin'])
        //put code here to take them to the game page
        formAction('/create', 'POST', {'name' : 'gamePin', 'value': gamePin})
    }
    else {
        console.log('that room does not exist')
        alert('that room does not exist')
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
    //initFile()
})

// redirects you to another window
function redirect(destination) {
    window.location.href = destination
}

// function initFile() {
//     file = document.getElementById('filename').innerHTML
//     console.log(file)
//     if (file == 'create.html') {
//         gamePin = document.getElementById('gamePin').innerHTML
//         joinRoom(gamePin)
//     }
// }

/* If browser back button was used, flush cache */
// code taken from https://discourse.webflow.com/t/force-refresh-page-when-user-taps-browser-back-button/159352
// sockets will work immediately on reload, so we can reload when people access this from the back button
(function () {
	window.onpageshow = function(event) {
        // event.persisted means loading the page from cache
		if (event.persisted) {
			window.location.reload();
		}
	};
})();

socket.on('console.log', function(message) {
    console.log(message)
})

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

function autoplay(){
    var r =confirm("Would You Like To AutoPlay Music?");
    if (r == true) {
        document.getElementById("audio").play();
    }
  }

autoplay()