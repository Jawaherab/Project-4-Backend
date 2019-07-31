
const express = require('express')
const passport = require('passport')
const Tree = require('../models/tree')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()


router.get('/trees', requireToken, (req, res, next) => {
  
  Tree.find({"owner": req.user.id})
    .then(trees => res.status(200).json({trees: trees}))
    .catch(next)
  
})


router.get('/dashboard', (req, res, next) => {
  
  Tree.find()
    .then(trees => res.status(200).json({trees: trees}))
    .catch(next)
  
})



router.get('/trees/:id', (req, res, next) => {

  Tree.findById(req.params.id)
    .then(handle404)
    .then(tree => {
      // requireOwnership(req, tree) 
      res.status(200).json({ tree: tree.toObject() })
    })
    .catch(next)
})


router.post('/trees', requireToken, (req, res, next) => {
  req.body.tree.owner = req.user.id

  Tree.create(req.body.tree)
    .then(tree => {
      res.status(201).json({ tree: tree.toObject() })
    })
    .catch(next)
})

router.put('/trees/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.tree.owner

  Tree.findById(req.params.id)
    .then(handle404)
    .then(tree => {
 
      requireOwnership(req, tree)
      return tree.update(req.body.tree)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})


router.delete('/trees/:id', requireToken, (req, res, next) => {
  Tree.findById(req.params.id)
    .then(handle404)
    .then(tree => {
      // throw an error if current user doesn't own `tree`
      requireOwnership(req, tree)
      tree.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
