import {JetView} from "webix-jet";

export default class BookTemplateView extends JetView{

	setClass(cl){
		this.cl = cl;
	}

	getClass(){
		return this.cl;    }
	config(){

		const template = {
			template:(obj)=>{
				if(obj.hasOwnProperty("book_name")){
					return `
				            <div class='flex'>
				                <div><img style='width:30%; display:block; margin:2% auto;' src='/server/${obj.picture}'/></div>
				                <div class='information'>
				                    <div><span>Название книги: ${obj.book_name}</span></div>
				                    <div><span>Автор: ${obj.author_surname} ${obj.author_name} ${obj.author_patronymic}</span></div>
				                    <div><span>Год: ${obj.year}</span></div>
				                    <div><span>Количество страниц: ${obj.page_amount}</span></div>
				                    <div><span class="fa fa-heart-o like" style='cursor:pointer; font-size:50px; display:inline-block;'></span></div>
				                </div>
				            </div>
                            `;
				}
                
			},
			localId:"template",
			onClick:{
				like:()=>{
					let id = this.getUrl()[0].params.id;
					const user = this.app.getService("user");
					let dataUser = user.getUser();

					webix.ajax().get("/server/likes", {book_id:id, users_id:dataUser.users_id}, (result)=>{
                        
						if(JSON.parse(result)[0].count != 0){
							webix.message({type:"error", text:"Вы уже оценивали книгу"});
						}
						else{
							webix.ajax().post("/server/likes", {book_id:id, users_id:dataUser.users_id});
							webix.message({type:"error", text:"Оценка принята"});
						} 
					});					
				}
			}
		};
        
        
        
		const comments = {
			view:"form",
			localId:"form",
			elements:[
				{ 
					view:"textarea", 
					localId:"commArea",
					label:"Ваш комменарий к книге", 
					labelPosition:"top", 
					inputWidth:300,
					height:100 
				},
				{
					view:"button",
					value:"Отправить",
					inputWidth:300,
					click:()=>{
						let id = this.getUrl()[0].params.id;
						const user = this.app.getService("user");
						let dataUser = user.getUser();
						let comment = this.$$("commArea").getValue();
						webix.ajax().post("/server/comments", {book_id:id, users_id:dataUser.users_id, comment: comment});
						webix.ajax().get("/server/comments", {book_id:id}, (result)=>{
							this.$$("tree").parse(result);
						});
					}
				}
			]
		};
        
		const answer = {
			view:"form",
			localId:"answerForm",
			hidden:true,
			elements:[
				{ 
					view:"textarea", 
					label:"Ответ", 
					labelPosition:"top", 
					localId:"answerArea",
					inputWidth:300,
					height:100 
				},
				{
					view:"button",
					value:"Отправить",
					inputWidth:300,
					click:()=>{
						let data = this.$$("tree").getSelectedItem();
						let id = this.getUrl()[0].params.id;
						const user = this.app.getService("user");
						let dataUser = user.getUser();
						let comment = this.$$("answerArea").getValue();
						webix.ajax().post("/server/comments", {book_id:id, users_id:dataUser.users_id, comment: comment, id_answer:data.id});
					}
				},
				{
					view:"button",
					value:"Отмена",
					inputWidth:300,
					click:()=>{
						this.$$("answerForm").hide();
						this.$$("form").show();
					}
				}
			]
		};
        
		let commTemplate = { 
			view: "tree",
			localId:"tree",
			template:"<span><b>#login#:</b></span> <span>#value#</span>",
			select:true,
			on:{
				onAfterSelect:()=>{
					this.$$("answerForm").show();
					this.$$("form").hide();
					return false;
				}
			}
		};
        
		return {
			rows:[
				template,
				{
					cols:[
						commTemplate,
						{
							rows:[
								comments,
								answer
							]
						}
					],
					height:400
				}
			]
		};

	}
    

	init(){
		let id = this.getParam("id");
		webix.ajax().get("/server/books", {book_id:id}, (result)=>{
			this.$$("template").parse(result);
		});
		webix.ajax().get("/server/comments", {book_id:id}, (result)=>{
			this.$$("tree").parse(result);
		});
	}


}