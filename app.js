const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Urls = require('./models/shortener')
const alert = require('alert')

// require dotenv if NODE_ENV is not production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/shorten', (req, res) => {
  // pop-up alert if no URL inputted
  if (!req.body.name) {
    alert("Please enter the correct link !")
    return res.redirect('/')
  }

  const originalLinks = req.body.name
  // check whether the original link is already in the database

  // generate the short links
  const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  const RandomString = generateRandomString(5)
  const host = req.get('origin')
  const shortLinks = host + "/" + RandomString
  return Urls.create({ 
    original_links: originalLinks,
    short_links: shortLinks
  })
    .then(() => {
      res.render('shorten', { shortLinks })
    })
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})