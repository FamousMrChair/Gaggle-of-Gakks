# this file is for handling server to client communication
from flask import Flask, render_template, request, session, redirect
from flask_socketio import SocketIO, send, emit, join_room, leave_room, rooms
import random

CHARACTERS = ['1','2','3','4','5','6','7','8','9','0',
              'A','B','C','D','E','F','G','H','I','J',
              'K','L','M','N','O','P','Q','R','S','T',
              'U','V','W','X','Y','Z']
app = Flask(__name__)
app.config["SECRET_KEY"] = "superdupersecretkey"
socketio = SocketIO(app)

# these dicts exist to keep track of existing ids in the 1 in 2 billion event that the same id is generated twice
gameRooms = {
    # gamePin : {
    #   'players' : ['kevin', 'kevin', 'kevanjini', 'kevorden'],
    #    
    # }
}

@app.route("/", methods = ['GET', 'POST'])
def home():     
    return render_template('home.html')

@app.route('/create', methods=['POST'])
def create():
    # generate the pin and add it to the list of games
    gamePin = generatePin()
    gameRooms.update({gamePin : {'players' : []}})

    return render_template('create.html', gamePin = gamePin)

@app.route('/join', methods=['POST'])
def join():
    gamePin = request.form['gamePin']
    if gamePin in gameRooms:
        return render_template('create.html', gamePin = gamePin)
    return 'an unexpected error occurred'

@app.route('/multidie')
def multidie():        
    return render_template('multidie.html')

# socket ------------------------------------------------------------------
@socketio.on('room_exists')
def room_exists(room, socket):
    room_exists = room in gameRooms
    print(room_exists)
    socketio.emit('room_exists', room_exists, to=socket)

@socketio.on('addPlayer')
def addPlayer(name, gamePin):
    # get the game room
    game = dict(gameRooms[gamePin])
    # add the player into the list of names
    players = list(game['players'])
    players.append(name)

    # update the dictionary
    game.update({'players' : players})

@socketio.on('removePlayer')
def addPlayer(name, gamePin):
    # get the game room
    game = dict(gameRooms[gamePin])
    # add the player into the list of names
    players = list(game['players'])
    players.append(name)

    # update the dictionary
    game.update({'players' : players})

@socketio.on('updatePlayers')
def updatePlayers(gamePin):
    socketio.emit()

# debug --------------------------------------------------------------------
@socketio.on('getUserId')
def getUserId(client):
    if 'userId' in session:
        # send a message with the userId. this is so it can be logged in console
        socketio.emit('getUserId', {'id':session['userId'], 'success':True}, to=client)
    else:
        socketio.emit('getUserId', {'success':False}, to=client)

@socketio.on('getRooms')
def getRooms(id):
    socketio.emit('getRooms', rooms(id))

def generatePin():
    pin = ''
    for i in range(6):
        pin += random.choice(CHARACTERS)
    return pin

if __name__ == '__main__':
    gameRooms.clear()
    socketio.run(app, debug = True)