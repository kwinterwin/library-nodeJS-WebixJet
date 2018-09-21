import "./styles/app.css";
import {JetApp, plugins} from "webix-jet";
import session from "models/session";

webix.ready(() => {

	var app = new JetApp({
		id:			APPNAME,
		version:	VERSION,
		//router:        UrlRouter,
		start:		"/start",
		debug:      true
	});
	
	app.use(plugins.User, { model : session });
	app.render();
});
