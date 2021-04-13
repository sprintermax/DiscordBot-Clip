const discord = require('discord.js');

module.exports.run = async (client, message, args, database) => {
    if((message.member.roles.cache.some(role => role.id == "499227407123742721")) || (client.whitelisted)) {
        var channel;
        var haveperm = true;
        if (args.length >= 2) {
            if (args[1].startsWith('<#') && args[1].endsWith('>')) {
                channel = message.mentions.channels.first();
            } else {
                channel = client.channels.cache.get(args[1]);
            }
        }
        var member;
        if (args.length >= 1) {
            if (args[0].startsWith('<@') && args[0].endsWith('>')) {
                member = message.guild.member(message.mentions.users.first());
            } else {
                member = message.guild.members.cache.get(args[0]);
            }
        }
        if (args.length < 2) {
            if (message.attachments.size == 0) {
                if (!member) {
                    message.channel.send(`${message.author} Você precisa especificar quem eu devo imitar e o que eu vou mandar!`).then(msg => msg.delete({ timeout: 10000 }));
                } else {
                    message.channel.send(`${message.author} Você precisa especificar o que eu vou mandar!`).then(msg => msg.delete({ timeout: 10000 }));
                }
            } else {
                if (!channel) {
                    message.channel.send(`${message.author} Você não pode enviar uma imagem no próprio Chat em que está executado o comando!`).then(msg => msg.delete({ timeout: 10000 }));
                } else {
                    message.channel.send(`${message.author} Você precisa especificar quem eu devo imitar!`).then(msg => msg.delete({ timeout: 10000 }));
                }
            }
        } else {
            if (!member) {
                message.channel.send(`${message.author} "${args[0]}" é inválido. Você precisa especificar algum Usuário desse servidor!`).then(msg => msg.delete({ timeout: 10000 }));
            } else {
                if (!channel) {
                    if (message.attachments.size > 0) {
                        message.channel.send(`${message.author} Você não pode enviar uma imagem no próprio Chat em que está executado o comando!`).then(msg => msg.delete({ timeout: 10000 }));
                    } else {
                        mensagem = message.content.slice(2 + args[0].length + 6).trim();
                        const webhook = await message.channel.createWebhook(member.displayName, member.user.avatarURL).catch(error => {
                        message.channel.send(`${message.author} Eu não tenho permissão para usar webhooks nesse chat!`).then(msg => msg.delete({ timeout: 10000 }));
                            haveperm = false;
                        });
                        if (haveperm) {
                            webhook.send(mensagem);
                            webhook.delete();
                            message.delete();
                        }
                    }
                } else {
                    if (args.length < 3 && message.attachments.size == 0) {
                        message.channel.send(`${message.author} Você precisa especificar o que eu devo mandar!`).then(msg => msg.delete({ timeout: 10000 }));
                    } else {
                        if((channel.permissionsFor(message.author).has('SEND_MESSAGES')) || (client.whitelisted)) {
                            mensagem = message.content.slice(2 + args[0].length + args[1].length + 8).trim();
                                if (message.attachments.size > 0) {
                                    attachment = new discord.MessageAttachment(message.attachments.first().url);
                                } else {
                                    attachment = "";
                                }
                            const webhook = await message.client.channels.cache.get(channel.id).createWebhook(member.displayName, member.user.avatarURL).catch(error => {
                                message.channel.send(`${message.author} Eu não tenho permissão para usar webhooks no chat especificado!`).then(msg => msg.delete({ timeout: 10000 }));
                                haveperm = false;
                            });
                            if (haveperm) {
                                webhook.send(mensagem, attachment).then(msg => {
                                    message.channel.send(`${message.author} Enviei! Confira se está tudo certo com a mensagem no Chat especificado:\nhttps://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`);
                                    webhook.delete();
                                });
                            }
                        } else {
                            message.channel.send(`${message.author} Você não tem permissão para mandar mensagens no Chat especificado (<#${channel.id}>).`).then(msg => msg.delete({ timeout: 10000 }));
                        }
                    }
                }
            }
        }
    } else {
        message.channel.send(`${message.author} Você não tem permissão para usar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
    }
}