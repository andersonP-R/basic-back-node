const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const User = require("../models/user");
const Category = require("../models/category");

const collectionsAllowed = ["categories", "roles", "products", "users"];

const searchUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  //   if (isMongoId) {
  //     const user = await User.findById(term);
  //     return res.json({
  //       results: user ? [user] : [],
  //     });
  //   }

  if (!isMongoId) {
    res.status(400).json({
      status: "error",
      message: "Invalid id",
      results: [],
    });
  } else {
    const user = await User.findById(term);
    return res.status(200).json({
      status: "success",
      results: [user],
    });
  }

  const users = await User.find({ name: term });
  res.status(200).json({
    results: users,
  });
};

const search = (req, res = response) => {
  const { collection, term } = req.params;
  if (!collectionsAllowed.includes(collection)) {
    return res.status(400).json({
      status: "error",
      message: "Collection not allowed",
    });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "products":
      break;
    case "categories":
      break;

    default:
      res.status(500).json({
        status: "error",
        message: "Query not implemented yet",
      });
  }
};

module.exports = {
  search,
};
