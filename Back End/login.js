let express = require("express");
let fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
let jSon = fs.readFileSync("id.json");
app.use(bodyParser.urlencoded({ extended: false }));
let jsonData = JSON.parse(jSon);
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  jsonData.users.push({ email: email, password: password });
  fs.writeFileSync("id.json", JSON.stringify(jsonData));
  res.sendFile(__dirname + "/id.json");
});

app.listen(3000);
