const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const baseController = require("../controllers/base.controller")
const userController = require("../controllers/user.controller")
const podcastController = require("../controllers/podcast.controller")

module.exports = router

router.get("/", baseController.index)

// Authentication
router.post("/login", userController.login)
router.get("/logout", authMiddleware.isAuthenticated, userController.logout)

// Users
router.get("/user/:id", authMiddleware.isAuthenticated, userController.profile)
// router.post('/user/new', authMiddleware.isNotAuthenticated,userController.createUser);


// Podcasts
router.post("/podcast/:likeId/add", podcastController.addToFav)
router.get("/podcast/:search", podcastController.getPodcastsFromSpotify)
router.get("/myfavs", authMiddleware.isAuthenticated, podcastController.getLikes);
// router.get('/podcast/:id', authMiddleware.isAuthenticated, podcastController.single)
router.delete("/podcast/:id", authMiddleware.isAuthenticated, podcastController.delete)


