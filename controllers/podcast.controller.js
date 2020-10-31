const Podcast = require("../models/Podcast.model")
// const List = require("../models/List.model")
const createError = require("http-errors")
const SpotifyWebApi = require('spotify-web-api-node')
const axios = require('axios')
const Like = require("../models/Like.model")

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

let token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    token = data.body['access_token']
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error)
    next(error)
  })

module.exports.getPodcastsFromSpotify = (req, res, next) => {

  console.log(req.params)
  axios({
      url: `https://api.spotify.com/v1/search?q=${req.params.search}&type=show&market=ES`,
      method: 'get',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(podcast => {
      res.json(podcast.data.shows.items)
    })
    .catch(next)
}

module.exports.getLikes = (req, res, next) => {
  Like.find({
      user: req.currentUser.id
    })
    .then(likes => {
      res.json(likes)
    })
    .catch(next)
}

module.exports.addToFav = (req, res, next) => {
  console.log('HOLAAAAAAAAAAAA',req.params.likeId)

  const params = {
    podcastId: req.params.likeId,
    user: req.currentUser.id,
    podcast: req.body
  }

  Like.findOne(params)
    .then(like => {
      if (like) {
        Like.findByIdAndRemove(like._id)
          .then(() => {
            res.json({
              likes: -1
            })
          })
          .catch(next)
      } else {
        const like = new Like(params)
        like.save()
          .then(() => {
            res.json({
              likes: 1
            })
          })
          .catch(next)
      }
    })
    .catch(next)
}


module.exports.create = (req, res, next) => {
  const podcast = new Podcast({
    user: req.session.user.id,
    name: req.body.name,
    description: req.body.description,
    total_episodes: req.body.total_episodes,
  })

  podcast.save()
    .then(podcast => res.status(201).json(podcast))
    .catch(next)
}

// module.exports.edit = (req, res, next) => {
//   const body = req.body

//   Podcast.findOneAndUpdate({ _id: req.params.id }, body, { runValidators: true, new: true })
//       .then(podcast => {
//           res.status(201).json(podcast)
//       })
//       .catch(next)
// }

module.exports.delete = (req, res, next) => {
  Podcast.findByIdAndRemove(req.params.id)
    .then(podcast => res.status(200).json(podcast))
    .catch(err => console.log(err))
}