const fs = require("fs");

exports.run = async (client, message, args, database) => {
	message.delete();
	if(!client.whitelisted) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	fs.readdir("src/commands/", (err, files) => {
		if (err) return console.error(err);
		var comandos = "";
		files.forEach(file => {
			if (file.toLowerCase().includes("temp_")) return;
			comandos += `> \`${file.split(".js")[0]}\`\n`
		});
		message.channel.send(`Lista de Comandos:\n${comandos}`);
	});
}