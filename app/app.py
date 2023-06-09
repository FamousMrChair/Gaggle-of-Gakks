# this file is for handling server to client communication
from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, send, emit, join_room, leave_room, rooms
import random
from trivia import get_question

CHARACTERS = ['1','2','3','4','5','6','7','8','9','0',
              'A','B','C','D','E','F','G','H','I','J',
              'K','L','M','N','O','P','Q','R','S','T',
              'U','V','W','X','Y','Z']
app = Flask(__name__)
app.config["SECRET_KEY"] = "superdupersecretkey"
socketio = SocketIO(app)

# gameRooms = 'https://jsonblob.com/api/gameRooms/1114324801761329152'
gameRooms = {
    # gamePin : {
    #   'players' : ['kevin', 'kevin', 'kevanjini', 'kevorden'],
    #   'team1' : ['kevin', 'kevin'],
    #   'team2' : ['kevanjini', 'kevorden'],
    #   'sockets' : ['socket1', 'socket2', 'socket3', 'socket4']
    #   'score1' : 0,
    #   'score2' : 0
    #   'trivia' : {trivia questions go here}
    # }
}

@app.route("/", methods = ['GET', 'POST'])
def home():     
    return render_template('home.html')

@app.route('/create', methods=['POST'])
def create():
    # generate the pin and add it to the list of games
    gamePin = generatePin()
    triviaSet = {}
    for i in range(10):
        triviaSet.update({i:get_question()})
    #update(gameRooms, {gamePin : {'players' : [], 'team1':[], 'team2':[]}})
    gameRooms.update({gamePin : {'players' : [], 'trivia':triviaSet, 'team1':[], 'team2':[]}})
    print('========== game created ==========')

    return render_template('create.html', gamePin = gamePin)

@app.route('/join', methods=['POST'])
def join():
    gamePin = request.form['gamePin']
    # if gamePin in get(gameRooms):
    if gamePin in gameRooms:
        return render_template('create.html', gamePin = gamePin)
    return 'an unexpected error occurred'


@app.route('/multidie')
def multidie():        
    return render_template('multidie.html')


@app.route('/game', methods=['POST'])
def game():
    name = request.form['name']
    gamePin = request.form['gamePin']
    if name in gameRooms[gamePin]['team1']:
        team = 'team1'
    else:
        team = 'team2'

    audio_file = url_for('static', filename='kahootMusic.mp3')
    return render_template('game.html', name=name, team=team, gamePin=gamePin, audio_file=audio_file)

# socket ------------------------------------------------------------------
@socketio.on('room_exists')
def room_exists(room, socket):
    #room_exists = room in get(gameRooms)
    room_exists = room in gameRooms
    print(room_exists)
    socketio.emit('room_exists', room_exists, to=socket)

@socketio.on('addPlayer')
def addPlayer(name, gamePin):
    print('========== addPlayer received ==========')
    # join the room so they can receive broadcasts from server
    join_room(gamePin)
    # get the game room
    #game = dict(get(gameRooms)[gamePin])
    game = dict(gameRooms[gamePin])
    # add the player into the list of players
    players = list(game['players'])
    players.append(name)

    # get the teams
    team1 = list(game['team1'])
    team2 = list(game['team2'])
    # put the player into a team
    if len(game['team2']) < len(game['team1']):
        team2.append(name)
    else:
        team1.append(name)

    # update the dictionary
    game.update({'players' : players, 'team1':team1, 'team2':team2})
    #update(gameRooms, {gamePin : game})
    gameRooms.update({gamePin : game})
    print('added player into game room with key ' + gamePin)
    print(game)

