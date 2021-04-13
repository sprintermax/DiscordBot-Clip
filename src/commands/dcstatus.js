const discord = require('discord.js');
const https = require('https');

exports.run = async (client, message, args, database) => {
	message.delete();
	if((!message.member.roles.cache.some(role => role.id == "499227407123742721")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	const colors = client.dbdata.colors;
	https.get(`https://srhpyqt94yxb.statuspage.io/api/v2/status.json`, (res) => {
		res.on('data', (data) => {
			result = JSON.parse(data.toString());
			var embed = new discord.MessageEmbed()
				.setAuthor("Status dos Servidores do Discord")
				.setDescription(`Status: \`${result.status.description}\`\nAtualizado em: \`${result.page.updated_at}\`\n**[Acessar Site do Discord Status](${result.page.url})**`)
				.setColor(colors.padrao)
				.setFooter(`${message.guild.name}`);
			message.channel.send(`${message.author}`, embed).then(msg => msg.delete({ timeout: 15000 }));
		});
	}).on('error', (e) => {
		console.error(e);
	});
}