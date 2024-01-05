const mongoose = require("mongoose");
const {Schema} = require("mongoose"); 
const {model} = mongoose;
const dotenv = require ("dotenv");
dotenv.config();


const Connect = () =>{
mongoose.connect(process.env.MONGODB_URI);
const connection = mongoose.connection;
connection.once('open',()=>{
console.log('MongoDB Connected');
});
}
Connect();
// Schema
const UserSchema = new Schema({
    Username:{
      type : String,
      required : true
    },
    Password :{
      type : String,
      required : true
    }
  });

  const Users = model('Users', UserSchema);
  
  module.exports = {
    Connect,Users
}