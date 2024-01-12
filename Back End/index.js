let express = require("express");
let app = express();
const session = require('express-session');
let {Server} = require("socket.io");
const http = require("http");
const cors = require("cors");
const {Connect, Users, findRegistered, findUser, Messages} = require("./MongoDB");
const server = http.createServer(app);
var multer = require("multer");
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded(false));
app.use(express.json());
app.use(bodyParser.json());
let fileName = '';
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'E:\\Projects\\ECMA Script\\Discord-Copy\\front-end\\public\\Pics')
  },
  filename: function (req, file, cb) {
    let Body = req.body;
    let User = Body.Username;
    cb(null,`${User}.${file.originalname.split('.').pop()}`);
    fileName = file.originalname;
  }
})


var upload = multer({storage : Storage});
app.use(cors());

Connect();
const io = new Server(server,{cors:{origin:"http://localhost:3000"}});

app.post("/submission",upload.single('profile'),(req,res,next)=>{
  try {
    const Data = req.body;
    Users.create({Username : Data.Username, Password : Data.Password, Image : fileName});
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});




io.on('connect',(socket)=>{
    socket.on('find Registered',async(user,password)=>{
      const found = await findRegistered(user,password);
        io.emit('find Registered', found,user);
    });
});

io.on('connect',(socket)=>{
  socket.on('find User',async(user)=>{
    const found = await findUser(user);
      io.emit('find User', found);
  });
});

io.on('connect',(socket)=>{
  socket.on('create Session',async(sender,receiver)=>{
    Messages.create({Sender : sender, Receiver : receiver, Messages : [] });
  });
});

io.on('connect',(socket)=>{
  socket.on('Add Message',async(sender,receiver,message)=>{
    try{ 
    let result = await Messages.findOneAndUpdate({Sender : sender, Receiver : receiver},{$push : {Messages : {Sender : sender, Content : message}}});
     if(result === null){
      let result = await Messages.findOneAndUpdate({Sender : receiver, Receiver : sender},{$push : {Messages : {Sender : sender, Content : message}}});
     }
  }
    catch(error){
      console.log(error);
    }
  });
});

io.on('connect',(socket)=>{
  socket.on('Messages',async(sender,receiver)=>{
    try{
    let Body = await Messages.findOne({Sender : sender , Receiver : receiver});
    if(Body === null){
       Body = await Messages.findOne({Sender : receiver , Receiver : sender});
    }
    let Message = Body.Messages;
    if(Message !== undefined){
    io.emit('Messages', Message,sender,receiver);
    }
    else{
      io.emit('Messages', [],sender,receiver);
    }
  }
    catch(err){
    }
  });
});

io.on('connect',(socket)=>{
  socket.on('Receiver List',async(sender)=>{
    let Switch = 0;
    let records = await Messages.find({ Sender : { $in: sender } });
    let SecondRecord = await Messages.find({Receiver : {$in : sender}});
   
    let Receive = [];
    records.map((content)=>{
      Receive = [...Receive,content.Receiver];
    });
    SecondRecord.map((content)=>{
      Receive = [...Receive,content.Sender];
    });
    io.emit("Receiver List", Receive, sender);
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg,username) => {
    io.emit('chat message', msg,username);
  });
});



server.listen(9000, () => {
  console.log("it works");
});
