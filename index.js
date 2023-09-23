const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
// const chats = require('./Data/Data');
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes');
require('./config/db');
const {notFound, errorHandler} = require("./middleware/errorMiddleWare")

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json())

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, resp) => {
resp.send("app is running well on port 5000")
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
});