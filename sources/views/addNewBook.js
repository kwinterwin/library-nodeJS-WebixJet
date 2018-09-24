import {JetView} from "webix-jet";
import {genres} from "models/genres";

export default class NewBookView extends JetView{
	config(){
		const form = {
			view:"form",
			localId:"form",
			elements:[
				{view:"text", label:"Название книги:", labelWidth:300, name:"book_name"},
				{view:"text", label:"Фамилия автора:", labelWidth:300, name:"author_surname"},
				{view:"text", label:"Имя автора:", labelWidth:300, name:"author_name"},
				{view:"text", label:"Отчество автора:", labelWidth:300, name:"author_patronymic"},
				{view:"text", label:"Издательство:", labelWidth:300, name:"publisher"},
				{view:"text", label:"Страна издания:", labelWidth:300, name:"publish_country"},
				{view:"text", label:"Год издания:", labelWidth:300, name:"year"},
				{view:"text", label:"Количество страниц:", labelWidth:300, name:"page_amount"},
				{view:"multiselect", label:"Жанры", labelWidth:300, options: genres, name:"genres"},
				{view:"text", label:"Количество бумажных экземпляров:", labelWidth:300, name:"amount_paper_book"},
				{
					view:"uploader",
					localId: "pictureUploader",
					inputWidth:300,
					select:true,
					accept:"image/jpeg, image/png",
					autosend:false,
					multiple:false,
					upload:"/server/books",
					value:"Загрузить картинку книги",
					on:{
						onAfterFileAdd:()=>{
							webix.message({"type":"debug", "text":"File is upload"});
						}
					}
				},
				{
					view:"uploader",
					localId: "filesUploader",
					inputWidth:300,
					select:true,
					accept:"text/plain, application/pdf",
					autosend:false,
					multiple:true,
					upload:"/server/books",
					value:"Добавить электронные версии книги",
					on:{
						onAfterFileAdd:()=>{
							webix.message({"type":"debug", "text":"File is upload"});
						}
					}
				},
				{
					view:"uploader",
					localId: "audioUploader",
					inputWidth:300,
					select:true,
					autosend:false,
					multiple:false,
					upload:"/server/books",
					value:"Загрузить аудиоверсию книги",
					on:{
						onAfterFileAdd:()=>{
							webix.message({"type":"debug", "text":"File is upload"});
						}
					}
				},
				{view:"button", value:"Add new book", inputWidth:300, type:"form", click:()=>{
					let data = this.$$("form").getValues();

					webix.ajax().post("/server/books", data, (result)=>{
						this.$$("pictureUploader").files.data.each((file)=>{
							file.formData = {"id": result, "field":"picture"};
							this.$$("pictureUploader").send();
						});
						let length = this.$$("filesUploader").files.data.order.length;
						let index = 1;
						let data = "";
						this.$$("filesUploader").files.data.each((file)=>{
							if(length != index){
								data += file.name + ", ";
								file.formData = {"id": result, field:"files", filesData:""};
							}
							else {
								data += file.name + ", ";
								file.formData = {"id": result, field:"files", filesData:data};
							}
							index++;
						});
						this.$$("filesUploader").send();

						length = this.$$("audioUploader").files.data.order.length;
						index = 1;
						data = "";
						this.$$("audioUploader").files.data.each((file)=>{
							if(length != index){
								data += file.name + ", ";
								file.formData = {"id": result, field:"audio", filesData:""};
							}
							else {
								data += file.name + ", ";
								file.formData = {"id": result, field:"audio", filesData:data};
							}
							index++;
						});
						this.$$("audioUploader").send();
					});


				}}
			]
		};
        
		return form;
	}
}