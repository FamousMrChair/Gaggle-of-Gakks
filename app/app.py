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
gameRooms = {}
users = {}

@app.route("/", methods = ['GET', 'POST'])
def home():
    # generate a userId if the user does not have one
    if not 'userId' in session:
        userId='user-' + generatePin()
        # keep generating until unique
        while userId in users:
            userId ='user-' + generatePin()
        session['userId'] = userId
    else:
        # if it does exist, then get userId
        userId = session['userId']
        
    return render_template('home.html')

# @app.route("/create", methods=['GET', 'POST'])
# def create():
#     return render_template('create.html')

@app.route('/create', methods=['POST'])
def create():
    gamePin = request.form['gamePin']
        
    return render_template('create.html', gamePin = gamePin)

@app.route('/multidie')
def multidie():        
    return render_template('multidie.html')

@socketio.on('logUser')
def logUser():
    # makes the client join the room of their userId. It's a unique room that will stay the same even if they refresh
    join_room(session['userId'])

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
        socketio.emit('joinRoom', {'success' : True, 'gamePin' : gamePin}, to=session['userId'])

@socketio.on('createRoom')
def createRoom():
    print('creating room')
    gameData = "pretend this is game data"
    # generate a random 6 character gamePin
    gamePin = generatePin()
    # if the pin does exist (1 in over 2 billion chance), re-generate
    while gamePin in gameRooms:
        gamePin = generatePin()
    #when you have a unique pin, put it into the dictionary
    gameRooms.update({gamePin : gameData})
    socketio.emit('createRoom', gamePin, to=session['userId'])

def generatePin():
    pin = ''
    for i in range(6):
        pin += random.choice(CHARACTERS)
    return pin

if __name__ == '__main__':
    gameRooms.clear()
    users.clear()
    socketio.run(app, debug = True)