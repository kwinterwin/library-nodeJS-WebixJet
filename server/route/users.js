
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
        "  `card_number` INT(11) DEFAULT NULL," +
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
			"INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('Анна', 'Самусева', 'Сергеевна', 'АВ2824845', '1997-12-27', 'Майская, д.14 кв.90', '375297226164', '000000001', '1', 'anna', '1997anna', 'librarian');",
			"INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('Евгений', 'Козлов', 'Николаевич', 'СВ2556698', '1995-10-28', 'Кавалерийская д.15, кв.105', '375298566589, 80295695956', '000000002', '2', 'evg', '123', 'user');", 
			"INSERT INTO `library`.`users` (`users_name`, `users_surname`, `users_patronymic`, `passport`, `birthday`, `address`, `phone`, `card_number`, `users_id`, `login`, `password`, `role`) VALUES ('Дмитрий', 'Осин', 'Павлович', 'АВ2625269', '1996-05-28', 'ул.Елецкая, д.3, кв.18', '79033161480', '000000003', '3', 'dimon', '1', 'admin');"
		];
		for(let i=0; i<data.length; i++){
			con.query(data[i], function(err){
				if (err) throw err;
			});
		}
		console.log("Table users is initialized");
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
		let query = "SELECT card_number FROM users ORDER BY users_id DESC LIMIT 1";
		con.con.query(query, (err, result)=>{
			let card_number = result[0].card_number+1;
			query = `select * from users where login='${req.body.login}'`;
			con.con.query(query, (err, result)=>{
				if(err){
					res.status(500).send(err);
					console.log(err);
				}
				if(result.length==0){
					query = `INSERT INTO library.users (login, password, role, card_number) VALUES ("${req.body.login}", "${req.body.password}", "${req.body.role}", '${card_number}');`;
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
		});
		
	},

	getAllUsers(req,res){
		if (req.query.hasOwnProperty("login")){
			let query = `select * from users where login='${req.query.login}';`;
			con.con.query(query, (err, result)=>{
				if(err){
					res.status(500).send(err);
					console.log(err);
				}
				else{
					res.send(result);
				}
			});
		}
		else if(req.query.hasOwnProperty("all")){
			let query = `select * from users;`;
			con.con.query(query, (err, result)=>{
				if(err){
					res.status(500).send(err);
					console.log(err);
				}
				else{
					res.send(result);
				}
			});
		}
		else {
			let query = "select * from users where role='user';";
			con.con.query(query, (err, result)=>{
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

	editData(req,res){
		let query = `update library.users set users_name="${req.body.users_name}", users_surname='${req.body.users_surname}', users_patronymic='${req.body.users_patronymic}', passport='${req.body.passport}', address='${req.body.address}', birthday='${req.body.birthday}',phone='${req.body.phone}' where users_id=${req.body.users_id}`;
		con.con.query(query, (err, result)=>{
			if(err){
				res.status(500).send(err);
				console.log(err);
			}
			else{
				res.json(result);
			}
		});
	},

	addData(req,res){
		let query = "SELECT card_number FROM users ORDER BY users_id DESC LIMIT 1";
		con.con.query(query, (err, result)=>{
			let card_number = result[0].card_number+1;
			query = `INSERT INTO library.users (users_name, users_surname, users_patronymic, passport, birthday, address, phone, login, password, role, card_number) VALUES ('${req.body.users_name}', '${req.body.users_surname}', '${req.body.users_patronymic}', '${req.body.passport}', '${req.body.birthday}', '${req.body.address}', '${req.body.phone}', '${req.body.login}', '${req.body.password}', '${req.body.role}', ${card_number});`;
			con.con.query(query,(err,result)=>{
				if(err){
					res.status(500).send(err);
					console.log(err);
				}
				else{
					res.json(result);
				}
			});
		});
	}

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