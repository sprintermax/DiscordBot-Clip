const Discord = require('discord.js');

exports.run = async (client, message, args, database) => {
    message.delete();
    if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
    const colors = client.dbdata.colors;
    if (args.length < 1){
        message.channel.send(`${message.author} Você precisa especificar o usuário que quer pegar a foto de perfil!`).then(msg => msg.delete(10000));
    } else {
        var user;
        if (args[0].startsWith('<@') && args[0].endsWith('>')) {
            user = message.mentions.users.first();
        } else {
            user = client.users.get(args[0]);
        }
		if (!user) {
            message.channel.send(`${message.author} "${args[0]}" é inválido. Você precisa especificar algum usuário desse servidor.`).then(msg => msg.delete(10000));
		} else {
            var embed = new Discord.RichEmbed()
            .setDescription(`**Imagem de perfil de ${user}**`)
            .setColor(colors.padrao)
            .setImage(`${user.avatarURL}`)
            .setFooter(`${message.guild.name}`);
            message.channel.send(`${message.author}`, embed).then(msg => msg.delete(30000));
        }
    }
}