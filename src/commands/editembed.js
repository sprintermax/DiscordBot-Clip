const discord = require('discord.js');

module.exports.run = async (client, message, args, database) => {
	if((message.member.roles.cache.some(role => role.id == "499227407123742721")) || (client.whitelisted)) {
		const colors = client.dbdata.colors;
	  if (message.attachments.size > 0) {
		message.channel.send(`${message.author}\nDesculpe, mas devido a limitações do Discord eu não posso editar ou colocar imagens em uma mensagem já enviada!`).then(msg => msg.delete({ timeout: 10000 }));
		return;
	  } else {
		if (args.length < 2) {
		  message.channel.send(`${message.author}\nVocê precisa especificar a Mensagem que eu devo editar e o novo conteúdo da mensagem!`).then(msg => msg.delete({ timeout: 10000 }));
		  return;
		} else {
		  if (args.length >= 1) {
			if (args[0].startsWith('<#') && args[0].endsWith('>')) {
			  channel = message.mentions.channels.first();
			} else {
			  channel = client.channels.cache.get(args[0]);
			}
		  }
		  if (!channel) {
			mensagem = message.content.slice(client.userconfig.botsettings.prefix.length + args[0].length + 12).trim();
			  message.channel.messages.fetch(args[0]).then(msg => {
				if (msg) {
				  if (msg.author.id == client.user.id) {
					mensagem = message.content.slice(args[0].length + 12).trim();
          			var embed = new discord.MessageEmbed()
            			.setDescription(mensagem)
            			.setColor(colors.padrao)
						msg.edit(msg.content, embed);
					message.channel.send(`${message.author}\nEditei! Confira se está tudo certo com a mensagem especificada:\nhttps://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`);
					return;
				  } else {
					message.channel.send(`${message.author}\nEu não posso editar uma mensagem que não foi enviada por mim!`).then(msg => msg.delete({ timeout: 10000 }));
					return;
				  }
				}
			  }).catch(err => message.channel.send(`${message.author}\n"${args[0]}" é inválido. Você precisa especificar o ID de alguma mensagem ou algum Chat`).then(msg => msg.delete({ timeout: 10000 })));
			  return;
		  } else {
			if (channel.permissionsFor(message.author).has('SEND_MESSAGES') || (client.whitelisted)) {
			  if (args.length < 3) {
				message.channel.send(`${message.author}\nVocê precisa especificar o novo conteúdo da mensagem para eu poder editar!`).then(msg => msg.delete({ timeout: 10000 }));
				return;
			  } else {
				mensagem = message.content.slice(client.userconfig.botsettings.prefix.length + args[0].length + args[1].length + 10).trim();
				channel.messages.fetch(args[1]).then(msg => {
				  if (msg) {
					if (msg.author.id == client.user.id) {
						mensagem = message.content.slice(args[0].length + args[1].length + 13).trim();
						var embed = new discord.MessageEmbed()
						  .setDescription(mensagem)
						  .setColor(colors.padrao)
						msg.edit(msg.content, embed);
					  message.channel.send(`${message.author}\nEditei! Confira se está tudo certo com a mensagem no Chat especificado:\nhttps://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`);
					  return;
					} else {
					  message.channel.send(`${message.author}\nEu não posso editar uma mensagem que não foi enviada por mim!`).then(msg => msg.delete({ timeout: 10000 }));
					  return;
					}
				  }
				}).catch(err => message.channel.send(`${message.author}\n"${args[1]}" é inválido. Você precisa especificar o ID de alguma mensagem no Chat especicicado!`).then(msg => msg.delete({ timeout: 10000 })));
				return;
			  }
			} else {
			  message.channel.send(`${message.author}\nVocê não tem permissão para mandar mensagens no Chat mencionado!`).then(msg => msg.delete({ timeout: 10000 }));
			  return;
			}
		  }
		}
	  }
	} else {
	  message.channel.send(`${message.author}\nVocê não tem permissão para usar esse comando!`);
	  return;
	}
  }