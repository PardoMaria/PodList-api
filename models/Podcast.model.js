const mongoose = require("mongoose");
const User = require("./User.model");
const List = require("./List.model");

const podcastSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    total_episodes: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "List",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, toReturn) => {
        toReturn.id = document._id;
        delete toReturn.__v;
        delete toReturn._id;
        delete toReturn.createdAt;
        delete toReturn.updatedAt;
        return toReturn;
      },
    },
  }
);

const Podcast = mongoose.model("Podcast", podcastSchema);

module.exports = Podcast;
