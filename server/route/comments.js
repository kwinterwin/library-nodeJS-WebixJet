
const con = require("../../server");

let commentsData = {
	
	createTable(con){
		con.query("CREATE TABLE `comments` ("+
		"`id_com` int(11) NOT NULL AUTO_INCREMENT,"+
		"`id_answer` int(11) DEFAULT NULL,"+
		"`comment` varchar(200) NOT NULL,"+
		"`users_id` int(11) NOT NULL,"+
		"`book_id` int(11) NOT NULL,"+
		"PRIMARY KEY (`id_com`)"+
		") ENGINE=InnoDB DEFAULT CHARSET=latin1;", (err,result)=>{
			if (err) throw err;
			if(result.warningCount === 0){
				console.log("Table 'comments' is created");
				this.startInitTable();
			}	
		});
	},
    
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