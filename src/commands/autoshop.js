module.exports.run = async (client, message, args, database) => {
	message.delete();
	if(!client.whitelisted) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	if (args[0] == "on" && client.whitelisted) {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			autoshop = items[0].autoshop;
			shophash = autoshop.lasthash;
			if (autoshop.enabled == "true") {
				message.channel.send(`${message.author} Oops! A loja automática já está ligada!`).then(msg => msg.delete({ timeout: 7500 }));
			} else {
				database.updateOne({"DBNameID":"ClipDB"}, {'$set': { autoshop: { enabled: "true", lasthash: shophash } } }, (err, item) => {
					if (err) console.error(err)
					message.channel.send(`${message.author} Pronto! O Módulo da Loja Automática foi ligado!`).then(msg => msg.delete({ timeout: 10000 }));
				});
			}
		});
	} else if (args[0] == "off" && client.whitelisted) {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			autoshop = items[0].autoshop;
			shophash = autoshop.lasthash;
			if (autoshop.enabled == "false") {
				message.channel.send(`${message.author} Oops! A loja automática já está desligada!`).then(msg => msg.delete({ timeout: 7500 }));
			} else {
				database.updateOne({"DBNameID":"ClipDB"}, {'$set': { autoshop: { enabled: "false", lasthash: shophash } } }, (err, item) => {
					if (err) console.error(err)
					message.channel.send(`${message.author} Pronto! O Módulo da Loja Automática foi desligado!`).then(msg => msg.delete({ timeout: 10000 }));
				});
			}
		});
	} else {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			autoshop = items[0].autoshop;
			if (autoshop.enabled == "false") {
				message.channel.send(`${message.author} O estado atual da loja automática é \`Desligado\`!\nUse \`${client.userconfig.botsettings.prefix}autoshop <on|off>\` para habilitar ou desabilitar o módulo`).then(msg => msg.delete({ timeout: 7500 }));
			} else if (autoshop.enabled == "true") {
				message.channel.send(`${message.author} O estado atual da loja automática é \`Ligado\`!\nUse \`${client.userconfig.botsettings.prefix}autoshop <on|off>\` para habilitar ou desabilitar o módulo`).then(msg => msg.delete({ timeout: 7500 }));
			}
		});
	}
}