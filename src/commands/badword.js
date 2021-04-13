exports.run = async (client, message, args, database) => {
	message.delete();
	if((!message.member.roles.cache.some(role => role.id == "499227407123742721")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	var badwords = [];
	if (args.length < 1) {
		message.channel.send(`${message.author} Você precisa especificar uma ação!\n \`${client.userconfig.botsettings.prefix}badword <add|rem|list> <palavra>\``).then(msg => msg.delete({ timeout: 7500 }));
	} else if (args[0] == "list") {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			badwords = items[0].badwords;
			message.channel.send(`${message.author} Aqui está uma lista com todas as palavras proibidas:\n\`\`\`${badwords.join(", ")}\`\`\``).then(msg => msg.delete({ timeout: 3000 }));
		});
	} else if (args[0] == "add") {
		if (args.length < 2) {
			message.channel.send(`${message.author} Você precisa especificar qual palavra devo adicionar!`).then(msg => msg.delete({ timeout: 7500 }));
		} else {
			database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
				badwords = items[0].badwords;
				if (badwords.indexOf(args[1].toLowerCase()) > -1) {
					message.channel.send(`${message.author} Oops! \`${args[1].toLowerCase()}\` já está na lista de palavras proibidas!`).then(msg => msg.delete({ timeout: 7500 }));
				} else {
					badwords.push(args[1].toLowerCase());
					database.updateOne({"DBNameID":"ClipDB"}, {'$set': {badwords: badwords}}, (err, item) => {
						if (err) console.error(err)
						message.channel.send(`${message.author} Pronto! Adicionei "\`${args[1].toLowerCase()}\`" à lista de palavras proibidas!`).then(msg => msg.delete({ timeout: 10000 }));
					});
				}
			});
		}
	} else if (args[0] == "rem") {
		if (args.length < 2) {
			message.channel.send(`${message.author} Você precisa especificar qual palavra devo remover!`).then(msg => msg.delete({ timeout: 7500 }));
		} else {
			database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
				badwords = items[0].badwords;
				if (badwords.indexOf(args[1].toLowerCase()) > -1) {
					badwords = items[0].badwords.filter(i => i !== args[1].toLowerCase());
					database.updateOne({"DBNameID":"ClipDB"}, {'$set': {badwords: badwords}}, (err, item) => {
						if (err) console.error(err);
						message.channel.send(`${message.author} Pronto! Removi \`${args[1].toLowerCase()}\` da lista de palavras proibidas!`).then(msg => msg.delete({ timeout: 10000 }));
					});
				} else {
					message.channel.send(`${message.author} Oops! Não encontrei \`${args[1].toLowerCase()}\` na lista de palavras proibidas!`).then(msg => msg.delete({ timeout: 7500 }));
				}
			});
		}
	} else {
		message.channel.send(`${message.author} Comando inválido! As ações disponíveis são: \`add\`, \`rem\` ou \`list\``).then(msg => msg.delete({ timeout: 7500 }));
	}
}