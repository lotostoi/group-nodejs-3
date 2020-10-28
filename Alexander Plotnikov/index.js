const PORT = 8001
const path = require("path")
const express = require("express")
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const moment = require("moment")
const Task = require("./src/js/model/task")
const Handlebars = require("handlebars")
const app = express()
const cookieParser = require("cookie-parser")
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access")

const sortByDate = (a, b) => {
  if (new Date(a.date) < new Date(b.date)) return 1
  if (new Date(a.date) > new Date(b.date)) return -1
  if (new Date(a.date) === new Date(b.date)) return 0
}


app.use(cookieParser())
app.use(express.static(path.join(__dirname, "src")))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "default",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
)
app.set("view engine", ".hbs")

app.get("/", async (req, res) => {
  let tasks = await Task.find()
  let currentDate = moment().format('YYYY-MM-DD')
  console.log( tasks.sort(sortByDate))
  res.render("tasks", { tasks: tasks.sort(sortByDate), currentDate, title: "Менеджер задач" })
})

app.post("/newtask", async (req, res) => {
  let obj = new Task({
    task: req.body.task.trim() || "No task",
    status: req.body.status,
    date: req.body.date || `${moment().format('YYYY-MM-DD')}`,
  })
  try {
    await obj.save()
    let tasks = await Task.find()
    res.json({ result: true, tasks: tasks.sort(sortByDate) })

  } catch (e) {
    console.error(e)
    res.json({ result: false })
  }
  // res.cookie('number', req.params.number)
})

app.post("/delById", async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.body._id })
    let tasks = await Task.find()
    res.json({ result: true, tasks: tasks.sort(sortByDate) })
  } catch (e) {
    console.error(e)
    res.json({ result: false })
  }
  // res.cookie('number', req.params.number)
})

app.get("*", async (req, res) => {
  res.render("error")
})

async function start() {
  try {
    const link =
      "mongodb+srv://lotos_toi:G0fdQ7GKoTODMmRM@cluster0.n6oze.mongodb.net/nodeJsCourseGeekBarins?retryWrites=true&w=majority"
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
