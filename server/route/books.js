const fs = require ("fs");
const con = require("../../server");

let booksData = {

	createTable(con){
		con.query("CREATE TABLE if not exists `library`.`books` (" +
		"`book_id` INT NOT NULL AUTO_INCREMENT," +
		"`picture` VARCHAR(100) NULL," +
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
		"`files` VARCHAR(200) NULL," +
		"`audio` VARCHAR(200) NULL," +
		"`rating` INT DEFAULT '0'," +
		"PRIMARY KEY (`book_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", function(err){
			if (err) throw err;
			console.log("Table 'books' is created");
		});
	},

	addData(req,res){
		let query = `INSERT INTO library.books (book_name, page_amount, year, author_surname, author_name, author_patronymic, publisher, publish_country, genres, amount_paper_book) values ('${req.body.book_name}', "${req.body.page_amount}", "${req.body.year}", "${req.body.author_surname}", "${req.body.author_name}", "${req.body.author_patronymic}", "${req.body.publisher}", "${req.body.publish_country}", "${req.body.genres}", "${req.body.amount_paper_book}");`;
		fs.appendFileSync("./books.txt", query+"\n");
		con.con.query(query, function(err, result){
			if(err){
				console.log(err);
				res.status(500).send(err);
			}
			else{
				// console.log(result);
				res.json(result.insertId);
			}
		});
	},

	addFiles(req,res){
		let query = `UPDATE library.books SET ${req.body.field}='${req.file.originalname}' WHERE book_id = ${req.body.id};`;
		fs.appendFileSync("./books.txt", query+"\n");
		con.con.query(query, function(err, result){
			if(err){
				console.log(err);
				res.status(500).send(err);
			}
			else{
				res.json({});
			}
		});
	},
    
	// startInitTable(con){
	//     con.query("INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('Анна', 'Самусева', 'Сергеевна', 'АВ2824845', '27-12-1997', 'Майская, д.14 кв.90', '375297226164', '000000001', '2', 'anna', '1997anna', 'librarian');"+
	//     "INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('Евгений', 'Козлов', 'Николаевич', 'СВ2556698', '28-10-1995', 'Кавалерийская д.15, кв.105', '375298566589, 80295695956', '000000002', '2', 'evg', '123', 'user');"+ 
	//     "INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('митрий', 'Осин', 'Павлович', 'АВ2625269', '28-05-1996', 'ул.Елецкая, д.3, кв.18', '79033161480', '000000003', '3', 'dimon', '1', 'admin');", function(err){
	//         if (err) throw err;
	//         console.log("Table users is initialized");
	//     });
	// }
};

module.exports = booksData;