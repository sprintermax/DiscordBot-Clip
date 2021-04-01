const discord = require('discord.js');

module.exports.run = async (client, message, args, database) => {
  if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));  
  const colors = client.dbdata.colors;
  if (args.length < 1 && message.attachments.size == 0) {
      message.channel.send(`${message.author}\nVocê precisa especificar o que eu devo mandar!`);
    } else {
      var channel;
      if (args.length >= 1) {
        if (args[0].startsWith('<#') && args[0].endsWith('>')) {
          channel = message.mentions.channels.first();
        } else {
          channel = client.channels.cache.get(args[0]);
        }
      }
      if (!channel) {
        if (message.attachments.size > 0) {
          message.channel.send(`${message.author}\nVocê não pode enviar uma imagem no próprio Chat em que está executado o comando!`);
        } else {
          mensagem = message.content.slice(12).trim();
          var embed = new discord.MessageEmbed()
            .setDescription(mensagem)
            .setColor(colors.padrao)
          message.channel.send(embed);
        }
      } else {
        if (channel.permissionsFor(message.author).has('SEND_MESSAGES')) {
          if (args.length < 2 && message.attachments.size == 0) {
            message.channel.send(`${message.author}\nVocê precisa especificar o que eu devo mandar!`);
          } else {
            mensagem = message.content.slice(12 + args[0].length).trim();;
            var embed = new discord.MessageEmbed()
              .setColor(colors.padrao)
            if (mensagem) {
              embed.setDescription(mensagem);
            }
            if (message.attachments.size > 0) {
              embed.setImage(message.attachments.first().url);
            }
            message.client.channels.cache.get(channel.id).send(embed).then(msg => {
              message.channel.send(`${message.author}\nEnviei! Confira se está tudo certo com a mensagem no Chat especificado:\nhttps://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`);
            });
          }
        } else {
          message.channel.send(`${message.author}\nVocê não tem permissão para mandar mensagens no Chat mencionado!`);
        }
      }
    }
}