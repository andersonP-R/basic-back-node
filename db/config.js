const moongose = require("mongoose").set("strictQuery", false);

const dbConnection = async () => {
  try {
    await moongose.connect(process.env.MONGO_URL);
    console.log("DB started");
  } catch (error) {
    console.log(error);
    throw new Error("There was a problem starting db");
  }
};

module.exports = {
  dbConnection,
};
