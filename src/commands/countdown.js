module.exports.run = async (client, message, args, database) => {
	message.delete();
	if(!client.whitelisted) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	if (args[0] == "on" && client.whitelisted) {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			countdown = items[0].countdown;
			countmessage = countdown.message;
			finaldate = countdown.enddate;
			if (countdown.enabled == "true") {
				message.channel.send(`${message.author} Oops! O Módulo de Temporizador já está ligado!`).then(msg => msg.delete({ timeout: 10000 }));
			} else if (countdown.enddate == "EXPIRED") {
				message.channel.send(`${message.author} Oops! Não tem nenhuma data programada no Temporizador! Use \`${client.userconfig.botsettings.prefix}countdown set <data>\` para Definir uma Data.`).then(msg => msg.delete({ timeout: 10000 }));
			} else {
				database.updateOne({"DBNameID":"ClipDB"}, {'$set': { countdown: { enabled: "true", enddate: finaldate, message: countmessage } } }, (err, item) => {
					if (err) console.error(err)
					message.channel.send(`${message.author} Pronto! O Módulo de Temporizador foi ligado!`).then(msg => msg.delete({ timeout: 10000 }));
				});
			}
		});
	} else if (args[0] == "off" && client.whitelisted) {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			countdown = items[0].countdown;
			countmessage = countdown.message;
			finaldate = countdown.enddate;
			if (countdown.enabled == "false") {
				message.channel.send(`${message.author} Oops! O Módulo de Temporizador já está desligado!`).then(msg => msg.delete({ timeout: 10000 }));
			} else {
				database.updateOne({"DBNameID":"ClipDB"}, {'$set': { countdown: { enabled: "false", enddate: finaldate, message: countmessage } } }, (err, item) => {
					if (err) console.error(err)
					message.channel.send(`${message.author} Pronto! O Módulo de Temporizador foi desligado!`).then(msg => msg.delete({ timeout: 10000 }));
				});
			}
		});
	} else if (args[0] == "set" && client.whitelisted) {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			countdown = items[0].countdown;
			countmessage = countdown.message;
			countstate = countdown.enabled;
			finaldate = message.content.slice(client.userconfig.botsettings.prefix.length + 14).trim();
			if (Date.parse(finaldate)) {
				database.updateOne({"DBNameID":"ClipDB"}, {'$set': { countdown: { enabled: countstate, enddate: finaldate, message: countmessage } } }, (err, item) => {
					if (err) console.error(err)
					message.channel.send(`${message.author} Pronto! Configurei o Tempo do Temporizador para \`${finaldate}\`!`).then(msg => msg.delete({ timeout: 10000 }));
				});
			} else {
				message.channel.send(`${message.author} Oops! A Data Especificada não é Válida! Aqui está um exemplo de formato válido: \`19 Oct 2020 17:41 UTC\``).then(msg => msg.delete({ timeout: 10000 }));
			}
		});
	} else if (args[0] == "message" && client.whitelisted) {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			countdown = items[0].countdown;
			finaldate = countdown.enddate;
			countstate = countdown.enabled;
			countmessage = message.content.slice(client.userconfig.botsettings.prefix.length + 18).trim();
			//////////
			if (!countmessage) {
				countmessage = "";
			}
			database.updateOne({"DBNameID":"ClipDB"}, {'$set': { countdown: { enabled: countstate, enddate: finaldate, message: countmessage } } }, (err, item) => {
				if (err) console.error(err)
				message.channel.send(`${message.author} Pronto! Configurei a Mensagem do Temporizador para \`${countmessage}\`!`).then(msg => msg.delete({ timeout: 10000 }));
			});
		});
	} else {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			countdown = items[0].countdown;
			if (countdown.enabled == "false") {
				message.channel.send(`${message.author} O estado atual do Módulo de Temporizador é \`Desligado\`!\nUse \`${client.userconfig.botsettings.prefix}countdown <on|off|set|message>\` para configurar o módulo`).then(msg => msg.delete({ timeout: 10000 }));
			} else if (countdown.enabled == "true") {
				message.channel.send(`${message.author} O estado atual do Módulo de Temporizador é \`Ligado\`!\nUse \`${client.userconfig.botsettings.prefix}countdown <on|off|set|message>\` para configurar o módulo`).then(msg => msg.delete({ timeout: 10000 }));
			}
		});
	}
}