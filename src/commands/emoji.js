const discord = require('discord.js');

module.exports.run = async (client, message, args, database) => {
	message.delete();
	if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
	const colors = client.dbdata.colors;
	if (args[0]) {
		if (args[0].match(/(?<=<a?:.*:)\d*(?=>)/)) {
			emojiid = args[0].match(/(?<=<a?:.*:)\d*(?=>)/);
			emoji = message.guild.emojis.get(emojiid[0]) || client.emojis.get(emojiid[0]);
		} else {
			emoji = message.guild.emojis.get(args[0]) || client.emojis.get(args[0]) || client.emojis.find(emoji => emoji.name == args[0]);
		}
		if (emoji) {
			if (emoji.animated) {
				var embed = new discord.RichEmbed()
					.setAuthor("Informações do Emoji")
					.setDescription(`Nome: **${emoji.name}**\nID: **${emoji.id}**\nTags: **Animado**, [Download](https://cdn.discordapp.com/emojis/${emoji.id}.gif)`)
					.setThumbnail(`https://cdn.discordapp.com/emojis/${emoji.id}.gif`)
					.setColor(colors.padrao)
					.setFooter(`${message.guild.name}`);
				message.channel.send(embed).then(msg => msg.delete(30000));
			} else {
				var embed = new discord.RichEmbed()
					.setAuthor("Informações do Emoji")
					.setDescription(`Nome: **${emoji.name}**\nID: **${emoji.id}**\nTags: [Download](https://cdn.discordapp.com/emojis/${emoji.id}.png)`)
					.setThumbnail(`https://cdn.discordapp.com/emojis/${emoji.id}.png`)
					.setColor(colors.padrao)
					.setFooter(`${message.guild.name}`);
				message.channel.send(embed).then(msg => msg.delete(30000));
			}
		} else {
			message.channel.send(`${message.author}\nNão encontrei o emoji, verifique se você especificou um emoji válido!\n(Emojis padrões do Discord ou de outros servidores que eu não estou não são válidos)`).then(msg => msg.delete(10000));
		}
	} else {
		message.channel.send(`${message.author}\nVocê precisa especificar o emoji!`).then(msg => msg.delete(10000));
	}
}