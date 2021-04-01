const discord = require('discord.js');

module.exports.run = async (client, message, args, database) => {
  const prefix = client.userconfig.botsettings.prefix;
  if((message.member.hasPermission("MANAGE_MESSAGES")) || (client.whitelisted)) {
    if (args.length < 1 && message.attachments.size == 0) {
      message.channel.send(`${message.author} Você precisa específicar o que eu devo mandar!`).then(msg => msg.delete({ timeout: 10000 }));
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
          message.channel.send(`${message.author} Você não pode enviar uma imagem no próprio Chat em que está executado o comando!`).then(msg => msg.delete({ timeout: 10000 }));
        } else {
          mensagem = message.content.slice(prefix.length + 4).trim();
          message.channel.send(mensagem);
		  message.delete();
        }
      } else {
        if (args.length < 2 && message.attachments.size == 0) {
          message.channel.send(`${message.author} Você precisa especificar o que eu devo mandar!`).then(msg => msg.delete({ timeout: 10000 }));
        } else {
          if((channel.permissionsFor(message.author).has('SEND_MESSAGES')) || (client.whitelisted)) {
            mensagem = message.content.slice(prefix.length + args[0].length + 4).trim();
            if (message.attachments.size > 0) {
              attachment = new discord.MessageAttachment(message.attachments.first().url);
            } else {
              attachment = "";
            }
            message.client.channels.cache.get(channel.id).send(mensagem, attachment).then(msg => {
              message.channel.send(`${message.author} Enviei! Confira se está tudo certo com a mensagem no Chat especificado: https://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`);
            });
          } else {
            message.channel.send(`${message.author} Você não tem permissão para mandar mensagens no Chat mencionado!`).then(msg => msg.delete(10000));
          }
        }
      }
    }
  } else {
    message.channel.send(`${message.author} Você não tem permissão para usar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
  }
}