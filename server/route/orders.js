const con = require("../../server");
  
let ordersData = {
	createTable(con){
		con.query("CREATE TABLE if not exists `library`.`orders` (" +
        "  `contact_id` INT NOT NULL," +
        "  `order_id` INT NOT NULL AUTO_INCREMENT," +
        "  `book_id` INT NOT NULL," +
        "  `order_date` VARCHAR(30) NOT NULL," +
        "  PRIMARY KEY (`order_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", function(err, result){
			if (err) throw err;
			if(result.warningCount === 0){
				console.log("Table 'orders' is created");
			}	
			
		});
	},

	addOrder(req,res){
		let query = `insert into library.orders (contact_id, book_id, order_date) values (${req.body.contact_id},${req.body.book_id},'${req.body.order_date}')`;
		con.con.query(query, (err, result)=>{
			if (err) throw err;
			else res.json(result);
		});
	},

	getAllData(req,res){
		if(req.query.hasOwnProperty("contact_id")){
			con.con.query(`SELECT l.*, b.* FROM library.orders AS l, library.books as b WHERE l.book_id = b.book_id AND l.contact_id = ${req.query.contact_id};`, (err, result)=>{
				if (err) throw err;
				else res.json(result);
			});
		}
		else {
			con.con.query("select * from orders", (err, result)=>{
				if (err) throw err;
				else res.json(result);
			});
		}
	},

	deleteData(req,res){
		con.con.query(`delete from orders where order_id=${req.body.id}`, (err, result)=>{
			if (err) throw err;
			else res.json(result);
		});
	}
};
module.exports = ordersData;