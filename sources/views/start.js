import {JetView, plugins} from "webix-jet";

export default class Start extends JetView{
	config(){

		const toolbar =  { 
			view: "toolbar",
			paddingX:40,
			elements: [
				{ view:"label", label:"Library", align:"left"},
				{ view:"label", label:"", align:"center", localId:"nameLabel"},
				{ view:"button", label:"Logout", width:100, align:"right", type:"icon", click:()=>{
					this.show("/logout");
				}}
			]
		};


		let admin_sidebar = {
			view: "sidebar",
			localId:"adminSidebar",
			width:300,
			hidden:true,
			data: [
				{id: "addUser", value: "Добавить пользователя"},
				{id: "editProfile", value:"Редактирование профиля пользователей"},
				{id: "appointLibrarian", value:"Назначить библиотекаря"},
				{id: "changeRole", value:"Изменить роли пользователям"}	
			]
		};

		let librarian_sidebar = {
			view: "sidebar",
			hidden:true,
			localId:"librarianSidebar",
			data: [
				{id: "updateAmountPaperBook", value: "Обновить наличие книг"},
				{id: "usersProfile", value:"Профили пользователей"},
				{id: "bookOperation", value:"Операции с книгами"},
				{id: "addNewBook", value:"Добавить новую книгу"},
				{id: "deleteBook", value:"Удалить книгу"}		
			]
		};

		let user_sidebar = {
			view: "sidebar",
			hidden:true,
			localId:"userSidebar",
			data: [
				{id: "addUser", value: "Добавить пользователя"},
				// {id: "editProfile", value:"Редактирование профиля пользователей"},
				// {id: "appointLibrarian", value:"Назначить библиотекаря"},
				// {id: "changeRole", value:"Изменить роли пользователям"}	
			]
		};
		
		return {
			rows:[
				toolbar,
				{
					cols:[
						{ 
							rows:[
								admin_sidebar, user_sidebar, librarian_sidebar,
								{height:1}]
						},
						{$subview:true}
					]
				}
			]
		};

	}
	
	init(){

		this.use(plugins.Menu, "adminSidebar");
		this.use(plugins.Menu, "librarianSidebar");
		this.use(plugins.Menu, "userSidebar");
		const user = this.app.getService("user");
		let dataUser = user.getUser();
		// console.log(dataUser);
		// this.$$("nameLabel").setValue(`Hi, ${dataUser.name}`);
		if(dataUser.role === "user"){
			this.$$("userSidebar").show();
		}
		else if(dataUser.role === "admin"){
			this.$$("adminSidebar").show();
		}
		else {
			this.$$("librarianSidebar").show();
		}
	}

}