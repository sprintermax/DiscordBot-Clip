const discord = require('discord.js');

module.exports.run = async (client, message, args, database) => {
	message.delete();
	var peixotos = [];
	if (args[0] == "-list" && (message.member.hasPermission("MANAGE_MESSAGES") || client.whitelisted)) {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			peixotos = items[0].peixotoimages;
			message.channel.send(`${message.author} Aqui está uma lista com todos os links com imagens do peixoto:\n\`${peixotos.join("\n")}\``).then(msg => msg.delete(30000));
		});
	} else if (args[0] == "-add" && (message.member.hasPermission("MANAGE_MESSAGES") || client.whitelisted)) {
		if (args.length < 2) {
			message.channel.send(`${message.author} Você precisa mandar um link que contém uma imagem do peixoto para eu adicionar!`).then(msg => msg.delete(7500));
		} else {
			database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
				peixotos = items[0].peixotoimages;
				if (peixotos.indexOf(args[1]) > -1) {
					message.channel.send(`${message.author} Oops! A imagem do link "\`${args[1]}\`" ja está na minha lista!`).then(msg => msg.delete(7500));
				} else {
					peixotos.push(args[1]);
					database.updateOne({"DBNameID":"ClipDB"}, {'$set': {peixotoimages: peixotos}}, (err, item) => {
						if (err) console.error(err)
						message.channel.send(`${message.author} Pronto! Adicionei a imagem do peixoto do link "\`${args[1]}\`"!`).then(msg => msg.delete(10000));
					});
				}
			});
		}
	} else if (args[0] == "-rem" && (message.member.hasPermission("MANAGE_MESSAGES") || client.whitelisted)) {
		if (args.length < 2) {
			message.channel.send(`${message.author} Você precisa especificar o link da imagem que devo remover!`).then(msg => msg.delete(7500));
		} else {
			database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
				peixotos = items[0].peixotoimages;
				if (peixotos.indexOf(args[1]) > -1) {
					peixotos = items[0].peixotoimages.filter(i => i !== args[1]);
					database.updateOne({"DBNameID":"ClipDB"}, {'$set': {peixotoimages: peixotos}}, (err, item) => {
						if (err) console.error(err);
						message.channel.send(`${message.author} Pronto! Removi o link "\`${args[1]}\`" da lista de imagens do peixoto!`).then(msg => msg.delete(10000));
					});
				} else {
					message.channel.send(`${message.author} Oops! Não encontrei o link "\`${args[1]}\`" na minha lista!`).then(msg => msg.delete(7500));
				}
			});
		}
	} else {
		database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
			peixotos = items[0].peixotoimages;
			var peixoto = peixotos[Math.floor(Math.random() * peixotos.length)];
			if (message.channel.permissionsFor(message.author).has('ATTACH_FILES')) {
				if (args.length < 1){
					message.channel.send(`${message.author} aqui está o Peixoto:`, new discord.Attachment(peixoto, 'peixoto.png'));
				} else {
					var user;
					if (args[0].startsWith('<@') && args[0].endsWith('>')) {
						user = message.mentions.users.first();
					} else {
						user = client.users.get(args[0]);
					}
					if (!user) {
						message.channel.send(`${message.author}\n"${args[0]}" é inválido. Você precisa mencionar algum usuário desse Servidor`).then(msg => msg.delete(7500));
					} else {
						message.channel.send(`${message.author} mostrou o Peixoto para ${user}!`, new discord.Attachment(peixoto, 'peixoto.png'));
					}
				}
			} else {
				message.channel.send(`${message.author} Você não tem permissão para usar esse comando aqui!`).then(msg => msg.delete(10000));
			}
		});
	}
}