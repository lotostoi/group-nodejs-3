const { Schema, model } = require('mongoose')
const moment = require('moment');

const Task = new Schema({
  task: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'waiting',
  },
  date: {
    type: String,
    default: `${moment().format('YYYY-MM-DD')}`,
  },

})

module.exports = model('tasks', Task)
