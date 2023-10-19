const app = require("express")();
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = 8000;

app.use(cors());

const expressServer = app.listen(PORT, () =>
  console.log(`Server is running at port no`, PORT)
);

const io = new Server(expressServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userId = socket.id.substring(0, 4);
  console.log(`${userId} is connected!`);
  socket.emit("connected", "Welcome to the Chat App" )

  socket.broadcast.emit("connected-user", `${userId} joined`)

  socket.on("message", (data) => {
     console.log(data)
     io.emit("send-message", `${userId} : ${data}`)
  })


  
});
