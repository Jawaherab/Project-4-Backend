
const express = require('express')
const passport = require('passport')
const Comment = require('../models/comment')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()


router.get('/trees/:tree_id/comments', requireToken, (req, res, next) => {
  console.log('trees comments', req.params.tree_id)
  Comment.find({"tree": req.params.tree_id})
    .then(comments => res.status(200).json({comments: comments}))
    .catch(next)
  
})


// router.get('/dashboard', (req, res, next) => {
  
//   Comment.find()
//     .then(comments => res.status(200).json({comments: comments}))
//     .catch(next)
  
// })



router.get('/comments/:id',requireToken, (req, res, next) => {

  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      requireOwnership(req, comment) 
      res.status(200).json({ comment: comment.toObject() })
    })
    .catch(next)
})


router.post('/trees/:tree_id/comments', requireToken, (req, res, next) => {
  req.body.comment.owner = req.user.id
  req.body.comment.tree = req.params.tree_id
  Comment.create(req.body.comment)
    .then(comment => {
      res.status(201).json({ comment: comment.toObject() })
    })
    .catch(next)
})

router.put('/comments/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.comment.owner

  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
 
      requireOwnership(req, comment)
      return comment.update(req.body.comment)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})


router.delete('/comments/:id', requireToken, (req, res, next) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      // throw an error if current user doesn't own `comment`
      requireOwnership(req, comment)
      comment.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
