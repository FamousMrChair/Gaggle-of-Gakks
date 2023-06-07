socket = io()
var playerName;

// prompt for name. When name is given, reveal the player list
submit = document.getElementById('submit')
submit.addEventListener('click', ()=> {
    var name = document.getElementById('name').value 
    if (name.trim() == '') {
        alert('please enter a name')
    }
    // (TO DO) check if name already exists ------------------------------------------------
    else {
        playerName = name
        addPlayer(playerName)
        updatePlayers()
        document.getElementById('nameDiv').style.visibility = 'hidden'
        document.getElementById('titleDiv').style.visibility = 'hidden'
        document.getElementById('teamsDiv').style.visibility = 'visible'
        document.getElementById('pinDiv').style.visibility = 'visible'
    }
})

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
    // get and clear existing players
    team1 = document.getElementById('team1')
    team1.innerHTML = "team1"
    team2 = document.getElementById('team2')
    team2.innerHTML = "team2"

    gamePin = document.getElementById('gamePin').innerHTML
    // get new player list from server
    socket.emit('updatePlayers'. gamePin)

    //update html with updated player list
    socket.once('updatePlayers', function(data) {
        console.log('team1' + data['team1'])
        console.log('team2' + data['team2'])

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
}

socket.on('disconnect', function() {
    if (!(playerName == null)) {
        // remove playerName
    }
})

// socket.on('connect', function() {
//     updatePlayers()
// })

