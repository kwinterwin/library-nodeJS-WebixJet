import {JetView} from "webix-jet";
import {books} from "models/books";

export default class DeleteBookView extends JetView{

	config(){

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
				{id:"publish_country", header:"Страна публикации", fillspace:1},
				{id:"amount_paper_book", header:"Количество бумажных экземпляров", fillspace:1},
				{template:"<i class='fa fa-trash delete' style='cursor:pointer;'></i>", fillspace:0.5}
			],
			onClick:{
				delete:(e, id)=>{
					webix.confirm({
						text:"Книга будет удалена. Продолжить?",
						title:"Внимание!",
						ok:"Да",
						cancel: "Назад",
						callback:(result)=>{
							if(result){
								books.remove(this.$$("datatable").getItem(id.row).id);
							}
						}
					});
					return false;
				}
			}
		};
        
		return datatable;
	}

	init(){
		this.$$("datatable").parse(books);
	}
}