const Podcast = require("../models/Podcast.model")
const List = require("../models/List.model")
const createError = require("http-errors")

module.exports.createList = (req, res, next) => {
  Product.findById(req.params.id)
    .then((p) => {
      if (p.user === req.currentUser.id) {
        throw createError(403, "You cannot leave reviews for your own product")
      } else {
        const review = new Review({
          ...req.body,
          user: req.currentUser.id,
          product: p.id,
        })
        return review.save().then((r) => {
          res.json(r)
        })
      }
    })
    .catch((e) => next(e))
}

module.exports.deleteList = (req, res, next) => {
  List.findById(req.params.id)
    .then((r) => {
      if (r.user != req.currentUser.id) {
        throw createError(403, "You cannot delete another user's list")
      } else {
        return r.delete().then((r) => {
          res.json({})
        })
      }
    })
    .catch((e) => next(e))
}
