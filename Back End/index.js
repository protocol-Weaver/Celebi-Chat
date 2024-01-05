let express = require("express");
let app = express();
const session = require('express-session');
let {Server} = require("socket.io");
const http = require("http");
const cors = require("cors");
const {Connect, Users} = require("./MongoDB");

//let {addUser,createTable} = require("./db");
const passport = require('passport');

const server = http.createServer(app);
app.use(cors());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.use(passport.initialize());
app.use(passport.session());

Connect();


const io = new Server(server,{cors:{origin:"http://localhost:3000"}});
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded(false));
app.use(bodyParser.json());
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
//createTable();
app.post("/submission",(req,res)=>{
  try {
    console.log(req.body);
    const data = req.body;
    const user = Users.create({Username : data.Username, Password : data.Password});
    res.json("worked");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});
io.on('connection', (socket) => {
  socket.on('chat message', (msg,username) => {
    io.emit('chat message', msg,username);
  });
 
  console.log("connected");
});
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
// Google Auth 

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID = '323630120979-ruasj9jq0vsl569mqm3ndrsm9p2ukeve.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({clientID:GOOGLE_CLIENT_ID,
clientSecret: GOOGLE_CLIENT_SECRET,
callbackURL: "http://localhost:3000/auth/google/callback"}, 
 function(accessToken,refreshToken,profile,done){
  userProfile=profile;
  console.log(profile);   
  return done(null, userProfile);
 }
));

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('./p.html');
  });
server.listen(9000, () => {
  console.log("it works");
});
