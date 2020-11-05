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

const mustBeAuthorizationRestApi = (req, res, next) => {
  if (req.headers.authorization) {
    const [, token] = req.headers.authorization.split(' ')
    jwt.verify(token, TOKEN_SECRET_KEY, (err, data) => {
      if (err) return next()
      delete data.password1
      req.user = data
      next()
    })
  } else {
    next()
  }
}

const passport = require('./src/js/auth')
const cookieParser = require('cookie-parser')
const authRout = require('./src/js/routers/auth')
const tasksRout = require('./src/js/routers/work-with-tasks')

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'src')))

app.use(cors())
app.use(passport.initialize)
app.use(passport.session)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(upload.array())

app.use('*', mustBeAuthorizationRestApi)

app.use(authRout)
app.use(tasksRout)

app.get('*', async (req, res) => {
  res.render('error')
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
