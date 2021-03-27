const { Client } = require('fortnite-basic-api');
const discord = require('discord.js');

exports.run = async (client, message, args, database) => {
	message.delete();
    if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
	const colors = client.dbdata.colors;

	/*if (args.length < 3) return message.channel.send(`🚫 ${message.author} Comando inválido, use: \`${client.userconfig.botsettings.prefix}stats <all|tem|touch|ctrl> <global|solo|duo|squad> <epic username>\`\n("tem": Teclado e Mouse / "ctrl": Controle)`).then(msg => {
		msg.delete(10000);
	});

	let [platform, gamemode] = args;
    let user = message.content.slice(client.userconfig.botsettings.prefix + 6).trim().split(`${platform}` + ` ${gamemode} `)[1];

	if (args[0]) {
		platform = platform.toLowerCase();
		if (platform == "touch" || platform == "all"){
			var plataforma = `${platform}`;
		} else if (platform == "tem") {
			var plataforma = `keyboardmouse`;
		} else if (platform == "ctrl") {
			var plataforma = `gamepad`;
		} else return message.channel.send(`❗ ${message.author} Comando inválido, os periféricos devem ser: \`all\`, \`tem\`, \`touch\` ou \`ctrl\`.`).then(msg => {
			msg.delete(10000);
		});
	};

	if (args[1]) {
		gamemode = gamemode.toLowerCase();
		if (gamemode == "solo" || gamemode == "duo" || gamemode == "squad"){
			var gametype = `default${gamemode}`;
		} else if (gamemode == "global") {
			var gametype = `all`;
		} else return message.channel.send(`❗ ${message.author} Comando inválido, os modos disponíveis são: \`global\`, \`solo\`, \`duo\` ou \`squad\`.`).then(msg => {
			msg.delete(10000);
		});
	};

	if (!plataforma || !gametype || !user) return message.channel.send(`🚫 ${message.author} Comando inválido, use: \`${client.userconfig.botsettings.prefix}stats <all|tem|touch|ctrl> <global|solo|duo|squad> <epic username>\`\n("tem": Teclado e Mouse / "ctrl": Controle)`).then(msg => {
		msg.delete(10000);
	});*/

	///////////////

	if (args.length < 2) return message.channel.send(`${message.author} Comando inválido, use: \`${client.userconfig.botsettings.prefix}stats <global|solo|duo|squad> <epic username>\``).then(msg => {
		msg.delete(10000);
	});

	let gamemode = args[0];
    let user = message.content.slice(client.userconfig.botsettings.prefix + 6).trim().split(`${gamemode} `)[1];

	if (args[0]) {
		gamemode = gamemode.toLowerCase();
		if (gamemode == "solo" || gamemode == "duo" || gamemode == "squad"){
			var gametype = `default${gamemode}`;
		} else if (gamemode == "global") {
			var gametype = `all`;
		} else return message.channel.send(`${message.author} "${gamemode}" é inválido, os modos disponíveis são: \`global\`, \`solo\`, \`duo\` ou \`squad\`.`).then(msg => {
			msg.delete(10000);
		});
	};

	if (!gametype || !user) return message.channel.send(`${message.author} Comando inválido, use: \`${client.userconfig.botsettings.prefix}stats <global|solo|duo|squad> <epic username>\``).then(msg => {
		msg.delete(10000);
	});

	///////////////

	if (!client.ftnclient) {
		client.ftnlogin = "1";
		client.ftnclient = new Client({
			email: client.userconfig.ftnconfig.ftnbasicapiuser,
			password: client.userconfig.ftnconfig.ftnbasicapitoken,
			autokill: true
		});
	} else {
		client.ftnlogin = "0";
	}
	const ftnclient = client.ftnclient;
	message.channel.send("<a:cliploading:680776857854935092> Estou verificando, aguarde um momento...").then( msg => {
		ftnclient.dcmsg = msg;
		(async () => {
			if (client.ftnlogin == "1") {
				await ftnclient.login();
			};
			const parallel = await Promise.all([
				ftnclient.stats.getV2Stats(`${user}`)
			]);
			if (parallel[0].error) return ftnclient.dcmsg.edit(`🔹 Oops! Não encontrei nenhuma estatística para o jogador "**${user}**", lembre-se de utilizar seu __Apelido da Epic Games__!`).then(msg => {
				msg.delete(10000);
			});

			/*let username = parallel[0].user.displayName;
			let matches = parallel[0].lifetime[plataforma][gametype].matchesplayed;
			let wins = parallel[0].lifetime[plataforma][gametype].placetop1;
			let kills = parallel[0].lifetime[plataforma][gametype].kills;
			let kd = parallel[0].lifetime[plataforma][gametype].kdr;
			let timemins = parallel[0].lifetime[plataforma][gametype].minutesplayed;
			let timehours = Math.round(parallel[0].lifetime[plataforma][gametype].minutesplayed/60);*/
			let username = parallel[0].user.displayName;
			let matches = parallel[0].lifetime.all[gametype].matchesplayed;
			let wins = parallel[0].lifetime.all[gametype].placetop1;
			let kills = parallel[0].lifetime.all[gametype].kills;
			let kd = parallel[0].lifetime.all[gametype].kdr;
			let timemins = parallel[0].lifetime.all[gametype].minutesplayed;
			let timehours = Math.round(parallel[0].lifetime.all[gametype].minutesplayed/60);

			var msg = "";
			if (timemins) {
				msg += `\nTempo de Jogo: ${timemins} Minutos`;
				if (timehours > 1) {
					msg += ` (${timehours} Horas)`;
				};
			};
			msg += "\nPartidas Jogadas: " + matches;
			msg += "\nEliminações: " + kills;
			msg += "\nVitórias: " + wins;
			msg += "\nK/D: " + kd;

			var embed = new discord.RichEmbed()
				.setAuthor(username)
				.setDescription(msg)
				.setColor(colors.padrao)
				.setThumbnail("https://cdn.discordapp.com/icons/499203081209118720/67c28114a95c6c8d32d34e7ffdb653a3.webp")
				.setFooter(`${message.guild.name}`);
			
			var controlmethod = "";
			/*if (plataforma == "all") {
				controlmethod = " em **TODOS** os periféricos";
			};
			if (plataforma == "touch") {
				controlmethod = " usando **Touchscreen**";
			};
			if (plataforma == "keyboardmouse") {
				controlmethod = " usando **Teclado e Mouse**";
			};
			if (plataforma == "gamepad") {
				controlmethod = " usando **Controle**";
			};*/
			ftnclient.dcmsg.edit(`🔹 ${message.author} Mostrando estatísticas **${gamemode.toUpperCase()}** de **${username}**${controlmethod}.`, embed).then(msg => {
				msg.delete(30000);
			});
		})().catch(err => {
			console.log(err);
		});	
	});
}