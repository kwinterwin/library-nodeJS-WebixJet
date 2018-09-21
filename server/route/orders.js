let ordersData = {
	createTable(con){
		con.query("CREATE TABLE if not exists `library`.`orders` (" +
        "  `contact_id` INT NOT NULL," +
        "  `order_id` INT NOT NULL AUTO_INCREMENT," +
        "  `book_id` INT NOT NULL," +
        "  `order_date` DATE NOT NULL," +
        "  PRIMARY KEY (`order_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", function(err){
			if (err) throw err;
			console.log("Table 'orders' is created");
		});
	}
};
module.exports = ordersData;