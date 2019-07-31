const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  token: String
},
 {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

// userSchema.virtual('products', {
//   ref: 'product',
//   localField: '_id',
//   foreignField: 'owner'
// });

module.exports = mongoose.model('User', userSchema)
