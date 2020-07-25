const discord = require('discord.js');
const FortniteAPI = require("fortnite-api-com");
const fs = require("fs");

exports.run = async (client, message, args, database) => {
	message.delete();
	if ((!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
	const userconfig = client.userconfig;
	const config = {
		apikey: userconfig.ftnconfig.fortnite_api_com_apikey,
		language: userconfig.ftnconfig.language
	}
	var Fortnite = new FortniteAPI(config);
	Fortnite.Shop()
		.then(res => {
			fs.access("src/temp/", function(error) {
				if (error) {
					fs.mkdir('src/temp/', { recursive: true }, (err) => { if (err) throw err; });
				}
			});
			fs.writeFile('src/temp/fortstoredata.json', JSON.stringify(res), 'utf8', (err) => {
				if (err) throw err;
				message.channel.send(`${message.author}\nAqui está, um arquivo .json com as informações da loja:`, new discord.Attachment("src/temp/fortstoredata.json")).then(() => {
					fs.unlink(`src/temp/fortstoredata.json`, function (err) {
						if (err) throw err;
					});
				});
			});
		}).catch(err => {
			console.log(err);
	});
}