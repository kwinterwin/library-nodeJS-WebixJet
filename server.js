const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
var mysql = require("mysql");
const books = require("./server/route/books");
const users = require("./server/route/users");
const orders = require("./server/route/orders");
var multer  = require("multer");

let app = express();

let port = 3000;

let con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "1997anna"
});
  
con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

con.query("create database if not exists library ", function (err) {
	if (err) throw err;
	console.log("Database create");
	con.query("use library", function(err){
		if (err) throw err;
		console.log("Database change");
		books.createTable(con);
		users.createTable(con, con);
		orders.createTable(con);
	});
});



app.use("/server", express.static("uploads"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: "replace this string... k12jh40918e4019u3",
	resave: false,
	saveUninitialized:true,
	cookie: { maxAge: 60*60*1000 }
}));


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var upload = multer({ storage: storage });

app.post("/server/books", books.addData);
app.post("/server/upload", upload.single("upload"), books.addFiles);
app.post("/server/login", users.login);
app.post("/server/login/status", users.loginStatus);
app.post("/server/logout", users.logout);
app.post("/server/login/authorization", users.authorization);
// app.put("/server/users/:id", users.saveData);


app.listen(port, ()=>{
	console.log("Start");
});

module.exports.con = con;