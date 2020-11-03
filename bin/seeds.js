require("dotenv").config();
require("../config/db.config");
const User = require("../models/User.model");
const faker = require("faker");
const List = require("../models/List.model");

const userIds = [];
const userN = 10;
const listN = 5;

Promise.all([User.deleteMany(), List.deleteMany()])
  .then(() => {
    for (let i = 0; i < userN; i++) {
      const user = new User({
        email: faker.internet.email(),
        password: "1234567890",
        username: faker.name.findName()
      });
      user
        .save()
        .then((u) => {
          for (let j = 0; j < listN; j++) {
            const list = new List({
              name: faker.lorem.words(3),
              user: u._id
            })
            console.log(list)
            list.save()
          }
        })
    }
  })
  .catch((e) => console.log(e));