const discord = require('discord.js');
const https = require('https');

module.exports.run = async (client, message, args, database) => {
    if((!message.member.roles.cache.some(role => role.id == "499227407123742721")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
    if (args.length < 1){
        message.channel.send(`${message.author} Você precisa especificar qual código deseja verificar!`);
    } else {
        if (args.length > 1) {
            message.channel.send(`${message.author} Desculpe, mas esse comando só funciona com um código por vez!`);
        } else {
            message.channel.send(`<a:cliploading:680776857854935092> ${message.author} Estou verificando, por favor aguarde...`).then( m => {
                https.get(`https://api.nitestats.com/v1/codes/checker?auth=ZzN8Ls3YfbxOUvaY&format=json&&codes=${args[0]}`, (res) => {
                    res.on('data', (data) => {
                        try {
                            JSON.parse(data.toString());
                            result = JSON.parse(data.toString());
                            if (result.codes[0].status == "Invalid") {
                                var embed = new discord.MessageEmbed()
                                    .setAuthor("INFORMAÇÕES DO CÓDIGO:")
                                    .setDescription(`**Código:** \`${result.codes[0].code}\`\n**Status:** ${result.codes[0].status}`)
                                    .setColor("#25C059")
                            } else {
                                var embed = new discord.MessageEmbed()
                                    .setAuthor("INFORMAÇÕES DO CÓDIGO:")
                                    .setDescription(`**Código:** \`${result.codes[0].code}\`\n**ID Interno:** ${result.codes[0].entitlementName}\n**Título:** ${result.codes[0].title}\n**Descrição:** ${result.codes[0].description}\n**Status:** ${result.codes[0].status}`)
                                    .setColor("#25C059")
                            }
                            m.edit(`🔹 ${message.author} Aqui está:`, embed);
                        } catch (e) {
                            m.edit(`🔹 ${message.author} Oops! Não consegui verificar o código.\nMensagem de Erro: \`${data.toString()}\``);
                        }
                    });
                }).on('error', (e) => {
                    console.error(e);
                });
            });
        }
    }
}
