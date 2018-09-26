import {JetView} from "webix-jet";

export default class TenBooksView extends JetView{

	config(){

		const list = {
			view:"list",
			template:"#title#",
			width:300,
			select:true,
			localId:"list",
			data:[
				{ id:"old", title:"10 самых старых книг"},
				{ id:"new", title:"10 самых новых книг"},
				{ id:"long", title:"10 самых длинных книг"},
				{ id:"nameLong", title:"10 книг с самым длинным названием"},
				{ id:"author", title:"10 авторов с наиб.кол-вом книг в БД"},
				{ id:"spanish", title:"Книги Испании 1980-2000 гг."},
				{ id:"files", title:"Книги без эл. варианта, но с аудио"}
			],
			on:{
				onAfterSelect:()=>{
					let filter = this.$$("list").getSelectedId();
					this.$$("datatable").clearAll();
					this.$$("authorDatatable").clearAll();
					if (filter === "author"){
						webix.ajax().get("/server/books", {filter:filter}, (result)=>{
							if(this.$$("authorDatatable").isVisible() === false)
								this.$$("authorDatatable").show();
							if(this.$$("datatable").isVisible())
								this.$$("datatable").hide();
							this.$$("authorDatatable").parse(result);
						});
					}
					else {
						webix.ajax().get("/server/books", {filter:filter}, (result)=>{
							if(this.$$("authorDatatable").isVisible())
								this.$$("authorDatatable").hide();
							if(this.$$("datatable").isVisible() === false)
								this.$$("datatable").show();
							this.$$("datatable").parse(result);
						});
					}
				}
			}
		};
        
		const datatable = {
			view:"datatable",
			select:true,
			localId:"datatable",
			hidden:true,
			columns:[
				{id:"book_name", header:["Название книги", {content:"textFilter"}], fillspace:2},
				{id:"author_surname", header:["Фамилия автора", {content:"textFilter"}], fillspace:1},
				{id:"author_name", header:["Имя автора", {content:"textFilter"}], fillspace:1},
				{id:"author_patronymic", header:["Отчество автора", {content:"textFilter"}], fillspace:1},
				{id:"year", header:"Год выпуска", fillspace:0.5},
				{id:"publisher", header:"Издатель", fillspace:0.6},
				{id:"publish_country", header:"Страна издания", fillspace:1},
				{id:"page_amount", header:"Стр.", fillspace:0.3}
			]
		};
        
		const authorDatatable = {
			view:"datatable",
			select:true,
			localId:"authorDatatable",
			hidden:true,
			columns:[
				{id:"author_surname", header:["Фамилия автора", {content:"textFilter"}], fillspace:1},
				{id:"author_name", header:["Имя автора", {content:"textFilter"}], fillspace:1},
				{id:"author_patronymic", header:["Отчество автора", {content:"textFilter"}], fillspace:1}
			]
		};
        
		return {
			cols:[
				list,
				datatable,
				authorDatatable
			]
		};
	}

}