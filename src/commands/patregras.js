exports.run = async (client, message, args, database) => {
    message.delete();
    if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
    let mention = args.join(' ');
    
    message.channel.send(`**Regulamentação dos Patrulheiros** <:download:612480028248375307>\n\n${mention} Seja bem-vindo! Agora que você é um Patrulheiro, precisa seguir algumas regras estabelecidas e saber de algumas informações(I), nas quais podem ser encontradas abaixo:\n\n - Não vaze nenhuma informação do chat <#667203121004675074>, tudo que é falado aqui, morre aqui.\n- Evite brigas e discussões com membros e os outros Patrulheiros, seus colegas de equipe.\n- Mantenha o respeito acima de tudo.`)
    message.channel.send('**Algumas informações(I)**\n\nCaso você descumpra alguma das regras citadas você estará sujeito a perder sua posição e até ser banido do servidor. Promotes e Demotes ocorrerão somente quando necessário e visto que haja necessidade pelo respectivo Cuidador.')
}