# this file is for handling server to client communication
from flask import Flask, render_template, request, session, redirect
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import random
import string

CHARACTERS = ['1','2','3','4','5','6','7','8','9','0',
              'A','B','C','D','E','F','G','H','I','J',
              'K','L','M','N','O','P','Q','R','S','T',
              'U','V','W','X','Y','Z']
app = Flask(__name__)
app.config["SECRET_KEY"] = "superdupersecretkey"
socketio = SocketIO(app)

gameRooms = {}

@app.route("/")
def home():
    return render_template('home.html')

@app.route("/create", methods=['GET', 'POST'])
def create():
    return render_template('create.html')


@app.route('/socket')
def socket():
    return render_template("socket.html")

@socketio.on('my event')
def event(data):
    print('received data ' + str(data))
    print(data['data'])
    print(request.sid)
    emit('setId', request.sid)

@socketio.on('joinRoom')
def joinRoom(gamePin):
    print(gamePin)
    gamePin = str(gamePin)
    # if the game room does not exist, tell client it was unsuccessful
    print(gameRooms.keys())
    print(gamePin)
    if not gamePin in gameRooms:
        socketio.emit('joinRoom', {'success' : False})
    # if the game room does exist, tell client it was successful
    else:
        join_room(gamePin)
        socketio.emit('joinRoom', {'success' : True, 'gamePin' : gamePin})

@socketio.on('createRoom')
def createRoom():
    gamePin = ''
    gameData = "pretend this is game data"
    # generate a random 6 character gamePin
    for i in range(6):
        gamePin += random.choice(CHARACTERS)
    # if that pin does not already exist, add it to the list of game rooms
    if not gamePin in gameRooms:
        gameRooms.update({gamePin : gameData})
        socketio.emit('roomCreated', gamePin)
    # if the pin does exist (1 in over 2 billion chance), recurse
    else:
        createRoom()

if __name__ == '__main__':
    socketio.run(app, debug = True)