const Discord = require('discord.js');
exports.run = async (client, message, args, database) => {
    if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
    const colors = client.dbdata.colors;
    message.delete();    
    let embed = new Discord.RichEmbed()
        .setAuthor('Menu de Ajuda da Clip', 'https://cdn.discordapp.com/avatars/605882442477469716/817fe1d9a8061b2938cae037f4297513.png')
        .setDescription("Meu prefixo nesse servidor é `!!`")
        .addBlankField()
        .setColor(colors.padrao)
        .addField('__Developers__ (2 comandos):', 'restart - Reinicia o bot `(usado em casos de emergência).`\n\nping - Mostra a latência do bot com o Discord(host) e a API.', false)
        .addField('__Utilidades__ (4 comandos):', 'avatar `@user`* - Mostra a foto de perfil do usuário* marcado.\n\nstats `<pc - xbl - psn> <global - solo - duo - squad> <username>*` - Mostra algumas estatísticas da conta do nickname* fornecido.\n\nabraçar `<@user> - <texto>*` - Abraça o usuário/texto* mencionado.\n\nemoji `<nome/ID>` - Pega algumas informações de um emoji e o link para download.')
        .addField('__Relacionados a Staff__ (1 comando):', 'patregras `<@user>` - Mostra as regras e algumas informações para um novo, *ou antigo*, Patrulheiro.')
        .setFooter('Oficial Fortnite Brasil & Portugal')
    message.channel.send(embed).then(msg => {
        msg.delete(15000);
    });
}