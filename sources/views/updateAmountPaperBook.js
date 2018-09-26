import {JetView} from "webix-jet";
import {books} from "models/books";

export default class updateAmountPaperBooksView extends JetView{

	config(){
		let datatable = {
			view:"datatable",
			select:true,
			localId:"datatable",
			editable:true,
			editaction:"dblclick",
			columns:[
				{id:"book_name", header:"Название книги", fillspace:2},
				{id:"author_surname", header:"Фамилия автора", fillspace:1},
				{id:"author_name", header:"Имя автора", fillspace:1},
				{id:"author_patronymic", header:"Отчество автора", fillspace:1},
				{id:"year", header:"Год выпуска", fillspace:1},
				{id:"amount_paper_book", header:"Количество бумажных экземпляров", fillspace:1, editor:"text"},
			]
		};

		return datatable;
	}
    
	init(){
		this.$$("datatable").parse(books);
	}
}