function freeze(time) {
	const stop = new Date().getTime() + time;
	while(new Date().getTime() < stop);       
}
  
module.exports.run = async (client, message, args, database) => {
	message.delete();
    if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
	if (args.length < 1){
		var choise = Math.floor(Math.random() * 6 + 1);
		message.channel.send(`${message.author} rolei o dado e caiu: **${choise}**`).then(msg => msg.delete(30000));
	} else {
		let numbers = Math.floor(args[0]);
		if (isNaN(numbers)) {
			message.channel.send(`${message.author} Isso não é um número! Escolha um número válido de lados.`).then(msg => msg.delete(10000));
		} else {
			if (numbers <= 1) {
				message.channel.send(`${message.author} você precisa escolher um número maior que 1`).then(msg => msg.delete(10000));
			} else {
				var choise = Math.floor(Math.random() * numbers + 1);
				message.channel.send(`${message.author}\nIrei sortear um número de 1 a ${numbers}...`).then( m => {
					if (numbers >= 20) {
						m.edit (`<a:cliploading:680776857854935092> ${message.author}\nSorteando algum número de 1 a ${numbers}... **\`${Math.floor(Math.random() * numbers + 1)}\`**`);
						freeze(500);
						m.edit (`<a:cliploading:680776857854935092> ${message.author}\nSorteando algum número de 1 a ${numbers}... **\`${Math.floor(Math.random() * numbers + 1)}\`**`);
						freeze(500);
						m.edit (`<a:cliploading:680776857854935092> ${message.author}\nSorteando algum número de 1 a ${numbers}... **\`${Math.floor(Math.random() * numbers + 1)}\`**`);
					}
					freeze(500);
					m.edit (`🔹 ${message.author} **Terminei!**\nSorteei um número de 1 a ${numbers} e caiu: **\`${choise}\`**`);
					m.delete(30000);
				});
			}
		}
	}
}