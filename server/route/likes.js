const con = require("../../server");
  
let likesData = {
	// createTable(con){
	// 	con.query("CREATE TABLE if not exists `library`.`orders` (" +
	//     "  `contact_id` INT NOT NULL," +
	//     "  `order_id` INT NOT NULL AUTO_INCREMENT," +
	//     "  `book_id` INT NOT NULL," +
	//     "  `order_date` VARCHAR(30) NOT NULL," +
	//     "  PRIMARY KEY (`order_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", function(err, result){
	// 		if (err) throw err;
	// 		if(result.warningCount === 0){
	// 			console.log("Table 'orders' is created");
	// 		}	
			
	// 	});
	// },
    
	getData(req,res){
		con.con.query(`select count(users_id) as count from likes where users_id=${req.query.users_id} AND book_id=${req.query.book_id}`, (err,result)=>{
			if (err) throw err;
			else res.json(result);
		});
	},
    
	setData(req,res){
		con.con.query(`insert into likes (users_id, book_id) values (${req.body.users_id}, ${req.body.book_id})`, (err,result)=>{
			if (err) throw err;
			else res.json(result);
		});
	}


};
module.exports = likesData;