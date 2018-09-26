const fs = require ("fs");
const con = require("../../server");

let commentsData = {

	// createTable(con){
	// 	con.query("CREATE TABLE if not exists `library`.`books` (" +
	// 	"`book_id` INT NOT NULL AUTO_INCREMENT," +
	// 	"`picture` VARCHAR(100) DEFAULT 'none.jpeg'," +
	// 	"`book_name` VARCHAR(100) NOT NULL," +
	// 	"`page_amount` INT NOT NULL," +
	// 	"`year` VARCHAR(4) NOT NULL," +
	// 	"`author_surname` VARCHAR(45) NULL," +
	// 	"`author_name` VARCHAR(20) NOT NULL," +
	// 	"`author_patronymic` VARCHAR(45) NULL," +
	// 	"`publisher` VARCHAR(45) NOT NULL," +
	// 	"`publish_country` VARCHAR(20) NOT NULL," +
	// 	"`genres` VARCHAR(100) NOT NULL," +
	// 	"`amount_paper_book` INT NOT NULL," +
	// 	"`files` VARCHAR(600) NULL," +
	// 	"`audio` VARCHAR(600) NULL," +
	// 	"`rating` INT DEFAULT '0'," +
	// 	"PRIMARY KEY (`book_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", (err,result)=>{
	// 		if (err) throw err;
	// 		if(result.warningCount === 0){
	// 			console.log("Table 'books' is created");
	// 			this.startInitTable();
	// 		}	
	// 	});
	// },
    
	getData(req, res){
		con.con.query(`SELECT c.*, u.login FROM library.comments c, library.users u where c.users_id=u.users_id and book_id=${req.query.book_id}`, (err, result)=>{
			if (err) throw err;
			let mapComm = new Map();
			let obj = "";
			
			for(let i=0;i<result.length;i++){
				obj = { id:result[i].id_com, value:result[i].comment, open:"true", login:result[i].login };
				if(result[i].id_answer == null){
					mapComm.set(result[i].id_com, obj);
				}
				else{
					let comment = mapComm.get(result[i].id_answer);
					comment.data = [];
					comment.data.push(obj);
				}
				
			}
			let response = [];
			for(let amount of mapComm.values()) {
				response.push(amount);
			}
			res.send(response);
			// console.log(response);
			// console.log(result);
			// res.send(result);
		});
	},
	
	addData(req,res){
		req.body = JSON.parse(JSON.stringify(req.body));
		if(req.body.hasOwnProperty("id_answer")){
			let query = `insert into comments (users_id, book_id, comment, id_answer) values (${req.body.users_id}, ${req.body.book_id}, '${req.body.comment}', ${req.body.id_answer})`;
			con.con.query(query, (err)=>{
				if(err) throw err;
				res.send({});
			});
		}
		else con.con.query(`insert into comments (users_id, book_id, comment) values (${req.body.users_id}, ${req.body.book_id}, '${req.body.comment}')`, (err)=>{
			if(err) throw err;
			res.send({});
		});
	}

};

module.exports = commentsData;