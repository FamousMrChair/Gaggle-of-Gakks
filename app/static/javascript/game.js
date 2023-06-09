socket = io();
var playerName;
var gamePin;
var team;
const minigames = ['qna']
var triviaQuestionNumber = 0

socket.on('connect', function() {
    console.log('connected');
    playerName = document.getElementById('playerName').innerHTML
    gamePin = document.getElementById('gamePin').innerHTML
    team = document.getElementById('team').innerHTML

    socket.emit('registerSocket', gamePin, playerName, team)
    socket.emit('startTrivia', gamePin)
})

socket.on('startTrivia', function() {
    hideAll()
    getTrivia()
    document.getElementById('qna').style.visibility = 'visible'
})

function getTrivia() {
    socket.emit('getTrivia', gamePin, triviaQuestionNumber)
    socket.once('getTrivia', function(question) {
        answerChoices = [
            question['incorrectAnswers'][0],
            question['incorrectAnswers'][1],
            question['incorrectAnswers'][2] 
        ]
        answerChoices.push(question['correctAnswer'])

        document.getElementById('qnaQ').innerHTML = question['question']
        for (i = 0; i < 4; i++){
            randomIndex = Math.floor(Math.random() * answerChoices.length)
            answer = answerChoices.splice(randomIndex, 1)[0]
            document.getElementById('qnaA' + i.toString()).innerHTML = answer
        }
    })
}

function hideAll() {
    minigames.forEach(minigame => {
        document.getElementById(minigame).style.visibility = 'hidden'
    });
}

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