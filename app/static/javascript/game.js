// game global vars -------------------------
socket = io();
var playerName;
var gamePin;
var team;
var score = 0;
const minigames = ['qna', 'multidie', 'results'];

// trivia global variables ------------------
var triviaQuestionNumber = 0;
var timerInterval;

//multidie global vars ----------------------
var num1;
var num2;
var results = 0;
num1Head = document.createElement("h4");
num2Head = document.createElement("h4");
var start = new Date().getTime();
var end = new Date().getTime();


socket.on('connect', function() {
    console.log('connected');
    playerName = document.getElementById('playerName').innerHTML
    gamePin = document.getElementById('gamePin').innerHTML
    team = document.getElementById('team').innerHTML
    // indicate which team you belong to
    if (team == 'team1') {
        document.getElementById('score1').style.color = 'green'
        document.getElementById('score2').style.color = 'red'
    } 
    else {
        document.getElementById('score2').style.color = 'green'
        document.getElementById('score1').style.color = 'red'
    }

    socket.emit('registerSocket', gamePin, playerName, team)
    socket.emit('startTrivia', gamePin)
})

// trivia -------------------------------------------------------------------
answer0 = document.getElementById('qnaA0')
answer1 = document.getElementById('qnaA1')
answer2 = document.getElementById('qnaA2')
answer3 = document.getElementById('qnaA3')

answers = [answer0, answer1, answer2, answer3]
answers.forEach(answer => {
    answer.addEventListener('click', function(){
        current = new Date().getTime()
        socket.emit('checkAnswer', gamePin, triviaQuestionNumber, answer.innerHTML, team, current - start)
        console.log('response took ' + (current - start) + 'ms')
    })
});

socket.on('checkAnswer', function(data) {
    var button1 = document.getElementById("qnaA0");
    var button2 = document.getElementById("qnaA1");
    var button3 = document.getElementById("qnaA2");
    var button4 = document.getElementById("qnaA3");
    
    if(data['correct']) {
        console.log('correct!')
        // if answer is correct, increment the current question number and get new trivia
        triviaQuestionNumber += 1;
        updateScore(data['score'])
        getTrivia();
        start = new Date().getTime()

        document.getElementById('messageTrivia').style.color = 'green'
        document.getElementById('messageTrivia').innerHTML = 'A teammate answered correctly'

        setTimeout(function() {
            // Continue with the desired logic after the delay
            // For example, you can display a message or perform additional actions
            document.getElementById('messageTrivia').innerHTML = ''
        }, 1000);
    } 
    else {
        console.log('incorrect!')
        // To disable the button
        button1.disabled = true;
        button2.disabled = true;
        button3.disabled = true;
        button4.disabled = true;

        document.getElementById('messageTrivia').style.color = 'red'
        document.getElementById('messageTrivia').innerHTML = 'A teammate answered incorrectly'

        setTimeout(function() {
            button1.disabled = false;
            button2.disabled = false;
            button3.disabled = false;
            button4.disabled = false;
            // Continue with the desired logic after the delay
            // For example, you can display a message or perform additional actions
            document.getElementById('messageTrivia').innerHTML = ''
        }, 2000);

    }
})

socket.on('startTrivia', function() {
    hideAll()
    getTrivia()
    if (!(timerInterval == null)){
        clearInterval(timerInterval)
    }
    start = new Date().getTime()
    end = start
    timerInterval = setInterval(getTime, 100)
    document.getElementById('qna').style.display = 'block'
})

