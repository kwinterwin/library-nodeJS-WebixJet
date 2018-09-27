const fs = require ("fs");
const con = require("../../server");

let booksData = {

	createTable(con){
		con.query("CREATE TABLE if not exists `library`.`books` (" +
		"`book_id` INT NOT NULL AUTO_INCREMENT," +
		"`picture` VARCHAR(100) DEFAULT 'none.jpeg'," +
		"`book_name` VARCHAR(100) NOT NULL," +
		"`page_amount` INT NOT NULL," +
		"`year` VARCHAR(4) NOT NULL," +
		"`author_surname` VARCHAR(45) NULL," +
		"`author_name` VARCHAR(20) NOT NULL," +
		"`author_patronymic` VARCHAR(45) NULL," +
		"`publisher` VARCHAR(45) NOT NULL," +
		"`publish_country` VARCHAR(20) NOT NULL," +
		"`genres` VARCHAR(100) NOT NULL," +
		"`amount_paper_book` INT NOT NULL," +
		"`files` VARCHAR(600) NULL," +
		"`audio` VARCHAR(600) NULL," +
		"`rating` INT DEFAULT '0'," +
		"PRIMARY KEY (`book_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", (err,result)=>{
			if (err) throw err;
			if(result.warningCount === 0){
				console.log("Table 'books' is created");
				this.startInitTable();
			}	
		});
	},

	addData(req,res){
		req.body = JSON.parse(JSON.stringify(req.body));
		if(req.body.hasOwnProperty("field")){
			if(req.body.hasOwnProperty("filesData")){
				if(req.body.filesData != ""){
					let query = `UPDATE library.books SET ${req.body.field}='${req.body.filesData}' WHERE book_id = ${req.body.id};`;
					fs.appendFileSync("./books.txt", query+"\n");
					con.con.query(query, function(err){
						if(err){
							console.log(err);
							res.status(500).send(err);
						}
						else{
							res.json({});
						}
					});
				}
				else res.json({});
			}
			else {
				let query = `UPDATE library.books SET ${req.body.field}='${req.file.originalname}' WHERE book_id = ${req.body.id};`;
				fs.appendFileSync("./books.txt", query+"\n");
				con.con.query(query, function(err){
					if(err){
						console.log(err);
						res.status(500).send(err);
					}
					else{
						res.json({});
					}
				});
			}
		}
		else {
			let query = `INSERT INTO library.books (book_name, page_amount, year, author_surname, author_name, author_patronymic, publisher, publish_country, genres, amount_paper_book) values ('${req.body.book_name}', "${req.body.page_amount}", "${req.body.year}", "${req.body.author_surname}", "${req.body.author_name}", "${req.body.author_patronymic}", "${req.body.publisher}", "${req.body.publish_country}", "${req.body.genres}", "${req.body.amount_paper_book}");`;
			fs.appendFileSync("./books.txt", query+"\n");
			con.con.query(query, function(err, result){
				if(err){
					console.log(err);
					res.status(500).send(err);
				}
				else{
					res.json(result.insertId);
				}
			});
		}
	},
    
	startInitTable(){
		fs.readFile("./books.txt", "utf8", 
			function(error,data){
				if(error) throw error; 
				let mass = data.split(";");
				mass.pop();
				for(let i=0;i<mass.length;i++){
					con.con.query(mass[i], (err)=>{
						if (err) throw err;
						console.log("Table 'books' is initialized");
					});
				}
				
			});
	},

	allFiles(req,res){
		if(req.query.hasOwnProperty("filter")){
			if(req.query.filter=="old"){
				con.con.query("select * from books order by year asc limit 10", (err, result)=>{
					if(err){
						res.status(500).send(err);
						console.log(err);
					}
					else{
						res.json(result);
					}
				});
			}
			else if(req.query.filter === "new"){
				con.con.query("select * from books order by year desc limit 10", (err, result)=>{
					if(err){
						res.status(500).send(err);
						console.log(err);
					}
					else{
						res.json(result);
					}
				});
			}
			else if(req.query.filter === "long"){
				con.con.query("select * from library.books order by page_amount desc limit 10", (err, result)=>{
					if(err){
						res.status(500).send(err);
						console.log(err);
					}
					else{
						res.json(result);
					}
				});
			}
			else if(req.query.filter === "nameLong"){
				con.con.query("select * from library.books order by length(book_name) desc limit 10", (err, result)=>{
					if(err){
						res.status(500).send(err);
						console.log(err);
					}
					else{
						res.json(result);
					}
				});
			}
			else if(req.query.filter === "author"){
				con.con.query("SELECT author_surname, author_name, author_patronymic FROM library.books group by author_surname order by count(book_name) desc limit 3;", (err, result)=>{
					if(err){
						res.status(500).send(err);
						console.log(err);
					}
					else{
						res.json(result);
					}
				});
			}
			else if(req.query.filter === "spanish"){
				con.con.query("SELECT * FROM library.books where year between 1980 AND 2000 AND publish_country='Испания';", (err, result)=>{
					if(err){
						res.status(500).send(err);
						console.log(err);
					}
					else{
						res.json(result);
					}
				});
			}
			else if(req.query.filter === "files"){
				con.con.query("SELECT * FROM library.books where not(audio is null) AND not(amount_paper_book is null) AND files is null;", (err, result)=>{
					if(err){
						res.status(500).send(err);
						console.log(err);
					}
					else{
						res.json(result);
					}
				});
			}
		}
		else if(req.query.hasOwnProperty("book_id")){
			con.con.query(`select * from books where book_id=${req.query.book_id}`, (err, result)=>{
				if(err){
					res.status(500).send(err);
					console.log(err);
				}
				else{
					res.json(result);
				}
			});
		}
		else {con.con.query("select * from books", (err, result)=>{
			if(err){
				res.status(500).send(err);
				console.log(err);
			}
			else{
				res.json(result);
			}
		});
		}
	},

	deleteBook(req,res){
		con.con.query(`delete from books where book_id=${req.body.book_id}`, (err,result)=>{
			if(err){
				res.status(500).send(err);
				console.log(err);
			}
			else{
				res.json(result);
			}
		});
	},

	updateItem(req,res){
		con.con.query(`UPDATE library.books set amount_paper_book=${req.body.amount_paper_book} where book_id=${req.body.book_id}`, (err, result)=>{
			if(err) throw err;
			else res.json(result);
		});
	}
};

module.exports = booksData;