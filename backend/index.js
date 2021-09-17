const connectToMongo = require('./db')
const express = require('express')

connectToMongo()
const app = express()
const port = 3000

app.use('/',(req, res) => {
  res.send("Hello World")
})
app.use('/api/auth',require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})