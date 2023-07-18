const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { Schema } = mongoose
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const mongoURI = process.env.MONGO_URI

const UserSchema = new Schema({
  username: String
})
const ExerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: Date
})

const User = mongoose.model('User', UserSchema)
const Exercise = mongoose.model('Exercise', ExerciseSchema)


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
 

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  const { username } = req.body
  
  const user = new User({username: username})

  await user.save()

  res.json({ username: user.username, _id: user._id })  
})

app.get('/api/users', async (req, res) => {
  const users = await User.find()

  console.log(users)
  res.send(users)
})

app.post('/api/users/:id/exercises', async (req, res) => {
  console.log(req.body)
  let date = req.body.date ? req.body.date : new Date()
  const user_id = req.params.id
  const user = await User.findOne({_id: user_id})
  const exercise = new Exercise({description: req.body.description, duration: req.body.duration, date: date})
  await exercise.save()
  res.json({ _id: user_id, username: user.username, date: exercise.date, duration: exercise.duration, description: exercise.description })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
