exports.run = async (client, message, args, database) => {
	message.delete();
	if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
	if (args.length < 1){
		message.channel.send(`${message.author}\nVocê precisa especificar quem ou o quê você quer abraçar!`).then(msg => {
			msg.delete(10000);
			message.delete();
		});
	} else {
		var user = args.join(" ");
		message.channel.send(`${message.author} abraçou ${user}!`).then(msg => {
			msg.delete(30000);
			message.delete();
		});
	}
}

