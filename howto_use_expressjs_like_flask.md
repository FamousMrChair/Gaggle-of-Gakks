# how-to set up express like flask
---
## Overview
Setup guide for express + ejs so you can develop with node similarly to how you develop with Python and Flask

### Estimated Time Cost: 0.1 hrs

### Prerequisites:

- Node.js installed

1. install express and set up an app. Installation guide can be found [here](https://expressjs.com/en/starter/installing.html). TLDR below:
    ```
    cd myapp  
    npm init
    ```
    you will be prompted with many things. Hit enter to accept defaults on all of them except for the prompt below:
    ```
    entry point: (index.js)
    //you should type the name of your main file when given this prompt
    ```
    ```
    npm install express
    ```
    Now set up an app. You can copy paste the template below
    ```javascript
    const express = require('express')
    const app = express()
    const port = 3000
    app.set('view engine', 'ejs') //remove if you do not plan to use the ejs view engine

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

    //runs in http://localhost:3000/
    ```
    add public(static) and views(templates) folders
    ```
    mkdir public  (for JS, CSS, images)
    mkdir views   (for HTML equivalents)
    ```
2. Install the ejs view engine. It's like jinja, and .ejs files have HTML syntax, so it's easier to understand coming from Flask. If you don't want to use a view engine, you can instead render html with
    ```javascript
    app.get('/', (req, res) => {
        res.sendFile('index.html', {root : 'views'})
        //change the path and the root folder as necessary
    })
    ```
    Below is a quick guide to ejs
    ```
    npm install ejs
    ```
    Full documentation [here](https://www.npmjs.com/package/ejs). Important basics below:  
    Passing variables
    ```HTML
    jinja
    -----
    <body>
        {{var}}
    </body>

    ejs
    -----
    <body>
        <%= locals.var %> 
        //this is preferred
    </body>
    OR
    <body>
        <%= var %>
    </body>
    ```
    Rendering files
    ```python
    jinja + flask
    --------------
    @app.route("/")       #assign fxn to route
    def hello_world():
        return render_template('index.html', var = 'Hello World!')
        //looks for templates/index.html

    ejs + express
    --------------
    app.get('/', (req, res) => {
        res.render('index', {var : 'Hello World!'})
        //looks for views/index.ejs
    })
    ```
    GET and POST
    ```python
    flask
    --------------
    @app.route("/", methods=['GET', 'POST'])       #assign fxn to route
    def hello_world():
        return 'Hello World!'

    express
    --------------
    app.get('/', (req, res) => {
        res.send('Hello World')
    })

    app.post('/', (req, res) => {
        res.send('Hello World')
    })
    ```
    Form Handling
    ```python
    flask
    --------------
    @app.route("/", methods=['POST'])       #assign fxn to route
    def hello_world():
        username = request.form['username']
        return username

    express
    --------------
    app.post('/', (req, res) => {
        username = req.body.username
        res.send(username)
    })
    ```
3. Install nodemon for auto reload, like Flask debug mode
    ```
    npm install nodemon
    ```
    run your main files using
    ```
    npx nodemon app.js
    ```

### Resources
* [Express installation](https://expressjs.com/en/starter/installing.html)
* [ejs](https://www.npmjs.com/package/ejs)

---

Accurate as of (last update): 2022-06-01

#### Contributors:  
Kevin Li pd7 
