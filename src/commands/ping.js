const Discord = require('discord.js');

exports.run = async (client, message, args, database) => {
	message.delete();
	if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
    const colors = client.dbdata.colors;
    message.channel.send(`Verificando...`).then( m => {
        let ping = m.createdTimestamp - message.createdTimestamp
        let embed = new Discord.RichEmbed()
            .setDescription("🏓 Pong!")
            .setColor(colors.padrao)
            .addField('Latência do Bot:', Math.floor(ping) + 'ms')
            .addField('Latência da API:', Math.round(client.ping) + 'ms')
            .setFooter(`${message.guild.name}`);
        m.edit (`${message.author} Aqui Está:`, embed).then(msg => msg.delete(10000));
    });

}