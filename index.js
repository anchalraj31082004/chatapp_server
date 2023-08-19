const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const chats = require('./Data/Data')

const app = express();
dotenv.config();
app.use(cors())

app.get("/", (req, resp) => {
    resp.send("app is running well on port 5000")
});

app.get("/api/chat", (req, resp) => {
   resp.send(chats)
})

app.get("api/chat/:id", (req, resp) => {
    const singleUser = chats.find((elm) => elm._id === req.params.id) 
    resp.send(singleUser)
})

const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`server is running on port ${PORT}`))
