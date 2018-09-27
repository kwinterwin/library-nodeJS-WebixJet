const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
var mysql = require("mysql");
const books = require("./server/route/books");
const users = require("./server/route/users");
const orders = require("./server/route/orders");
const likes = require("./server/route/likes");
const comments = require("./server/route/comments");
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

app.post("/server/books", upload.single("upload"), books.addData);
app.get("/server/books", books.allFiles);
app.delete("/server/books/:id", books.deleteBook);
app.put("/server/books/:id", books.updateItem);

app.post("/server/login", users.login);
app.post("/server/login/status", users.loginStatus);
app.post("/server/logout", users.logout);
app.post("/server/login/authorization", users.authorization);
app.get("/server/users", users.getAllUsers);
app.put("/server/users",users.editData);
app.post("/server/users", users.addData);

app.post("/server/orders", orders.addOrder);
app.get("/server/orders", orders.getAllData);
app.delete("/server/orders", orders.deleteData);

app.get("/server/likes", likes.getData);
app.post("/server/likes", likes.setData);

app.get("/server/comments", comments.getData);
app.post("/server/comments", comments.addData);


app.listen(port, ()=>{
	console.log("Start");
});

module.exports.con = con;