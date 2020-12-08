const FortniteAPI = require("fortnite-api-com");
const discord = require('discord.js');
const Jimp = require("jimp");
const fs = require("fs");

exports.run = async (client, message, args, database) => {
	message.delete();
	if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
	if (args.length < 2 || ((args[0] != "-pt" && args[0] != "-en")&& args[0] != "-id")) return message.channel.send(`${message.author} Você precisa especificar em qual idioma e o que devo procurar!\n\`!!itemimage <-en|-pt> <nome>\` (Note que a pesquisa em português pode conter bugs)`).then(msg => {
		msg.delete(10000);
	});
	var cosmetic, searchLanguage;
	if ((args[0] == "-id" && args.length < 2)) return message.channel.send(`${message.author} Você precisa especificar o que devo procurar!\n\`!!itemimage <-id> <id>\``).then(msg => {
		msg.delete(10000);
	});
	if (args[0] == "-id" && args.length >= 2) {
		cosmetic = message.content.split(`${args[0]} `)[1];
		searchLanguage = "pt-BR";
	} else if (args[0] == "-en") {
		searchLanguage = "en";
		cosmetic = message.content.split(`${args[0]} `)[1];
	} else if (args[0] == "-pt") {
		searchLanguage = "pt-BR";
		cosmetic = message.content.split(`${args[0]} `)[1];
	}
	message.channel.send(`<a:cliploading:680776857854935092> ${message.author} Aguarde um momento...`).then(msg => {
		message.tempmsg = msg
	});
	fs.access("./src/temp/cosmetic/", function(error) {
		if (error) {
			fs.mkdir('./src/temp/cosmetic/', { recursive: true }, (err) => { if (err) throw err; });
		}
	});
	fs.readdir("./src/temp/cosmetic/", (err, files) => {
		if (err) return;
		files.forEach(file => {
			fs.unlink(`./src/temp/cosmetic/${file}`, function (err) {
				if (err) throw err;
			});
		});
	});
	
	const overlay = await Jimp.read('./src/data/images/SmallOverlay.png');
	const config = {
		apikey: client.userconfig.ftnconfig.fortnite_api_com_apikey,
		language: client.userconfig.ftnconfig.language
	};
	const data = {
		language: client.userconfig.ftnconfig.language,
		matchMethod: "contains",
		searchLanguage: searchLanguage,
		name: encodeURI(cosmetic)
	};
	var Fortnite = new FortniteAPI(config);
	if (args[0] == "-id") {
		Fortnite.CosmeticsId(cosmetic).then(res => {
			GetImage(res.data);
		}).catch(err => {
			console.log(err)
			message.tempmsg.delete();
			message.channel.send(`${message.author} Oops! Não encontrei nenhum cosmético para sua pesquisa "${cosmetic}"`).then(msg => {
				msg.delete(10000)
			});
		});
	} else {
		Fortnite.CosmeticsSearch(data).then(res => {
			GetImage(res.data);
		}).catch(err => {
			message.tempmsg.delete();
			message.channel.send(`${message.author} Oops! Não encontrei nenhum cosmético para sua pesquisa "${cosmetic}"`).then(msg => {
				msg.delete(10000)
			});
		});
	}
	async function GetImage(itemdata) {
		var itemimage;
		if (itemdata.images.featured) {
			itemimage = await Jimp.read(itemdata.images.featured);
		} else if (itemdata.images.icon) {
			itemimage = await Jimp.read(itemdata.images.icon);
		} else if (itemdata.images.smallIcon) {
			itemimage = await Jimp.read(itemdata.images.smallIcon);
		}
		var background = await Jimp.read('./src/data/images/rarities/Common.png');
		if (itemdata.series && itemdata.series.backendValue == "MarvelSeries") {
			background = await Jimp.read('./src/data/images/series/MarvelSeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "ShadowSeries") {
			background = await Jimp.read('./src/data/images/series/ShadowSeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "LavaSeries") {
			background = await Jimp.read('./src/data/images/series/LavaSeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "FrozenSeries") {
			background = await Jimp.read('./src/data/images/series/FrozenSeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "CUBESeries") {
			background = await Jimp.read('./src/data/images/series/CUBESeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "CreatorCollabSeries") {
			background = await Jimp.read('./src/data/images/series/CreatorCollabSeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "SlurpSeries") {
			background = await Jimp.read('./src/data/images/series/SlurpSeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "DCUSeries") {
			background = await Jimp.read('./src/data/images/series/DCUSeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "ColumbusSeries") {
			background = await Jimp.read('./src/data/images/series/ColumbusSeries.png');
		} else if (itemdata.series && itemdata.series.backendValue == "PlatformSeries") {
			background = await Jimp.read('./src/data/images/series/PlatformSeries.png');
		} else if (!itemdata.series) {
			background = await Jimp.read(`./src/data/images/rarities/${itemdata.rarity.backendValue.split("EFortRarity::")[1]}.png`);
		}
		background.blit(itemimage.resize(256, 256), 0, 0);
		Jimp.loadFont("./src/data/fonts/burbark/burbark_20.fnt").then(font => {
			const textheight = Jimp.measureTextHeight(font, itemdata.name.toUpperCase(), 240);
			background.blit(overlay, 0, 0);
			var textpos;
			if (textheight <= 22) {
				textpos = 210;
			} else {
				textpos = 198;
			}
			background.print(font, 8, textpos, {
				text: itemdata.name.toUpperCase(),
				alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
			}, 240);
			return background;
		}).then(background => {
			background.write(`./src/temp/cosmetic/${itemdata.id}.png`);
			setTimeout(function() {
				message.tempmsg.delete();
				message.channel.send(`🔹 ${message.author} Aqui Está:`,new discord.Attachment(`./src/temp/cosmetic/${itemdata.id}.png`)).then(() => {
					fs.readdir("./src/temp/cosmetic/", (err, files) => {
						if (err) return;
						files.forEach(file => {
							fs.unlink(`./src/temp/cosmetic/${file}`, function (err) {
								if (err) throw err;
							});
						});
					});
				});
			}, 1000);
		});
	}
}