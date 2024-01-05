var pg = require('pg');
let dbConfig = require("./db.config.js");

var client = new pg.Pool(dbConfig);
const createTable = ()=>{
client.query(`CREATE TABLE IF NOT EXISTS "Messages" (
    user_id integer FOREIGN KEY NOT NULL,
    content text NOT NULL,
    type text NOT NULL,
    timestamp time NOT NULL
)`);

client.query(`CREATE TABLE IF NOT EXISTS "Users"(
    user_id integer PRIMARY KEY NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
)`);
}

const addUser = (User_id,Name,Email,Password)=>{
client.query(`
INSERT INTO "Users" VALUES ($1,$2,$3,$4) RETURNING *
`,[User_id,Name,Email,Password]);
}


module.exports = {
    createTable,
    addUser
}