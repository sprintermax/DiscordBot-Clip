exports.run = async (client, message, args, database) => {
	////////////
	message.delete();
    if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
    ////////////
	if(args.length < 1) {
        message.channel.send(`${message.author} Por favor, forneça uma pergunta válida para eu poder te responder.`).then(msg => msg.delete(7500));
        return;
    }

    let pergunta = args.join(" ");
    let returns = [
        'Concordo plenamente.',
        'IMPOSSÍVEL!',
        'Claro! Porquê não? hehe',
		'Que tal fazer uma pergunta mais útil?',
        'Depende... talvez sim, talvez não.',
        '42',
        'SIIIIM!!!!! :D',
        'Não sei a resposta pra isso, mas sei que Gatos amam caixas <3',
        'NUNCA!!!',
        'Isso só vai acontecer quando eu for demitida!',
		'Pergunte para o Sprinter, a Opinião dele é a mesma que a minha.',
        'Discordo totalmente.',
        'Não, não e não.',
        'NÃÃÃOOOOOOO.'
    ]

    let areturns = returns[Math.floor(Math.random() * returns.length)];
    
    message.channel.send(areturns);
    
}