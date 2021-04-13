const request = require('request');

module.exports.run = async (client, message, args, database) => {
	if((message.member.roles.cache.some(role => role.id == "499227407123742721")) || (client.whitelisted)) {
		if (args.length < 1) {
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
			mensagem = message.content.slice(client.userconfig.botsettings.prefix.length + args[0].length + 8).trim();
			  message.channel.fetchMessage(args[0]).then(msg => {
				if (msg) {
					request.post(`https://discord.com/api/channels/${msg.channel.id}/messages/${msg.id}/crosspost`, {
            			headers: {
                  			Authorization: `Bot ${process.env.DISCORD_TOKEN}`
            			}
          			}, (error, res, body) => {
              			if (error) {
            				console.error(error)
            				return
						}
						if (res.statusCode == "200") {
							message.channel.send(`${message.author}\nPronto! Consegui publicar a mensagem com sucesso!`);
						} else {
							message.channel.send(`${message.author}\nOops! Ocorreu um erro inesperado, desculpe!`);
						}
          				console.log(`statusCode: ${res.statusCode}`)
          				console.log(body)
					});
				}
			  }).catch(err => message.channel.send(`${message.author}\n"${args[0]}" é inválido. Você precisa especificar o ID de alguma mensagem ou algum Chat`).then(msg => msg.delete({ timeout: 10000 })));
			  return;
		  } else {
			if (channel.permissionsFor(message.author).has('SEND_MESSAGES') || (client.whitelisted)) {
			  if (args.length < 2) {
				message.channel.send(`${message.author}\nVocê precisa especificar o novo conteúdo da mensagem para eu poder editar!`).then(msg => msg.delete({ timeout: 10000 }));
				return;
			  } else {
				mensagem = message.content.slice(client.userconfig.botsettings.prefix.length + args[0].length + args[1].length + 10).trim();
				channel.fetchMessage(args[1]).then(msg => {
				  if (msg) {
					request.post(`https://discord.com/api/channels/${msg.channel.id}/messages/${msg.id}/crosspost`, {
            			headers: {
                  			Authorization: `Bot ${process.env.DISCORD_TOKEN}`
            			}
          			}, (error, res, body) => {
              			if (error) {
            				console.error(error)
            				return
						}
						if (res.statusCode == "200") {
							message.channel.send(`${message.author}\nPronto! Consegui publicar a mensagem com sucesso!`);
						} else {
							message.channel.send(`${message.author}\nOops! Ocorreu um erro inesperado, desculpe!`);
						}
          				console.log(`statusCode: ${res.statusCode}`)
          				console.log(body)
					});
				  }
				}).catch(err => message.channel.send(`${message.author}\n"${args[1]}" é inválido. Você precisa especificar o ID de alguma mensagem no Chat especicicado!`).then(msg => msg.delete(10000)));
				return;
			  }
			} else {
			  message.channel.send(`${message.author}\nVocê não tem permissão para mandar mensagens no Chat mencionado!`).then(msg => msg.delete({ timeout: 10000 }));
			  return;
			}
		  }
		}
	} else {
	  message.channel.send(`${message.author}\nVocê não tem permissão para usar esse comando!`);
	  return;
	}
  }