import {JetView} from "webix-jet";
import {books} from "models/books";
import {orders} from "models/orders";

export default class BookReportView extends JetView{

	config(){

		const datatable = {
			view:"datatable",
			select:true,
			localId:"datatable",
			columns:[
				{id:"book_name", header:["Название книги", {content:"textFilter"}], fillspace:2},
				{id:"author_surname", header:["Фамилия автора", {content:"textFilter"}], fillspace:1},
				{id:"author_name", header:["Имя автора", {content:"textFilter"}], fillspace:1},
				{id:"author_patronymic", header:["Отчество автора", {content:"textFilter"}], fillspace:1},
				{id:"year", header:"Год выпуска", fillspace:1},
				{id:"amount_paper_book", header:"Количество бумажных экземпляров", fillspace:1},
				{id:"add", header:"", template:"<i class='fa fa-plus add' style='cursor:pointer;'></i>"}
			],
			onClick:{
				add:(e, id)=>{
					var myparse = webix.Date.dateToStr("%d-%m-%Y");
					const user = this.app.getService("user");
					let dataUser = user.getUser();
					let data = {};
					data.contact_id = dataUser.users_id;
					data.book_id = this.$$("datatable").getItem(id.row).book_id;
					data.order_date = myparse(new Date());
					let book = this.$$("datatable").getItem(id.row);
					book.amount_paper_book = book.amount_paper_book-1;
					books.updateItem(book.id, book);

					webix.message({type:"info", text:"Книга взята"});
					data.book_name = this.$$("datatable").getItem(id.row).book_name;
					orders.add(data);
					this.$$("datatableOrder").parse(orders);
					return false;
				}
			},
			on:{
				onAfterSelect:()=>{
					let id = this.$$("datatable").getSelectedItem().book_id;
					this.show(`/start/bookTemplate?id=${id}`);
				}
			}
		};

		const datatableOrder = {
			view:"datatable",
			select:true,
			localId:"datatableOrder",
			columns:[
				{id:"book_name", header:"Взятые книги", fillspace:2},
				{template:"<i class='fa fa-times delete' style='cursor:pointer;'></i>", fillspace:0.3}
			],
			onClick:{
				delete:(e, id)=>{
					let orderId = this.$$("datatableOrder").getItem(id.row).id;
					orders.remove(orderId);
			
					return false;
				}
			}
		};
        
		return {
			rows:[
				datatable,
				datatableOrder,
				{
					view:"button",
					value:"Оформить заказ",
					click:()=>{
						orders.data.each((obj)=>{
							webix.ajax().post("/server/orders", obj);
						});	
						webix.message({text:"Заказ оформлен", type:"debug"});
					}
				}
			]
		};

	}

	init(){
		this.$$("datatable").parse(books);
	}
}