const List = require("../models/List.model")
const createError = require("http-errors")


module.exports.create = (req, res, next) => {
  const list = new List({
    user: req.session.user.id,
    name: req.body.name,
  })

  list.save()
    .then(list => res.status(201).json(list))
    .catch(next)
}

// module.exports.addToList = (req, res, next) => {
//   List.findById(req.params.id)
//     .then((l) => {
//       //TODO: devolver 404 si la lista no existe OK HECHO
//       //TODO: comprobar que si el podcast ya esta en la lista y que no se añada NO HECHO
//       l.podcasts.push(req.body)
//       return l.save()
//         .then(() => {
//           res.json()
//         })
//     })
//     .catch(next)
// }

module.exports.addToList = (req, res, next) => {
  List.findById(req.params.id)
    .then((l) => {
      if (!l) {
        throw createError(404, 'list not found')
      } else {
        console.log(req.body.name);
        const existingPodcast = l.podcasts.find(p => {
          console.log(p.name);
          return p.name === req.body.name;
        })
        console.log(existingPodcast)
        if (existingPodcast) {
          res.json()
        } else {
          l.podcasts.push(req.body)
          return l.save()
            .then(() => {
              res.json()
            })
        }
      }
    })
}


module.exports.editList = (req, res, next) => {
  const body = req.body

  List.findOneAndUpdate({
      _id: req.params.id
    }, body, {
      runValidators: true,
      new: true
    })
    .then(list => {
      res.status(201).json(list)
    })
    .catch(next)
}

module.exports.showLists = (req, res, next) => {
  List.find({
      user: req.currentUser.id
    })
    .then((lists) => {
      res.json(lists)
    })
}

module.exports.showOneList = (req, res, next) => {
  List.findById(req.params.id)
    .then((list) => {
      res.json(list)
    })
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