const express = require('express')
const app = express()
const port = 3000

//run this file using nodemon, which enables auto-reload when changing files
//npm install nodemon
//npx nodemon app.js

app.get('/', (req, res) => {
  res.sendFile('index.html', {root : 'views'})
  //req.body.<key>
})

app.post('/', (req, res) => {
    res.sendFile('index.html', {root : 'views'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})