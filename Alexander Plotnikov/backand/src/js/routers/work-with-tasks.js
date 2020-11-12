const { Router } = require('express')
const Task = require('../model/task')
const moment = require('moment')
const router = Router()

// получить все задачи
router.get('/alltasks/:token', async (req, res) => {
  if (req.user) {
    let tasks = await Task.find({ user: req.user._id }).lean()
    res.status(200).json({
      tasks: tasks
        .sort(sortByDate)
        .map((t, i) => ({ ...t, index: (i + 1).toString() })),
    })
  } else {
    res.status(403).send()
  }
})
// создать задачу
router.post('/newtask/:token', async (req, res) => {

  let date = req.body.date || `${moment().format('YYYY-MM-DD')}`
  let time = `${moment().format('h:mm:ss a')}`
  let obj = new Task({
    task: req.body.task || 'No task',
    priority: req.body.priority,
    status: req.body.status,
    date: `${date},${time}`,
    user: req.user._id,
  })

  try {
    await obj.save()
    let tasks = await Task.find({ user: req.user._id }).lean()
    res.json({ result: true, tasks: tasks.sort(sortByDate) })
  } catch (e) {
    console.error(e)
    res.json({ result: false })
  }
})
// удалить по id
router.post('/delById/:token', async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.body._id })
    let tasks = await Task.find()
    res.json({ result: true, tasks: tasks.sort(sortByDate) })
  } catch (e) {
    console.error(e)
    res.json({ result: false })
  }
})

router.post('/taskedit/:token', async (req, res) => {
  try {
    let task = await Task.findById(req.body._id)
    if (task) {
      await Task.findByIdAndUpdate(
        req.body._id,
        { $set: { task: req.body.task } },
        { new: true }
      )
      let tasks = await Task.find()
      res.json({ result: true, tasks: tasks.sort(sortByDate) })
    } else {
      res.json({ result: false })
    }
  } catch (e) {
    console.error(e)
  }
})

router.post('/statusedit/:token', async (req, res) => {
  try {
    let task = await Task.findById(req.body._id)
    if (task) {
      await Task.findByIdAndUpdate(
        req.body._id,
        { $set: { status: req.body.status } },
        { new: true }
      )
      res.json({ result: true })
    } else {
      res.json({ result: false })
    }
  } catch (e) {
    console.error(e)
  }
})

router.post('/priorityedit/:token', async (req, res) => {
  try {
    let task = await Task.findById(req.body._id)
    if (task) {
      await Task.findByIdAndUpdate(
        req.body._id,
        { $set: { priority: req.body.priority } },
        { new: true }
      )
      res.json({ result: true })
    } else {
      res.json({ result: false })
    }
  } catch (e) {
    console.error(e)
  }
})

module.exports = router

function sortByDate(a, b) {
  if (new Date(a.date) < new Date(b.date)) return 1
  if (new Date(a.date) > new Date(b.date)) return -1
  if (new Date(a.date) === new Date(b.date)) return 0
}
