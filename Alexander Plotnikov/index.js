const PORT = 8001
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const tasks = [
  { task: 'go to the gym', status: 'wite', data: '28 октября 2020 ' },
  { task: 'go to the gym', status: 'wite', data: '28 октября 2020 ' },
  { task: 'go to the gym', status: 'wite', data: '28 октября 2020 ' },
  { task: 'go to the gym', status: 'wite', data: '28 октября 2020 ' },
]

const app = express()
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'src')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.engine(
  '.hbs',
  exphbs({
    extname: '.hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
  })
)
app.set('view engine', '.hbs')

app.get('/', async (req, res) => {
  res.render('tasks', { tasks, title: 'Менеджер задач' })
})
app.get('/news', async (req, res) => {
  let n = await news()
  let max = n.length
  let arrNews = []
  let current = arrNews.length || 1
  n.forEach((e, i) => {
    i < +req.cookies.number && arrNews.push(e)
  })
  res.render('news', {
    arrNews,
    max,
    current,
    title: 'Главные новости с сайта lenta.ru',
  })
})

app.post('/newtask', (req, res) => {
  //выдает пустое боди
  console.log(req.headers)
  console.log(req.body)
  res.cookie('number', req.params.number)
  res.json({ result: true })
})

app.get('*', async (req, res) => {
  res.render('error')
})
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
