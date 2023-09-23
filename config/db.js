const mongoose = require("mongoose");
require("dotenv").config();

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             // useFindAndModify: true,
//         })
//         console.log(`Mongodb connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.log(`Error of db.js: ${error.message}`);
//         process.exit();
//     }
// }

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("Error of DB: ", err.message);
  });

const connectDB = mongoose.connection;

module.exports = connectDB;
