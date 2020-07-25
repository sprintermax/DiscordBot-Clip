const discord = require('discord.js');
const https = require('https');

exports.run = async (client, message, args, database) => {
	message.delete();
	if(!message.member.hasPermission("MANAGE_MESSAGES") && !client.whitelisted) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
	const colors = client.dbdata.colors;
	https.get(`https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status?serviceId=Fortnite`, (res) => {
		res.on('data', (data) => {
			result = JSON.parse(data.toString());
			var status;
			if (result[0].status == "DOWN") {
				status = "Offline";
			} else if (result[0].status == "UP") {
				status = "Online";
			} else {
				status = result[0].status;
			}
			var embed = new discord.RichEmbed()
				.setAuthor("Status dos Servidores do Fortnite")
				.setDescription(`Status: \`${status}\`\n**[Acessar Site Epic Games Status](https://status.epicgames.com/)**`)
				.setColor(colors.padrao)
				.setFooter(`${message.guild.name}`);
			message.channel.send(`${message.author}`, embed).then(msg => msg.delete(15000));
		});
	}).on('error', (e) => {
		console.error(e);
	});
}