require("dotenv").config();
require("../config/db.config");
const User = require("../models/User.model");
const Podcast = require("../models/Podcast.model");
// const Review = require("../models/Review.model");
const faker = require("faker");

const userIds = [];
const userN = 10;
// const podcastN = 5;
// const reviewN = 5;

Promise.all([User.deleteMany()])
  .then(() => {
    for (let i = 0; i < userN; i++) {
      const user = new User({
        email: faker.internet.email(),
        password: "1234567890",
        username: faker.name.findName()
      });
      user
        .save()
    }
  })
  .catch((e) => console.log(e));
