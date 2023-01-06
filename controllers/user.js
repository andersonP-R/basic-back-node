const { response, request } = require("express");

const getUsers = (req = request, res = response) => {
  const query = req.query;

  res.json({
    status: "success",
    message: "GET method from controller",
    query,
  });
};

const createUser = (req, res = response) => {
  const { name } = req.body;

  res.json({
    status: "success",
    message: "POST method from controller",
    name,
  });
};

const deleteUser = (req, res = response) => {
  res.json({
    status: "success",
    message: "DELETE method from controller",
  });
};

const updateUser = (req, res = response) => {
  const { id } = req.params;

  res.json({
    status: "success",
    message: "PUT method from controller",
    id,
  });
};

//
module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};
