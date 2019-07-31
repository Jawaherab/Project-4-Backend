const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  
  comment: {
    type: String,
    required: true
  }, 
  image: {
    type: String,
    required: true
  },

    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    tree: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tree',
        required: true
        },
      }, {
  timestamps: true,
 
})

// userSchema.virtual('products', {
//   ref: 'product',
//   localField: '_id',
//   foreignField: 'owner'
// });

module.exports = mongoose.model('Comment', commentSchema)
