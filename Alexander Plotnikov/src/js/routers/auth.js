const { Router } = require('express')
const User = require('../model/user')
const passport = require('../auth')
const router = Router()

router.get('/auth', async (req, res) => {
  res.render('auth', { title: 'Todo list' })
})
router.get('/registration', async (req, res) => {
  res.render('registration', { title: 'Todo list' })
})
router.get('/logout', async (req, res) => {
  res.render('logout', { title: 'Todo list' })
})
router.post('/authorization', passport.authenticate)
router.post('/registration', async (req, res) => {
  if (req.body.password === req.body.password2) {
    const { password2, ...user } = req.body.password
    await new User(user)
    res.redirect('/auth')
  } else {
    res.render('registration', { passwords: true })
  }
})

module.exports = router
