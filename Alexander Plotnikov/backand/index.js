const PORT = 8001
const TOKEN_SECRET_KEY = require('./src/js/secret')
const db = require('./src/js/config')
const path = require('path')
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const multer = require('multer')
const upload = multer()
const history = require('connect-history-api-fallback')
const http = require('http')
const socketIO = require('socket.io')
const moment = require('moment')

const server = http.Server(app)
const io = socketIO(server)

io.use((socket, next) => {
  const token = socket.handshake.query.token
  jwt.verify(token, TOKEN_SECRET_KEY, (err) => {
    if (err) return next(new Error('Authorization error'))
    next()
  })
  return next(new Error('Authorization error'))
})

io.on('connection', (socket) => {
  console.log('new connection')

  socket.on('createTask', async (task) => {

    let date = task.date || `${moment().format('YYYY-MM-DD')}`
    let time = `${moment().format('h:mm:ss a')}`

    let obj = new Task({
      task: task.task || 'No task',
      priority: task.priority,
      status: task.status,
      date: `${date},${time}`,
      user: task._id,
    })

    try {
      await obj.save()
      let tasks = await Task.find({ user: req.user._id }).lean()
      socket.broadcast()
      res.json({ result: true, tasks: tasks.sort(sortByDate) })
    } catch (e) {
      console.error(e)
      res.json({ result: false })
    }
  })

  socket.on('disconnect', () => {
    console.log('discconect')
  })
})

app.use(history())

const mustBeAuthorizationRestApi = (req, res, next) => {
  if (req.params.token) {
    jwt.verify(req.params.token, TOKEN_SECRET_KEY, (err, data) => {
      if (err) return next()
      delete data.password1
      req.user = data
      next()
    })
  } else {
    next()
  }
}

const authRout = require('./src/js/routers/auth')
const tasksRout = require('./src/js/routers/work-with-tasks')

app.use(express.static(path.join(__dirname, 'src')))
app.use(express.static(path.join(__dirname, 'src/dist')))

app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(upload.array())

app.use('*/:token', mustBeAuthorizationRestApi)

app.use(authRout)
app.use(tasksRout)

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src/dist/index.html'))
})

app.get('*', async (req, res) => {
  res.status(404).send()
})

async function start() {
  try {
    const link = `mongodb+srv://${db.login}:${db.password}@cluster0.n6oze.mongodb.net/${db.name}?retryWrites=true&w=majority`
    await mongoose.connect(link, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
  } catch (e) {
    console.error(e)
  }
}

start()
