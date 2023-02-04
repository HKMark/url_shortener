const mongoose = require('mongoose')
const Urls = require('../shortener')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  const original_links = "https://www.google.com.hk/"
  
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
  const host = "http://localhost:3000"
  const short_links = host + "/" + RandomString
  
  Urls.create({ 
    original_links: original_links,
    short_links: short_links
   })
  console.log('done')
})