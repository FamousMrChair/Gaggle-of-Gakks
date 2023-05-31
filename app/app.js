const express = require('express')
const app = express()
const port = 3000

//like jinja
app.set('view engine', 'ejs')

//run this file using nodemon, which enables auto-reload when changing files
//npm install nodemon
//npx nodemon app.js

app.get('/', (req, res) => {
  res.render('index', {text : 'Hello Never!'})
  //req.body.<key>
})

app.post('/', (req, res) => {
    res.render('index', {text : 'Hello Never!'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})