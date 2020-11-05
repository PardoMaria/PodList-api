const createError = require("http-errors")
const User = require("../models/User.model")
const List = require("../models/List.model")
const Like = require("../models/Like.model")


module.exports.login = (req, res, next) => {
  console.log("hola")
  console.log(req.body)
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

// module.exports.editUser = (req, res, next) => {
//   const body = req.body

//   User.findOneAndUpdate({
//       _id: req.params.id
//     }, body, {
//       runValidators: true,
//       new: true
//     })
//     .then(user => {
//       res.status(201).json(user)
//     })
//     .catch(next)
// }

//ESTOS DOS NO LOS ESTAS USANDO AUN

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
    .then(() => Like.remove({user: req.params.id}))
    .then(() => List.remove({user: req.params.id}))
    .then(() => req.session.destroy())
    .then(next)
    .catch(err => console.log(err))
}

// module.exports.createUser = (req, res, next) => {
//   const user = new User({
//     ...req.body,
//     avatar: req.file ? req.file.path : undefined
//   });
// ​
//   user.save()
//     .then(user => {
//       mailer.sendValidationEmail({
//         name: user.name,
//         email: user.email,
//         id: user._id.toString(),
//         activationToken: user.activation.token
//       })
//       res.status(200).json({
//         message: 'Check your email for activation'
//       })
//     })
//     .catch((error) => {
// ​
//       console.log('entra en el error', error);
//       if (error instanceof mongoose.Error.ValidationError) {
//         throw createError(400, "Wrong credentials")
//       } else if (error.code === 11000) { // error when duplicated user
//         throw createError(400, "User already exists")
//       } else {
//         next(error);
//       }
//     })
//     .catch(e => next(e))
// }