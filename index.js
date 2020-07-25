const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const userconfig = require("./src/data/config.json");
const mongo = require('mongodb').MongoClient
const client = new Discord.Client();
client.commands = new Enmap();
client.userconfig = userconfig;

fs.readdir("./src/events/", (err, files) => {
	console.log('[INFO] Importação dos eventos iniciada!');
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./src/events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
		console.log(`-----> Evento "${eventName}" carregado com sucesso!`);
	});
	console.log('[INFO] Importação dos eventos finalizada!');
});

fs.readdir("./src/commands/", (err, files) => {
	console.log('[INFO] Importação dos comandos iniciada!');
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./src/commands/${file}`);
		let commandName = file.split(".")[0];
		client.commands.set(commandName, props);
		console.log(`-----> Comando "${commandName}" carregado com sucesso.`);
	});
	console.log('[INFO] Importação dos comandos finalizada!');
});

mongo.connect(userconfig.botsettings.database, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, (err, mongodb) => {
	db = mongodb.db("DiscordClip").collection("DataBase");
	if (err) return console.error(err);
	client.clipdb = db;
	db.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
		client.dbdata = items[0];
		client.login(userconfig.botsettings.token);
	});
});