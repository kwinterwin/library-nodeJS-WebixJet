
const con = require("../../server");

let usersData = {

	createTable(con, con1){
		con.query("CREATE TABLE if not exists `library`.`users` (" +
        "  `users_name` VARCHAR(20) DEFAULT NULL," +
        "  `users_surname` VARCHAR(25) DEFAULT NULL," +
        "  `users_patronymic` VARCHAR(20) DEFAULT NULL," +
        "  `passport` VARCHAR(12) DEFAULT NULL," +
        "  `birthday` VARCHAR(25) DEFAULT NULL," +
        "  `address` VARCHAR(100) DEFAULT NULL," +
        "  `phone` VARCHAR(60) DEFAULT NULL," +
        "  `card_number` VARCHAR(12) DEFAULT NULL," +
        "  `users_id` INT NOT NULL AUTO_INCREMENT," +
        "  `login` VARCHAR(20) NOT NULL," +
        "  `password` VARCHAR(20) NOT NULL," +
        "  `role` VARCHAR(20) NOT NULL," +
        "  PRIMARY KEY (`users_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", (err,result)=>{
			if (err) throw err;
			if(result.warningCount === 0){
				console.log("Table 'users' is created");
				this.startInitTable(con1);
			}	
		});
	},

	startInitTable(con){
		let data = [
			"INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('Анна', 'Самусева', 'Сергеевна', 'АВ2824845', '27-12-1997', 'Майская, д.14 кв.90', '375297226164', '000000001', '1', 'anna', '1997anna', 'librarian');",
			"INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('Евгений', 'Козлов', 'Николаевич', 'СВ2556698', '28-10-1995', 'Кавалерийская д.15, кв.105', '375298566589, 80295695956', '000000002', '2', 'evg', '123', 'user');", 
			"INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('Дмитрий', 'Осин', 'Павлович', 'АВ2625269', '28-05-1996', 'ул.Елецкая, д.3, кв.18', '79033161480', '000000003', '3', 'dimon', '1', 'admin');"
		];
		for(let i=0; i<data.length; i++){
			con.query(data[i], function(err){
				if (err) throw err;
			});
		}
		console.log("Table users is initialized");
	},
    
	getAllData(){
		con.con.query("select * from users;", (err, result)=>{
			if(err) throw err;
			console.log(result);
		});
	},
    
	login(req, res){
		let user = {};
		user.login = req.body.user;
		user.password = req.body.pass;
		let query = `select * from users where login='${req.body.user}' and password='${req.body.pass}'`;
		con.con.query(query, (err, result)=>{
			if(err){
				res.status(500).send(err);
				console.log(err);
			}
			if(result.length == 1){
				user.role = result[0].role;
				user.users_id = result[0].users_id;
				req.session.user = user;
				res.send(user);
			}
			else
				res.send(null);
		});
	},

	loginStatus(req, res){
		res.send(req.session.user || null);
	},

	logout(req,res){
		delete req.session.user;
		res.send({});
	},
    
	authorization: function(req, res){
		let query = `select * from users where login='${req.body.login}'`;
		con.con.query(query, (err, result)=>{
			if(err){
				res.status(500).send(err);
				console.log(err);
			}
			if(result.length==0){
				query = `INSERT INTO library.users (login, password, role) VALUES ("${req.body.login}", "${req.body.password}", "${req.body.role}");`;
				con.con.query(query, (err)=>{
					if (err){
						res.status(500).send(err);
						console.log(err);
					}
					else
						res.json({});
				});
			}
			else res.json({"message":"Login has already been taken."});
		});		
	},

	// getAllUsers(req,res){
	// 	if(req.query.start){
	// 		let count = Number(req.query.count);
	// 		let skip = Number(req.query.start);
		
	// 		users.find({}).skip(skip).limit(count).exec(function(err,data){
	// 			if(err){
	// 				console.log(err);
	// 				res.status(500).send(err);
	// 			}
	// 			else{
	// 				res.json({
	// 					"data":data,
	// 					"pos":skip
	// 				});
	// 			}
	// 		});
	// 	}
	// 	else {
	// 		users.find({}, function(err, allData){
	// 			users.find({}).limit(15).exec(function(err,data){
	// 				if(err){
	// 					console.log(err);
	// 					res.status(500).send(err);
	// 				}
	// 				else{
	// 					res.json({
	// 						"data": data,
	// 						"pos": 0,
	// 						"total_count": allData.length
	// 					});
	// 				}
	// 			});
	// 		});
	// 	}
	// },

	// saveData(req,res){
	// 	users.findByIdAndUpdate(req.body._id, req.body, function(err, data){
	// 		if(err){
	// 			console.log(err);
	// 			res.status(500).send(err);
	// 		}
	// 		else{
	// 			res.json(data);
	// 		}
	// 	});
	// }
};
module.exports = usersData;