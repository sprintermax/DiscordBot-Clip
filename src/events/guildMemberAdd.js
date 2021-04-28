const Discord = require("discord.js");

module.exports = async (client, member) => {
	database = client.clipdb;
	database.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
		client.dbdata = items[0];
	});
	const colors = client.dbdata.colors;
	const chatids = client.dbdata.chatids;
	const newmembers = member.guild.channels.cache.get(chatids.staff.newmembers);
	var embed = new Discord.MessageEmbed()
		.setTitle(`${member.guild.name}`)
		.setDescription(`Aqui está algumas informações e dicas para começar a usar o servidor, lembre-se de ler o chat [#Regras](https://discordapp.com/channels/499203081209118720/836962064411918426) para evitar ser punido e saber o que é permitido ou não.`)
		.addField(`­`, `**Plataformas Sociais e Links Úteis:**\nO chat [#Bem-Vindo](https://discordapp.com/channels/499203081209118720/836931599332409364) contém diversos links informativos e para diversas outras plataformas sociais oficiais. Caso queira compartilhar o servidor com seus amigos utilize o link \"[https://discord.gg/fortnitebr-pt](https://discord.gg/fortnitebr-pt)\"`)
		.addField(`­`, `**Canais de Notícias:**\nSe você procura por informações sobre o jogo, como anúncios em geral, notas de atualização, modo competitivo e criativo, existem os chats da categoria **Fortnite Notícias**, como o [#Fortnite-Tweets](https://discordapp.com/channels/499203081209118720/499233260103008266) e o [#Status-Do-Jogo](https://discordapp.com/channels/499203081209118720/499233323403575328).\n\nAtualizações do servidor, como alterações em cargos, notícias sobre o Discord e mudança de regras são avisadas no chat [#Discord-Notícias](https://discordapp.com/channels/499203081209118720/499236638245912586).`)
		.addField(`­`, `**Comunidade em Geral:**\nVocê pode usar os diversos chats para conversar sobre o jogo, procurar jogadores e compartilhar suas teorias e criações! Só fique atento ao tópico de cada canal, procure manter o servidor organizado e evite discussões desnecessárias. Caso veja alguém desrespeitando alguma regra converse calmamente sobre a ação e evite brigas. Caso o membro não pare, basta contatar a staff.\n\nLembrando que o servidor não foi feito para ser um suporte ao jogador, então não espere encontrar todas as respostas que você procura, mas qualquer membro pode auxiliar com dúvidas de outros desde que não passe informações falsas ou prejudiciais.`)
		.addField(`­`, `**Apelo de Banimentos:**\nCaso você tenha sido banido do servidor, poderá utilizar o formulário abaixo para um moderador analisar sua situação e TALVEZ reconsiderar o seu banimento. Tenha em mente que você não receberá uma resposta direta, independentemente da ação tomada pela equipe.\n[https://forms.gle/3WyMLB2E4CPJrRQt9](https://forms.gle/3WyMLB2E4CPJrRQt9)`)
		.setColor(colors.padrao)
		.setFooter(member.guild.name);
	member.send(`Olá, Bem vindo ao **${member.guild.name}** :D\nEu sou a **Clip** e irei dar algumas orientações sobre o servidor:`, embed)
	.then(() => {
		if(!newmembers) return;
		newmembers.send(`O usuário ${member} entrou no servidor! A mensagem de boas vindas foi enviada a ele com sucesso!`);
	})
	.catch(() => {
		if(!newmembers) return;
		newmembers.send(`O usuário ${member} entrou no servidor! Infelismente a mensagem de boas vindas não pode ser enviada.`);
	});
}