function getTrivia() {
    if (triviaQuestionNumber >= 10) {
        socket.emit('endMinigame', gamePin, team)
    }

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
socket.on('endMinigame', function() {
    hideAll()
    document.getElementById('endMessage').innerHTML = 'Your team has finished the minigame! Please wait for the other team.'
    document.getElementById('time').innerHTML = 'put a time here when we figure it out'
    document.getElementById('scoreResults').innerHTML = score
    document.getElementById('results').style.display = 'block'
}) 

function updateScore(int) {
    socket.emit('updateScore', gamePin, team, int)
}
socket.on('updateScore', function(data) {
    document.getElementById('score1').innerHTML = 'Team 1 Score: ' + data['score1']
    document.getElementById('score2').innerHTML = 'Team 2 Score: ' + data['score2']
})

//multidie! ----------------------------------------------------------------------
socket.on('startMultidie', function(playerList) {
    document.getElementById('multidie').style.display = 'block'
    score = 0
})

function random_item(items){
    return items[Math.floor(Math.random() * items.length)];   
}

const nums = [];
for(let i = 0; i <= 12; i++){
    nums.push(i);
}

function multiply(event) {
    //displaying numbers
    num1 = random_item(nums);
    num2 = random_item(nums);
    numbers = document.getElementById("numbers");
    num1Head.innerHTML = num1;
    num2Head.innerHTML = num2;
    numbers.appendChild(num1Head);
    numbers.appendChild(num2Head);
}

function isKeyPressed(event) {
    var x = document.getElementById("demo");
    if (event.shiftKey) {
      x.innerHTML = "The SHIFT key was pressed!";
    } else {
      x.innerHTML = "The SHIFT key was NOT pressed!";
    }
}

// input.addEventListener('keypress', function(event) {
//     if (event.key === 'Enter') {
//         check()
//     }
// })

function check(event){
    if (event.shiftKey) {   
        var score = document.getElementById("resultsMultidie")
        if ((num1 * num2) == document.getElementById("ans").value){
            console.log("yay");
            currentScore = parseInt(score.innerHTML)
            newScore = currentScore + 1
            score.innerHTML = newScore

            num1Head.innerHTML = "";
            num2Head.innerHTML = "";
            multiply()
        }
        else{
            console.log("boooo");
            num1Head.innerHTML = "";
            num2Head.innerHTML = "";
            multiply()
        }
        document.getElementById('ans').value = ''
    }
    if (parseInt(score.innerHTML) == 15){
        end = new Date().getTime()
        console.log(end - start);
        socket.emit('endMultidie', gamePin, playerName)
    }
};
multiply();

socket.on('endMultidie', function(winner) {
    hideAll()
    document.getElementById('results').style.display = 'block'
    if (playerName = winner) {
        document.getElementById('endMessage').innerHTML = 'You have won the game!'
    } else {
        document.getElementById('endMessage').innerHTML = 'You lose! ' + winner + ' has won the game!'
    }
})


// utility ------------------------------------------------------------------
function hideAll() {
    minigames.forEach(minigame => {
        document.getElementById(minigame).style.display = 'none'
    });
}

function getTime() {
    socket.emit('getTime', gamePin)
    socket.once('getTime', function(time) {
        document.getElementById('time').innerHTML = time
    })
}

socket.on('stopTimer', function() {
    clearInterval(timerInterval)
    document.getElementById('time').innerHTML = 'Time is up!'
    hideAll()
    displayResults()
})

function displayResults(){
    // show results
    document.getElementById('results').style.display = 'block'

    // get scores
    score1 = document.getElementById('score1').innerHTML
    score1 = score1.substring(score1.indexOf(":")+2, score1.length)
    score1 = parseInt(score1)

    score2 = document.getElementById('score2').innerHTML
    score2 = score2.substring(score2.indexOf(":")+2, score2.length)
    score2 = parseInt(score2)

    // show end message
    if (team == 'team1') {
        //show scores
        document.getElementById('scoreResults').innerHTML = document.getElementById('score1').innerHTML
        if (score1 > score2) {
            document.getElementById('endMessage').innerHTML = 'You win round 1! Round 2 will begin shortly.'
            setTimeout( function() {
                hideAll()
                socket.emit('startMultidie', gamePin)
            }, 5000)
        } else {
            document.getElementById('endMessage').innerHTML = 'You lose!'
            socket.emit('removePlayer', playerName, gamePin)
        }
    } else{
        //show scores
        document.getElementById('scoreResults').innerHTML = document.getElementById('score2').innerHTML
        if (score1 < score2) {
            document.getElementById('endMessage').innerHTML = 'You win round 1! Round 2 will begin shortly.'
            setTimeout( function() {
                hideAll()
                socket.emit('startMultidie', gamePin)
            }, 5000)
        } else {
            document.getElementById('endMessage').innerHTML = 'You lose!'
            socket.emit('removePlayer', playerName, gamePin)
        }
    }
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