exports.run = async (client, message, args, database) => {
	if ((!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	message.delete();
	message.channel.send("<a:cliploading:680776857854935092> Estou sendo reiniciada, aguarde um momento...").then( m => {
		client.destroy();
		client.login(process.env.DISCORD_TOKEN);
		client.on('ready', () => {
			m.edit (`🔹 Pronto! Reiniciei e estou pronta para trabalhar!`).then(msg => {
				msg.delete({ timeout: 10000 });
			});
		});
	});
}
