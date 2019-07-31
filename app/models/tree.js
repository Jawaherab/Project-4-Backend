const mongoose = require('mongoose')

const treeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }, type: {
    type: String,
    required: true
  }, address: {
    type: String,
    required: true
  }, numbers: {
    type: Number,
    required: true
  },  lat: {
    type: Number,
    required: true
  }, lng: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})
const Tree = mongoose.model('Tree', treeSchema)
module.exports = Tree 

