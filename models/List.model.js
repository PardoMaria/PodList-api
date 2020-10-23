const mongoose = require("mongoose");
const User = require("./User.model");
const Podcast = require("./Podcast.model");

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
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

productSchema.virtual("podcasts", {
  ref: "Podcast",
  localField: "_id",
  foreignField: "list",
});

const List = mongoose.model("List", listSchema);

module.exports = List;
