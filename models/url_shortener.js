const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
  origin_link: {
    type: String,
    required: true
  },
  short_link: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('URL', todoSchema)