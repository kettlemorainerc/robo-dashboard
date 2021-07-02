const nodemon = require("nodemon");
let restarting = false;
nodemon({
	exec: "npm run --prefix client start",
	watch: [
		"client/native/*.js"
	]	
}).on("exit", () => {
	if(!restarting) process.exit(0);
	restarting = false;
}).on("restart", () => {
	restarting = true;
});