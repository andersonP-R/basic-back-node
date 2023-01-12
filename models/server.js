const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.usersPath = "/api/users";
    this.authPath = "/api/auth";

    // Conexión db
    this.connectToDb();

    // Middlewares
    this.middlewares();

    // Rutas
    this.routes();
  }

  async connectToDb() {
    await dbConnection();
  }

  middlewares() {
    // Cors - para protección de los rest endpoints.
    this.app.use(cors());

    // Json parse body
    this.app.use(express.json());

    this.app.use(express.static("public"));
  }

  // Routes
  routes() {
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.usersPath, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Started on port ${this.port}`);
    });
  }
}

module.exports = Server;