@socketio.on('removePlayer')
def removePlayer(name, gamePin):
    print('========== removePlayer received ==========')
    # name = data['name']
    # gamePin = data['gamePin']
    # get the game room
    #game = dict(get(gameRooms)[gamePin])
    game = dict(gameRooms[gamePin])
    # add the player into the list of names
    players = list(game['players'])
    players.remove(name)

    # get the teams
    team1 = list(game['team1'])
    team2 = list(game['team2'])

    # remove the player
    try:
        team1.remove(name)
        print('player was removed from team1')
    except ValueError:
        print('that player is not in team1')

    try:
        team2.remove(name)
        print('player was removed from team2')
    except ValueError:
        print('that player is not in team2')

    # (TO DO) enforce unique usernames --------------------------------------------------

    # reshuffle teams for evenness
    # if len(team1) > len(team2) + 1:
    #     # if team 1 has 2 or more players than team2, remove the first player in team 1 and add them again
    #     switchPlayer = team1[0]
    #     removePlayer(switchPlayer, gamePin)
    #     addPlayer(switchPlayer, gamePin)
    # if len(team2) > len(team1) + 1:
    #     switchPlayer = team2[0]
    #     removePlayer(switchPlayer, gamePin)
    #     addPlayer(switchPlayer, gamePin)
    

    # update the dictionary
    #update(gameRooms, {gamePin : game})
    game.update({'players' : players, 'team1':team1, 'team2':team2})
    print(game)
    socketio.emit('updatePlayers', {'team1':team1, 'team2':team2}, to=gamePin)

@socketio.on('uniqueName')
def uniqueName(name, gamePin):
    print(name)
    print(gamePin)
    print('========== checking for unique name ==========')
    game = gameRooms[gamePin]
    uniqueName = not(name in game['players'])
    print(uniqueName)
    socketio.emit('uniqueName', uniqueName, to=request.sid)

@socketio.on('updatePlayers')
def updatePlayers(gamePin):
    print('========== updatePlayers received ==========')

    # get the game room
    #game = dict(get(gameRooms)[gamePin])
    game = dict(gameRooms[gamePin])
    print('got game room with key ' + gamePin)
    print(game)

    # get the teams
    team1 = game['team1']
    team2 = game['team2']

    # broadcast the updated rooms
    socketio.emit('updatePlayers', {'team1':team1, 'team2':team2}, to=gamePin)

@socketio.on('startGame')
def startGame(gamePin):
    gameRooms[gamePin].update({'sockets':[], 'score1':0, 'score2':0})
    socketio.emit('startGame', to=gamePin)

@socketio.on('registerSocket')
def registerSocket(gamePin, playerName, team):
    print('========== registering socket ==========')
    join_room(gamePin)
    join_room(gamePin + team)
    print(request.sid)
    gameRooms[gamePin]['sockets'].append(request.sid)
    print(gameRooms[gamePin]['sockets'])

@socketio.on('startTrivia')
def startTrivia(gamePin):
    socketio.emit('startTrivia', to=gamePin)

@socketio.on('getFirstTrivia')
def getTrivia(gamePin, triviaQuestionNumber):
    triviaSet = gameRooms[gamePin]['trivia']
    question = triviaSet[triviaQuestionNumber]
    socketio.emit('getFirstTrivia', question, to=request.sid)

# debug --------------------------------------------------------------------
@socketio.on('getUserId')
def getUserId(client):
    if 'userId' in session:
        # send a message with the userId. this is so it can be logged in console
        socketio.emit('getUserId', {'id':session['userId'], 'success':True}, to=client)
    else:
        socketio.emit('getUserId', {'success':False}, to=client)

@socketio.on('getRooms')
def getRooms(client):
    socketio.emit('getRooms', rooms(client), to=client)

@socketio.on('getGame')
def getGame(gamePin):
    socketio.emit('getGame', gameRooms[gamePin], to=request.sid)

def generatePin():
    pin = ''
    for i in range(6):
        pin += random.choice(CHARACTERS)
    return pin

@socketio.on('test')
def test(message, m):
    print('message received:')
    print(message)
    print(m)

if __name__ == '__main__':
    #clear(gameRooms)
    gameRooms.clear()
    socketio.run(app, debug = True)