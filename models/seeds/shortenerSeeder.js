const mongoose = require('mongoose')
const Urls = require('../shortener')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const generateRandomString = require('../../utils/generateRandomString')

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  const originalLinks = "https://www.google.com.hk/"
  const randomString = generateRandomString(5)
  const host = "http://localhost:3000"
  const shortLinks = host + "/" + randomString
  Urls.create({
          original_links: originalLinks,
          short_links_random_string: randomString,
          short_urls: shortLinks
        })
  console.log('done')
})