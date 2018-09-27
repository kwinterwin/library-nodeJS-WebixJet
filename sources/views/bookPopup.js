import {JetView} from "webix-jet";
import {books} from "models/books";

export default class BookPopupView extends JetView{

	setId(user_id){
		this.user_id = user_id;
	}

	getId(){
		return this.user_id;
	}

	config(){

		const popup = {
			view:"popup",
			localId:"popup",
			modal:true,
			height:400,
			width:800,
			position:"center",
			body:{
				rows:[
					{
						view:"datatable",
						select:true,
						localId:"datatable",
						columns:[
							{id:"book_name", header:"Название книги", fillspace:2},
							{id:"author_surname", header:"Фамилия автора", fillspace:1},
							{id:"author_name", header:"Имя автора", fillspace:1},
							{id:"author_patronymic", header:"Отчество автора", fillspace:1},
							{id:"year", header:"Год выпуска", fillspace:1},
							{id:"amount_paper_book", header:"Количество бумажных экземпляров", fillspace:1},
						]
					},
					{
						view:"button",
						value:"Выбрать",
						click:()=>{
							var myparse = webix.Date.dateToStr("%d-%m-%Y");
							let data = {};
							data.contact_id = this.getId();
							data.book_id = this.$$("datatable").getSelectedItem().book_id;
							data.order_date = myparse(new Date());
                            
							let book = this.$$("datatable").getSelectedItem();
							book.amount_paper_book = book.amount_paper_book-1;
							webix.ajax().post("/server/orders", data);
							books.updateItem(book.id, book);
							this.hideWindow();
						}
					},
					{
						view:"button",
						value:"Назад",
						click:()=>{
							this.hideWindow();
						}
					}
				]
			}
		};

		return popup;

	}

	showWindow(user_id){
		this.setId(user_id);
		this.$$("datatable").parse(books);
		this.$$("popup").show();
	}
    
	hideWindow(){
		this.$$("popup").hide();
	}
}