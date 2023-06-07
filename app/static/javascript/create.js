socket = io()
var playerName;

// prompt for name. When name is given, reveal the player list
submit = document.getElementById('submit')
submit.addEventListener('click', ()=> {
    var name = document.getElementById('name').value 
    if (name.trim() == '') {
        alert('please enter a name')
    }
    else {
        playerName = name
        document.getElementById('nameDiv').style.visibility = 'hidden'
        document.getElementById('titleDiv').style.visibility = 'hidden'
        document.getElementById('teamsDiv').style.visibility = 'visible'
        document.getElementById('pinDiv').style.visibility = 'visible'
    }
})

// finish these later
function addPlayer(name) {
    gamePin = document.getElementById('gamePin').innerHTML
    socket.emit('addPlayer', name, gamePin)
}

function removePlayer(name) {
    socket.emit('removePlayer', name)
}

function updatePlayers(data) {
    // get and clear existing players
    team1 = document.getElementById('team1')
    team1.innerHTML = ""
    team2 = document.getElementById('team2')
    team2.innerHTML = ""

    br = document.createElement('br')
    // iterate and list our each player
    data['team1'].forEach(player => {
        team1.appendChild(br)
        team1.innerHTML += player
    });

    data['team2'].forEach(player => {
        team2.appendChild(br)
        team2.innerHTML += player
    });
}

socket.on('disconnect', function() {
    if (!(playerName == null)) {
        
    }
})

// socket.on('connect', function() {
//     updatePlayers()
// })

