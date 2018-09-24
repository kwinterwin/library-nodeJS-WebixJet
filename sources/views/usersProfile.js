import {JetView} from "webix-jet";
import {users} from "models/users";

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
				}
			}
		};

		const information = {
			rows:[
				{
					view:"toolbar",
					cols:[
						{ view:"label", localId:"label", label:""}
					]
				},
				{template:(obj)=>{
					return `<div>Паспортные данные: ${obj.passport}</div><div>Дата рождения: ${obj.birthday}</div><div>Адрес регистрации: ${obj.address}</div>` + 
					`<div>Телефоны: ${obj.phone}</div><div>Карточка читателя №: ${obj.card_number}</div>`;
				}, localId:"infoTemplate"}
			],
			hidden:true,
			localId:"hidInfo"
		};

		return {
			cols:[
				usersList,
				information
			]
		};
	}

	init(){
		this.$$("list").parse(users);
	}
}