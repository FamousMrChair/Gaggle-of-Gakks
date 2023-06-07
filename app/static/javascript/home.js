socket = io()

submit = document.getElementById('submit')
submit.addEventListener('click', ()=>{
    // get pin
    pin = document.getElementById('gamePin').value
    // check if room exists by sending it to server
    socket.emit('room_exists', pin, socket.id)
    socket.once('room_exists', function(room_exists){
        console.log(room_exists)
        // if exists, go to /join
        if (room_exists) {
            formAction('/join', 'POST', {'name' : 'gamePin', 'value' : pin})
        }
        // else alert
        else {
            alert('that game does not exist')
        }
    })
})

// redirects you to another window as if you were submitting a form
function formAction(route, method, data) {
    // if the form already exist, get it
    if (document.getElementById('redirectCreate')){
        form = document.getElementById('redirectCreate')
        //remove existing children
        form.removeChild(form.firstChild)
    }
    // if the form doesn't exist, make one
    else{
        form = document.createElement('form')
        document.body.appendChild(form)
    }
    
    form.setAttribute('action', route)
    form.setAttribute('method', method)
    form.setAttribute('id', 'redirectCreate')

    input = document.createElement('input')
    input.setAttribute('hidden', true)
    if ('name' in data)
        input.setAttribute('name', data['name'])
    if ('value in data')
        input.setAttribute('value', data['value'])

    form.appendChild(input)

    form.submit()
}

(function () {
	window.onpageshow = function(event) {
        // event.persisted means loading the page from cache
		if (event.persisted) {
			window.location.reload();
		}
	};
})();