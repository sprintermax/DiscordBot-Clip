const discord = require('discord.js');

exports.run = async (client, message, args, database) => {
	message.delete();
	const colors = client.dbdata.colors;
	if (!client.clipadmin) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	var whitelist = [];
	if (args.length < 1) {
		message.channel.send(`${message.author} Você precisa especificar uma ação!\n \`${client.userconfig.botsettings.prefix}whitelist <add|rem|list> <usuário>\``).then(msg => msg.delete({ timeout: 7500 }));
	} else if (args[0] == "list") {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			whitelist = items[0].whitelist;
			var whitelisteds = `<@${whitelist.join(">, <@")}>`;
			if (whitelisteds == "<@>") {
				message.channel.send(`${message.author} A lista branca está vazia!`).then(msg => msg.delete({ timeout: 10000 }));
			} else {
				var embed = new discord.MessageEmbed()
					.setAuthor("Whitelist Atual:")
					.setDescription(`${whitelisteds}`)
					.setColor(colors.padrao)
					.setFooter(`${message.guild.name}`);
				message.channel.send(`${message.author} Aqui está, todos os usuários na lista branca:`, embed).then(msg => msg.delete({ timeout: 45000 }));
			}
		});
	} else if (args[0] == "add") {
		if (args.length < 2) {
			message.channel.send(`${message.author} Você precisa especificar o usuário que devo adicionar!`).then(msg => msg.delete({ timeout: 7500 }));
		} else {
			var user;
			if (args[1].startsWith('<@') && args[1].endsWith('>')) {
				user = message.mentions.users.first();
			} else {
				user = client.users.cache.get(args[1]);
			}
			if (!user) {
				message.channel.send(`${message.author}\n"${args[1]}" é inválido. Você precisa mencionar algum usuário desse Servidor`).then(msg => msg.delete({ timeout: 75000 }));
			} else {
				database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
					whitelist = items[0].whitelist;
					if (whitelist.indexOf(user.id) > -1) {
						message.channel.send(`${message.author} Oops! \`${user.id}\` já está na lista branca!`).then(msg => msg.delete({ timeout: 7500 }));
					} else {
						whitelist.push(user.id);
						database.updateOne({"DBNameID":"ClipDB"}, {'$set': {whitelist: whitelist}}, (err, item) => {
							if (err) console.error(err)
							message.channel.send(`${message.author} Pronto! Adicionei "\`${user.id}\`" à lista branca!`).then(msg => msg.delete({ timeout: 10000 }));
						});
					}
				});
			}
		}
	} else if (args[0] == "rem") {
		if (args.length < 2) {
			message.channel.send(`${message.author} Você precisa especificar o usuário que devo remover!`).then(msg => msg.delete({ timeout: 7500 }));
		} else {
			var user;
			if (args[1].startsWith('<@') && args[1].endsWith('>')) {
				user = message.mentions.users.first();
			} else {
				user = client.users.cache.get(args[1]);
			}
			if (!user) {
				message.channel.send(`${message.author}\n"${args[1]}" é inválido. Você precisa mencionar algum usuário desse Servidor`).then(msg => msg.delete({ timeout: 7500 }));
			} else {
				database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
					whitelist = items[0].whitelist;
					if (whitelist.indexOf(user.id) > -1) {
						whitelist = items[0].whitelist.filter(i => i !== user.id);
						database.updateOne({"DBNameID":"ClipDB"}, {'$set': {whitelist: whitelist}}, (err, item) => {
							if (err) console.error(err);
							message.channel.send(`${message.author} Pronto! Removi \`${user.id}\` da lista branca!`).then(msg => msg.delete({ timeout: 10000 }));
						});
					} else {
						message.channel.send(`${message.author} Oops! Não encontrei \`${user.id}\` na lista branca!`).then(msg => msg.delete({ timeout: 7500 }));
					}
				});
			}
		}
	} else {
		message.channel.send(`${message.author} Comando inválido! As ações disponíveis são: \`add\`, \`rem\` ou \`list\``).then(msg => msg.delete({ timeout: 7500 }));
	}
}