import {JetView} from "webix-jet";
import {users} from "models/users";
import BookPopupView from "./bookPopup";

export default class UsersProfileView extends JetView{
	config(){

		const usersList = {
			view:"list",
			width:300,
			select:true,
			localId:"list",
			template:(obj)=>{ 
				if( obj.users_surname != null || obj.users_name != null || obj.users_patronymic != null)
					return `${obj.users_surname} ${obj.users_name} ${obj.users_patronymic}`;
				else 
					return "Неизвестный читатель";
			},
			on:{
				onAfterSelect:()=>{
					let data = this.$$("list").getSelectedItem();
					this.$$("hidInfo").show();
					let str = "";
					this.$$("infoTemplate").parse(data);
					if( data.users_surname != null || data.users_name != null || data.users_patronymic != null)
						str =  `${data.users_surname} ${data.users_name} ${data.users_patronymic}`;
					else 
						str =  "Неизвестный читатель";
					
					this.$$("label").setValue(str);

					webix.ajax().get("/server/orders", {contact_id: data.users_id}, (result)=>{
						this.$$("datatable").parse(result);
					});
				}
			}
		};

		const information = {
			rows:[
				{
					view:"toolbar",
					cols:[
						{ view:"label", localId:"label", label:""},
						{ view:"button", value:"Записать книгу", align:"right", click:()=>{
							this._jetPopup.showWindow(this.$$("list").getSelectedItem().users_id);
						}}
					]
				},
				{template:(obj)=>{
					return `<div>Паспортные данные: ${obj.passport}</div><div>Дата рождения: ${obj.birthday}</div><div>Адрес регистрации: ${obj.address}</div>` + 
					`<div>Телефоны: ${obj.phone}</div><div>Карточка читателя №: ${obj.card_number}</div>`;
				}, localId:"infoTemplate"}
			],
			
		};

		const datatable = {
			view:"datatable",
			select:true,
			localId:"datatable",
			columns:[
				{id:"book_name", header:"Название книги", fillspace:2},
				{id:"author_surname", header:"Фамилия автора", fillspace:1},
				{id:"author_name", header:"Имя автора", fillspace:1},
				{id:"author_patronymic", header:"Отчество автора", fillspace:1},
				{id:"year", header:"Год выпуска", fillspace:1},
				{id:"order_date", header:"Дата записи", fillspace:1},
				{template:"<i class='fa fa-times delete' style='cursor:pointer;'></i>", fillspace:0.3}
			],
			onClick:{
				delete:(e, id)=>{
					webix.confirm({
						text:"Книга возвращена читателем?",
						title:"Внимание!",
						ok:"Да",
						cancel: "Нет",
						callback:(result)=>{
							if(result){
								let data = this.$$("list").getSelectedItem();
								let orderId = this.$$("datatable").getItem(id.row).order_id;
								webix.ajax().del("/server/orders", {id:orderId});
								this.$$("datatable").clearAll();
								webix.ajax().get("/server/orders", {contact_id: data.users_id}, (result)=>{
									this.$$("datatable").parse(result);
								});
							}
						}
					});
					return false;
				}
			}
		};

		return {
			cols:[
				usersList,
				{rows:[
					information,
					datatable
				],hidden:true,
				localId:"hidInfo"}
				
			]
		};
	}

	init(){
		this.$$("list").parse(users);
		this._jetPopup = this.ui(BookPopupView);
		
	}
}