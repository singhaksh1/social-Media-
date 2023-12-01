const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async () => {
  const mongoUri = `${process.env.MONGODB_URI}`;
  console.log(mongoUri); 
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose
    .connect(mongoUri, connectionParams)
    .then(() => {
      console.log("Connected to the database ");
    })
    .catch((err) => {
      console.error(`Error connecting to the database. n${err}`);
    });
};
