const { response } = require("express");

const validateRole = (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      message: "Validate token first before validate user role",
    });
  }

  const { role, name } = req.user;
  if (role !== "admin") {
    return res.status(401).json({
      message: `${name} it's not admin user`,
    });
  }

  next();
};

const hasARole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        message: "Validate token first before validate user role",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(500).json({
        message: `Valid roles to this service: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  validateRole,
  hasARole,
};
