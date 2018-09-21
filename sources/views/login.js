import {JetView} from "webix-jet";

export default class LoginView extends JetView{
	config(){


		const login_toolbar = {
			view:"toolbar",
			margin:-20,
			paddingX:70,
			css:"grayToolbar",
			cols:[
				{ view:"label", label:"Library", align:"left"},
				{ view:"button", label:"Login", width:100, align:"right", type:"icon", click:()=>{
					if(this.$$("loginForm").isVisible() === false){
						this.$$("loginForm").show();
						this.$$("registerForm").hide();
					}
				}},
				{ view:"button", label:"Register", width:100, align:"right", type:"icon", click:()=>{
					if(this.$$("registerForm").isVisible() === false){
						this.$$("loginForm").hide();
						this.$$("registerForm").show();
					}
				}}
			]
		};


		const login_form = {
			view:"form",
			localId:"loginForm",
			width:700, 
			css:"form",
			paddingX:90,
			elements:[
				{ view:"template", template:"Login", type:"header", borderless:true},
				{ view:"text", label:"Login", name:"login", labelWidth:150, invalidMessage:"Login can't be empty."},
				{ view:"text", label:"Password", type:"password", name:"password", labelWidth:150, invalidMessage:"Password can't be empty."},
				{
					cols:[
						{width:150},
						{ view:"button", value:"Login", click:() => this.do_login(), hotkey:"enter", localId:"loginBtn", inputWidth:100, width:120}
					]
				}
			],
			rules:{
				"login":webix.rules.isNotEmpty,
				"password":webix.rules.isNotEmpty
			}
		};

		

		const register_form = {
			view:"form",
			localId:"registerForm",
			width:600, 
			css:"form",
			paddingX:90,
			hidden:true,
			elements:[
				{ view:"template", template:"Register", type:"header", borderless:true, localId:"header"},
				{ view:"text", label:"Login", name:"login", labelWidth:150, invalidMessage:"Login can't be empty.", localId:"loginField"},
				{ view:"text", label:"Password", type:"password", name:"password", labelWidth:150, invalidMessage:"Password can't be empty."},
				{
					view:"radio", 
					label:"Who are you?", 
					labelWidth:150,
					name:"role",
					options:[
						{"id":"user", "value":"Reader"}, 
						{"id":"librarian", "value":"Librarian"}
					]
				},				
				{
					cols:[
						{width:150},
						{ view:"button", value:"Register", click:() => {this.authorization();}, hotkey:"enter", localId:"authorizBtn", inputWidth:100}
					]
				}
			],
			rules:{
				"login":webix.rules.isNotEmpty,
				"password":webix.rules.isNotEmpty
			}
		};

		return {
			rows:[
				login_toolbar,
				{height:40},
				{
					cols:[
						{},login_form,register_form,{}
					]
				}, {}
			]
		};
	}

	init(view){
		view.$view.querySelector("input").focus();
	}

	authorization(){
		let form = this.$$("registerForm");

		if (form.validate()){
			const data = form.getValues();
			webix.ajax().post("/server/login/authorization", data).then((result)=> {
				if(result.json().hasOwnProperty("message")){
					webix.message({type:"error", text:result.json().message});
				}
				else {
					webix.message({type:"debug", text:"Successful registration"});
					this.$$("registerForm").clear();
					this.$$("registerForm").hide();
					this.$$("loginForm").show();
				}
			});
		}			
	}

	do_login(){
		const user = this.app.getService("user");
		const form = this.$$("loginForm");
		if (form.validate()){
			const data = form.getValues();
			user.login(data.login, data.password);
		}
	}
}