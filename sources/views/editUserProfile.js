import {JetView} from "webix-jet";

export default class AddAndEditUserProfileView extends JetView{

	config(){
		const view = {
			rows:[
				{
					view:"form",
					localId:"userDataForm",
					borderless:true,
					elements:[
						{ view:"text", label:"Имя", name:"users_name", required:true, labelWidth:200, inputWidth:500},
						{ view:"text", label:"Фамилия", name:"users_surname", required:true, labelWidth:200, inputWidth:500 },
						{ view:"text", label:"Отчество", name:"users_patronymic", required:true, labelWidth:200, inputWidth:500 },
						{ view:"text", label:"Номер паспорта", name:"passport", labelWidth:200, inputWidth:500 },
						{
							view:"datepicker", 
							label: "Дата рождения", 
							labelWidth:200, inputWidth:500,
							name:"birthday"
						},
						{ view:"text", label:"Адрес проживания", name:"address", labelWidth:200, inputWidth:500 },
						{ view:"text", label:"Телефон", name:"phone", labelWidth:200, inputWidth:500},
						{
							rows:[
								{view:"text", label:"Логин", name:"login", labelWidth:200, inputWidth:500, required:true},
								{view:"text", label:"Пароль", name:"password", labelWidth:200, inputWidth:500, required:true},
								{
									view:"richselect",
									label:"Роль пользователя", 
									name:"role",
									options:[ 
										{ "id":"user", "value":"User"}, 
										{ "id":"librarian", "value":"Librarian"}, 
										{ "id":"admin", "value":"Admin"}
									], labelWidth:200, inputWidth:500, required:true
								}
							],
							localId:"addUserLayout",
							hidden:true
						},
						{ view:"button", value:"Сохранить", type:"form", inputWidth:200, click:()=>{
							const user = this.app.getService("user");
							let dataUser = user.getUser();
							var myparse = webix.Date.strToDate("%d-%m-%Y");
							let data = this.$$("userDataForm").getValues();
							data.birthday = myparse(data.birthday);
							if(dataUser.role === "user"){
								if(this.$$("userDataForm").validate()){
									webix.ajax().put("/server/users", data);
								}
							}
							else{
								webix.ajax().post("/server/users", data);
							}
							
						} 
						}
					]},
				{}
			]
							
		};        

		return view;
	}
    
	init(){
		const user = this.app.getService("user");
		let dataUser = user.getUser();
		if(dataUser.role === "user"){
			webix.ajax().get("/server/users/", {login:dataUser.login}, (result)=>{
				var myparse = webix.Date.strToDate("%d-%m-%Y");
				JSON.parse(result)[0].birthday = myparse(JSON.parse(result)[0].birthday);
				this.$$("userDataForm").setValues(JSON.parse(result)[0]);
			});
		}
		else{
			this.$$("addUserLayout").show();
		}
		
	}
}