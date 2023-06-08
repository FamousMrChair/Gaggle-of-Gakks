socket = io()
gamePin = document.getElementById('gamePin').innerHTML

// prompt for name. When name is given, reveal the player list
submit = document.getElementById('submit')
submit.addEventListener('click', ()=> {
    var name = document.getElementById('name').value 
    if (name.trim() == '') {
        alert('please enter a name')
    } 
    else{
        socket.emit('uniqueName', name, gamePin)
        socket.once('uniqueName', function(bool) {
            uniqueName = bool
            console.log(!uniqueName)
            if (!uniqueName) {
                alert('that name is taken')
                console.log('that name is taken')
            } 
            else {
                addPlayer(name)
                updatePlayers()
                document.getElementById('nameDiv').style.visibility = 'hidden'
                document.getElementById('titleDiv').style.visibility = 'hidden'
                document.getElementById('teamsDiv').style.visibility = 'visible'
                document.getElementById('pinDiv').style.visibility = 'visible'
                document.getElementById('startGame').style.visibility = 'visible'

                document.getElementById('storedName').innerHTML = name
            }
        })
    }
})

function uniqueName(name) {
    socket.emit('uniqueName', name, gamePin)
    socket.once('uniqueName', function(bool) {
        console.log(bool)
        return bool
    })
}

// helper functions ------------------------------------------------------
function addPlayer(name) {
    // adding players is handled by server
    socket.emit('addPlayer', name, gamePin)
}

function removePlayer(name) {
    // removing players is handled by server
    socket.emit('removePlayer', name)
}

function updatePlayers() {
    // get new player list from server
    socket.emit('updatePlayers', gamePin)
}
// update html with updated player list
// this is outside the function because we want this to be run everytime the server emits this event
socket.on('updatePlayers', function(data) {
    // get and clear existing players
    team1 = document.getElementById('team1')
    team1.innerHTML = "team1"
    team2 = document.getElementById('team2')
    team2.innerHTML = "team2"

    console.log('team1: ' + data['team1'])
    console.log('team2: ' + data['team2'])

    br = document.createElement('br')
    // iterate and list out each player
    data['team1'].forEach(player => {
        team1.appendChild(br)
        team1.innerHTML += player
    });

    data['team2'].forEach(player => {
        team2.appendChild(br)
        team2.innerHTML += player
    });
})

startGameButton = document.getElementById('startGameButton')
startGameButton.addEventListener('click', function() {
    // (TO DO) make this start button only available to the creator
    // (1) tell server to start game
    socket.emit('startGame', gamePin)
})
// (2) server sends a message to all sockets that the game is starting. client receives this message
socket.on('startGame', function() {
    // (3) socket sends their name and gamePin in a form to /game
    form = document.createElement('form')
    form.setAttribute('action', '/game')
    form.setAttribute('method', 'POST')
    form.style.visibility = 'hidden'

    myName = document.createElement('input')
    myName.setAttribute('type', 'hidden')
    myName.setAttribute('name', 'name')
    myName.setAttribute('value', document.getElementById('storedName').innerHTML)

    pin = document.createElement('input')
    pin.setAttribute('type', 'hidden')
    pin.setAttribute('name', 'gamePin')
    pin.setAttribute('value', gamePin)

    form.appendChild(myName)
    form.appendChild(pin)
    
    document.body.appendChild(form)
    form.submit()
})

// (4) /game renders html with all players' names and their team
// (5) game.js sends a message to server, which then stores their socket.id for 1 to 1 communication
// name : {'socket' : kjugabaijagf, 'score' : 100, 'team' : team1}

function getRooms() {
    socket.emit('getRooms', socket.id)
    socket.once('getRooms', function(rooms){
        console.log(rooms)
    })
}



