const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const baseController = require("../controllers/base.controller")
const userController = require("../controllers/user.controller")
const podcastController = require("../controllers/podcast.controller")
const listController = require("../controllers/list.controller")


module.exports = router

router.get("/", baseController.index)

// Authentication
router.post("/login", userController.login)
router.get("/logout", authMiddleware.isAuthenticated, userController.logout)

// Users
router.get("/user/:id", authMiddleware.isAuthenticated, userController.profile)
// router.post('/user/new', authMiddleware.isNotAuthenticated,userController.createUser);


// Podcasts
router.post("/list/:id/add", listController.addToList)
router.get("/podcast/:search", podcastController.getPodcastsFromSpotify)
router.get("/lists", authMiddleware.isAuthenticated, listController.showLists);
router.get('/lists/:id', authMiddleware.isAuthenticated, listController.showOneList);
router.patch("/lists/:id", authMiddleware.isAuthenticated, listController.editList)

//Lists
router.post('/list/new', authMiddleware.isAuthenticated, listController.create)

//TODO: 1. FORMULARIO LISTA A CREAR Y EDITAR(mismo componente)


