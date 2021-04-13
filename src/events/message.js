const Discord = require("discord.js");
const talkedRecently = new Set();

module.exports = (client, message) => {
	// if (message.author.id !== "307331927772364801") return; // Apenas aceitar comandos do Sprintermax (Para Testes)
	if (!message.guild) return;
	const database = client.clipdb;
	database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
		client.dbdata = items[0];
	});
	const userconfig = client.userconfig;
	const prefix = userconfig.botsettings.prefix;
	const whitelist = client.dbdata.whitelist;
	const badwords = client.dbdata.badwords;
	const chatids = client.dbdata.chatids;
	const colors = client.dbdata.colors;
	const words = message.content.replace(/[^A-ZÁÉÍÓÚáéíóúÂÊÔâêôÀàÜüÇçÑñÃÕãõ\s\d]/ig," ").split(/ +/g);
	var staffmember, influencer;
	var badword = "";
	words.forEach(word => {
		if(badwords.includes(word.toLowerCase())) {
			badword += `"${word}" `
		}
	});
	client.clipadmin = userconfig.whitelistids.includes(message.author.id);
	client.whitelisted = (client.clipadmin || whitelist.includes(message.author.id));
	if (message.member) {
		staffmember = message.member.roles.cache.some(role => role.id == "499227407123742721");
		influencer = message.member.roles.cache.some(role => role.id == "709582298114293772");
	}
	if (badword && !message.author.bot && (message.content.indexOf(`${prefix}badword`) == -1)) {
		let embed = new Discord.MessageEmbed()
			.setTitle('~ Uma palavra inapropriada foi encontrada!')
		if(client.whitelisted || message.author.bot || staffmember || influencer) {
			embed.setDescription(`*A mensagem não foi excluída pois o usuário é um moderador ou está na lista branca*`);
		} else {
			message.delete().then(() => message.channel.send(`<:bananaolho:612483041931165707> ${message.author} Por favor não use palavras de baixo calão nesse servidor.`)).then(msg => msg.delete({ timeout: 10000 }));
		}
		embed.setColor(colors.padrao)
			.setThumbnail(message.author.displayAvatarURL)
			.addField('❗ Contéudo inteiro da mensagem:', message.content)
			.addField('🚫 Contéudo inapropriado da mensagem:', badword)
			.addField('💬 Onde ocorreu e quem enviou:', `Mensagem enviada por ${message.author} no chat ${message.channel}`)
			.setFooter(message.guild.name);
		const wordslog = message.guild.channels.cache.get(chatids.staff.wordslog);
		if(!wordslog) return;
		wordslog.send(embed);
	}
	if ((message.content.indexOf(prefix) !== 0) || (message.author.bot)) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command);
	if (!cmd) return;
	if (talkedRecently.has(message.author.id)) return message.channel.send(`🚫 ${message.author} Você só pode executar algum comando a cada um minuto!`).then(msg => msg.delete({ timeout: 5000 }));
	if (!client.whitelisted) {
		talkedRecently.add(message.author.id);
	}
	setTimeout(() => {
		talkedRecently.delete(message.author.id);
	}, 60000);
	cmd.run(client, message, args, database);
}