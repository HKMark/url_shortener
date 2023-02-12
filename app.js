// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Urls = require('./models/shortener')
const alert = require('alert')
const validUrl = require('valid-url')

const generateRandomString = require('./utils/generateRandomString')

// require dotenv if NODE_ENV is not production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000

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

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/shorten', (req, res) => {
  const originalLinks = req.body.name
  
  // pop-up alert if no URL inputted
  if (!originalLinks || !validUrl.isWebUri(originalLinks)) {
    alert("Please enter the correct URL.")
    return res.redirect('/')
  }

  // check whether the original link is already in the database
  Urls.findOne({ original_links: originalLinks })
    .lean()
    .then(urlsData => {
      if (!urlsData) {
        // generate the new short links
        const randomString = generateRandomString(5)
        const host = req.get('origin')
        const shortLinks = host + "/" + randomString
        return Urls.create({
          original_links: originalLinks,
          short_links_random_string: randomString,
          short_urls: shortLinks
        })
          .then(() => {
            res.render('newShorten', { shortLinks })
          })
      }
      res.render('shorten', { urlsData })
    })
    .catch(error => console.log(error))
})

app.get("/:shortLinks", (req, res) => {
  const { shortLinks } = req.params
  Urls.findOne({ short_links_random_string: shortLinks })
    .then(urlsData => {
      if (!urlsData) {
        // render error page if can't found the url
        return res.render("error", {
          errorMsg: "Oops! Page Not Found",
          errorLink: req.headers.host + "/" + shortLinks,
        })
      }
      res.redirect(urlsData.original_links)
    })
    .catch(error => console.error(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})