import {JetView} from "webix-jet";
import {users} from "models/users";
// import AddAndEditUserProfileView from "./editUserProfile";

export default class EditProfileView extends JetView{
	config(){
		const datatable = {
			view:"datatable",
			localId:"datatable",
			select:true,
			columns:[
				{id:"users_name", header:"Имя читателя", fillspace:2},
				{id:"users_patronymic", header:"Отчество читателя", fillspace:2},
				{id:"users_surname", header:"Фамилия читателя", fillspace:2},
				{id:"passport", header:"Паспортные данные читателя", fillspace:2},
				{id:"birthday", header:"Дата рождения читателя", fillspace:2}
			]
		};

		const form = {
			view:"form",
			localId:"userDataForm",
			borderless:true,
			elements:[
				{ view:"text", label:"Имя", name:"users_name", labelWidth:200, inputWidth:500},
				{ view:"text", label:"Фамилия", name:"users_surname", labelWidth:200, inputWidth:500 },
				{ view:"text", label:"Отчество", name:"users_patronymic", labelWidth:200, inputWidth:500 },
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
						{view:"text", label:"Логин", name:"login", labelWidth:200, inputWidth:500},
						{view:"text", label:"Пароль", name:"password", labelWidth:200, inputWidth:500},
						{
							view:"richselect",
							label:"Роль пользователя", 
							name:"role",
							options:[ 
								{ "id":"user", "value":"User"}, 
								{ "id":"librarian", "value":"Librarian"}, 
								{ "id":"admin", "value":"Admin"}
							], labelWidth:200, inputWidth:500
						}
					]
				},
				{ view:"button", value:"Сохранить", type:"form", inputWidth:200, click:()=>{
					var myparse = webix.Date.dateToStr("%d-%m-%Y");
					let data = this.$$("userDataForm").getValues();
					data.birthday = myparse(data.birthday);
					if(this.$$("userDataForm").validate()){
						webix.ajax().put("/server/users", data);
						this.$$("userDataForm").save();
					}
					else return false;
				} 
				}
			]
		};
        
		return {
			rows:[
				datatable,
				form
			]
		};
	}

	init(){
		webix.ajax().get("/server/users", {all:"all"}, (result)=>{
			this.$$("datatable").parse(result);
		});
		
		this.$$("userDataForm").bind(this.$$("datatable"));
	}
}