const con = require("../../server");
  
let likesData = {

	createTable(con){
		con.query("CREATE TABLE `likes` ("+
		"`like_id` int(11) NOT NULL AUTO_INCREMENT,"+
		"`users_id` int(11) NOT NULL,"+
		"`book_id` int(11) NOT NULL,"+
		"PRIMARY KEY (`like_id`)"+
		") ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;", function(err, result){
			if (err) throw err;
			if(result.warningCount === 0){
				console.log("Table 'likes' is created");
			}	
			
		});
	},
    
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