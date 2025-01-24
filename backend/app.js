const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const dotenv = require("dotenv")
const path = require("path")
const cors = require("cors")
const socketServer = require("./socket")
const router = require("./router")


const mongooseConnection = require("./config/mongooseConnection")
const chatController = require("./controller/ChatController")

dotenv.config({path: path.join(__dirname, "config", "config.env")})
app.use(express.json())
app.use(cors())
socketServer(server) 
mongooseConnection()

app.use("/chat",router)

const port = process.env.PORT || 8000

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})