socket = io()
var playerName;

// prompt for name. When name is given, reveal the player list
submit = document.getElementById('submit')
submit.addEventListener('click', ()=> {
    var name = document.getElementById('name').value 
    if (name.trim() == '') {
        alert('please enter a name')
    } 
    else{
        gamePin = document.getElementById('gamePin').innerHTML
        socket.emit('uniqueName', name, gamePin)
        socket.once('uniqueName', function(bool) {
            uniqueName = bool
            console.log(!uniqueName)
            if (!uniqueName) {
                alert('that name is taken')
                console.log('that name is taken')
            } 
            else {
                playerName = name
                addPlayer(playerName)
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
    bool = true
    gamePin = document.getElementById('gamePin').innerHTML
    socket.emit('uniqueName', name, gamePin)
    socket.once('uniqueName', function(boolean) {
        bool = boolean
        console.log(bool)
    })
    return bool
}

// helper functions ------------------------------------------------------
function addPlayer(name) {
    gamePin = document.getElementById('gamePin').innerHTML
    // adding players is handled by server
    socket.emit('addPlayer', name, gamePin)
}

function removePlayer(name) {
    gamePin = document.getElementById('gamePin').innerHTML
    // removing players is handled by server
    socket.emit('removePlayer', name)
}

function updatePlayers() {
    // get game PIN
    gamePin = document.getElementById('gamePin').innerHTML
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

// window.beforeunload = function() {
//     gamePin = document.getElementById('gamePin').innerHTML
//     removePlayer(playerName)
//     updatePlayers()
// }

// socket.on('disconnect', function() {
//     gamePin = document.getElementById('gamePin').innerHTML
//     removePlayer(playerName, gamePin)
//     updatePlayers()
//     console.log('disconnected')
// })

function getRooms() {
    gamePin = document.getElementById('gamePin').innerHTML
    socket.emit('getRooms', socket.id)
    socket.once('getRooms', function(rooms){
        console.log(rooms)
    })
}

// socket.on('connect', function() {
//     updatePlayers()
// })

