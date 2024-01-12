const mongoose = require("mongoose");
const {Schema} = require("mongoose"); 
const path = require("path");
const {model} = mongoose;
const dotenv = require ("dotenv");
dotenv.config();
const fs = require("fs");
var file = fs.statSync('E:\\Projects\\ECMA Script\\Discord-Copy\\Back End\\aesthetic background.jpg');

var filePluginLib = require("mongoose-file");
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;
var uploads_base = path.join(__dirname, "uploads");
var uploads = path.join(uploads_base, "u");

const Connect = () =>{
 mongoose.connect(process.env.MONGODB_URI);
const connection = mongoose.connection;
connection.once('open',()=>{
console.log('MongoDB Connected');
});
}
// Schema
const UserSchema = new Schema({
    Username:{
      type : String,
      required : true
    },
    Password :{
      type : String,
      required : true
    },
    Image : {
      type : String
    }
  });
  //var Data = fs.readFileSync('E:\\Projects\\ECMA Script\\Discord-Copy\\Back End\\aesthetic background.jpg', null);
  const MessageSchema = new Schema({
    Sender : {
      type : String,
      required : true
    },
    Receiver : {
      type : String, 
      required : true
    },
    Messages :{
      type: Array,
  items: {
    type: Object,
    properties: {
      Sender: {
        type: String
      },
      Content: {
        type: String
      }
    }
  }
    }
  });
  const Messages = model('Messages', MessageSchema);
  const Users = model('Users', UserSchema);
  const findRegistered = async(username, password)=>{
        const check = await Users.find({Username : username, Password : password});
        return check.length;
      }
  const findUser = async(username)=>{
      const doc = await Users.find({Username : username});
      return doc.length;
  }
 

  module.exports = {
    Connect,Users, findRegistered, findUser, Messages
}