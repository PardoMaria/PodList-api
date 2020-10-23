const createError = require("http-errors")
const User = require("../models/User.model")
const Podcast = require("../models/Podcast.model")
const List = require("../models/List.model")


module.exports.login = (req, res, next) => {
  const {email, password} = req.body
  if (!email || !password) {
    throw createError(400, "Missing credentials")
  }
  User.findOne({email})
    .then((user) => {
      if (!user) {
        throw createError(400, "Wrong credentials")
      } else {
        return user.checkPassword(password).then((match) => {
          if (!match) {
            throw createError(400, "Wrong credentials")
          } else {
            req.session.user = user
            res.json(user)
          }
        })
      }
    })
    .catch((e) => next(e))
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.json({message: 'user logout'})
  res.status(204).json()
}

module.exports.profile = (req, res, next) => {
  User.findById(req.params.id)
    .populate("podcasts")
    .populate("lists")
    .populate({
      path: "lists",
      populate: {
        path: "podcast",
        model: "Podcast"
      },
    })
    .then((u) => {
      res.json(u)
    })
}

module.exports.delete = (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => Podcast.remove({user: req.params.id}))
    .then(() => List.remove({user: req.params.id}))
    .then(() => req.session.destroy())
    .then(next)
    .catch(err => console.log(err))
}