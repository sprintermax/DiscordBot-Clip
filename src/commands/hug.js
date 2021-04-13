exports.run = async (client, message, args, database) => {
	if((!message.member.roles.cache.some(role => role.id == "499227407123742721")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	if (args.length < 1){
		message.channel.send(`${message.author}\nVocê precisa especificar quem ou o quê você quer abraçar!`).then(msg => {
			msg.delete({ timeout: 10000 });
			message.delete();
		});
	} else {
		var user = args.join(" ");
		message.channel.send(`${message.author} abraçou ${user}!`).then(msg => {
			msg.delete({ timeout: 30000 });
			message.delete();
		});
	}
}

