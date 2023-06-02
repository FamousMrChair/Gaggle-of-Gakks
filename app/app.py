# this file is for handling server to client communication
from flask import Flask, render_template, request, session, redirect
from flask_socketio import SocketIO, send, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = "superdupersecretkey"
socketio = SocketIO(app)

@app.route('/socket')
def socket():
    return render_template("socket.html")

@socketio.on('my event')
def event(data):
    print('received data ' + str(data))
    print(data['data'])
    print(request.sid)
    emit('setId', request.sid)

@socketio.on('disconnect')
def event():
    print('I disconnected')

if __name__ == '__main__':
    socketio.run(app, debug = True)