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
  res.render('logout', {
    title: 'Todo list',
    login: req.user.login,
    email: req.user.email,
  })
})
router.post('/logout', async (req, res) => {
  req.logout()
  res.redirect('/auth')
})
router.post('/authorization', passport.authenticate)
router.post('/registration', async (req, res) => {
  if (req.body.password === req.body.password2) {
    const { password2, ...user } = req.body

    const newUser = new User(user)
    await newUser.save()
    res.redirect('/auth')
  } else {
    res.render('registration', { passwords: true })
  }
})

module.exports = router
