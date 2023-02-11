const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Urls = require('./models/shortener')
const alert = require('alert')
const validUrl = require('valid-url')

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
  const originalLinks = req.body.name
  
  // pop-up alert if no URL inputted
  if (!originalLinks || !validUrl.isWebUri(originalLinks)) {
    alert("Please enter the correct URL.")
    return res.redirect('/')
  }

  // check whether the original link is already in the database
  Urls.find({ original_links: originalLinks })
    .lean()
    .then(urlsData => {
      const filterUrlsData = urlsData.filter(data => {
        return data.original_links.includes(originalLinks)
      })
      if (filterUrlsData.length === 0) {
        // generate the new short links
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
          short_links_random_string: RandomString,
          short_urls: shortLinks
        })
          .then(() => {
            res.render('newshorten', { shortLinks })
          })
      }
      res.render('shorten', { urlsData: filterUrlsData })
    })
    .catch(error => console.log(error))
})

app.get("/:shortLinks", (req, res) => {
  const { shortLinks } = req.params
  Urls.findOne({ short_links_random_string: shortLinks })
    .then(urlsData => {
      if (!urlsData) {
        return res.render("error", {
          errorMsg: "Oops! Page Not Found",
          errorLink: req.headers.host + "/" + shortLinks,
        })
      }
      res.redirect(urlsData.original_links)
    })
    .catch(error => console.error(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})