const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    // base paths
    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      users: "/api/users",
      products: "/api/products",
      search: "/api/search",
    };

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
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.users, require("../routes/user"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/search"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Started on port ${this.port}`);
    });
  }
}

module.exports = Server;
