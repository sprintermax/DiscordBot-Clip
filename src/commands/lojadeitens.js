const request = require('request');
const discord = require('discord.js');
const Jimp = require("jimp");

const sortorder = {
    special: 0,
    bundle: 1,
    series: {
        AnnualPassSeries: 2.00,
        ColumbusSeries: 2.01,
        CreatorCollabSeries: 2.02,
        CUBESeries: 2.03,
        DCUSeries: 2.04,
        FrozenSeries: 2.05,
        LavaSeries: 2.06,
        MarvelSeries: 2.07,
        PlatformSeries: 2.08,
        SlurpSeries: 2.09,
        ShadowSeries: 2.10,
        OtherSeries: 2.11
    },
    mythic: 3,
    exotic: 4,
    legendary: 5,
    epic: 6,
    rare: 7,
    uncommon: 8,
    common: 9,
    other: 10
}

const requestcfg = {
	url: 'https://fortnite-api.com/v2/shop/br/combined?language=pt-BR',
    method: 'GET'/*,
    headers: {
        'Authorization': client.userconfig.ftnconfig.fortnite_api_com_apikey,
    }*/
};


exports.run = async (client, message, args, database) => {
	message.delete();
	if((!message.member.roles.cache.some(role => role.id == "499227407123742721")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete({ timeout: 10000 }));
	var shopitems;
	var itemimages = [];
	var channel;
	if (args.length >= 1) {
		if (args[0].startsWith('<#') && args[0].endsWith('>')) {
			channel = message.mentions.channels.first();
		} else {
			channel = client.channels.cache.get(args[0]);
		}
	}
	message.channel.send(`<a:cliploading:680776857854935092> Estou verificando a loja, aguarde um momento...`).then(msg => {
		message.tempmsg = msg;
	});
	request(requestcfg, async (err, res, body) => {
		if (err) {
			console.error(`Erro ao conectar a API: ${err.message}`);
			message.tempmsg.edit(`🔴 ${message.author} Erro ao conectar a API: ${err.message}`);
			return;
		}
		if (res.statusCode != 200) {
			console.error(`O Status Code recebido é direrente do esperado (200): ${res.statusCode}`);
			message.tempmsg.edit(`🔴 ${message.author} O Status Code recebido é direrente do esperado (200): ${res.statusCode}`);
			return;
		}
	
		const shop = JSON.parse(body);
		const shopitemcount = shop.data.featured.entries.length + shop.data.daily.entries.length;
		const currentdate = shop.data.date.replace("T","-").split(`-`);
		//console.log(`[INFO] Loja verificada com sucesso, ${shopitemcount} itens encontrados. Data: ${currentdate[2]}/${currentdate[[1]]}/${currentdate[0]} Hash: "${shop.data.hash}"`);
		//client.channels.cache.get("745411460758241331").send(`**__Loja de Itens Detectada:__**\n**-Itens encontrados:** \`${shopitemcount}\`\n**-Data:** \`${currentdate[2]}/${currentdate[[1]]}/${currentdate[0]}\`\n**-Hash:** \`${shop.data.hash}\``, new discord.MessageAttachment(Buffer.from(JSON.stringify(shop), 'utf-8'), `shopdata.json`));
		Main(shop.data);
	});
	async function Main(shopdata) {
		//console.log("[INFO] Gerando a imagem da Loja");
		message.tempmsg.edit(`🟡 ${message.author} Gerando a imagem da Loja...`);
		shopitems = shopdata.daily.entries.concat(shopdata.featured.entries);
		shopitems.forEach(shopitem => {
			CreateImage(shopitem, shopdata);
		});
	}
	async function CreateImage(shopitem, shopdata) {
		var background;
		var itemimage;
		const currentdate = shopdata.date.replace("T","-").split(`-`);
		const overlaylarge = await Jimp.read('./src/data/images/LargeOverlay.png');
		const overlaysmall = await Jimp.read('./src/data/images/SmallOverlay.png');
		const mainshop = await Jimp.read('./src/data/images/Background.png');
		const vbucksicon = await Jimp.read('./src/data/images/VBucks.png');
		try {
			itemimage = await Jimp.read(shopitem.bundle.image);
			itemimage.sortorder = sortorder.bundle;
		} catch {
			try {
				if (shopitem.items[0].type.backendValue == "AthenaItemWrap") {
					if (shopitem.items[0].images.icon) {
						itemimage = await Jimp.read(shopitem.items[0].images.icon);
					} else if (shopitem.items[0].images.featured) {
						itemimage = await Jimp.read(shopitem.items[0].images.featured);
					} else if (shopitem.items[0].images.smallIcon) {
						itemimage = await Jimp.read(shopitem.items[0].images.smallIcon);
					}
				} else if (shopitem.items[0].images.featured) {
					itemimage = await Jimp.read(shopitem.items[0].images.featured);
				} else if (shopitem.items[0].images.icon) {
					itemimage = await Jimp.read(shopitem.items[0].images.icon);
				} else if (shopitem.items[0].images.smallIcon) {
					itemimage = await Jimp.read(shopitem.items[0].images.smallIcon);
				}
			} catch {
				itemimage = await Jimp.read('./src/data/images/QuestionMark.png');
			}
		}
		try {
			background = await Jimp.read(`./src/data/images/series/${shopitem.items[0].series.backendValue}.png`);
			if (!itemimage.sortorder) itemimage.sortorder = sortorder.series[shopitem.items[0].series.backendValue];
		} catch {
			try {
				background = await Jimp.read(`./src/data/images/rarities/${shopitem.items[0].rarity.backendValue.split("EFortRarity::")[1]}.png`);
				if (!itemimage.sortorder && shopitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Common") itemimage.sortorder = sortorder.common;
				if (!itemimage.sortorder && shopitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Uncommon") itemimage.sortorder = sortorder.uncommon;
				if (!itemimage.sortorder && shopitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Rare") itemimage.sortorder = sortorder.rare;
				if (!itemimage.sortorder && shopitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Epic") itemimage.sortorder = sortorder.epic;
				if (!itemimage.sortorder && shopitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Legendary") itemimage.sortorder = sortorder.legendary;
				if (!itemimage.sortorder && shopitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Transcendent") itemimage.sortorder = sortorder.exotic;
				if (!itemimage.sortorder && shopitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Mythic") itemimage.sortorder = sortorder.mythic;
			} catch {
				background = await Jimp.read(`./src/data/images/rarities/Common.png`);
				if (!itemimage.sortorder) itemimage.sortorder = sortorder.other;
			}
		}
		background.blit(itemimage.resize(256, 256), 0, 0);
		Jimp.loadFont("./src/data/fonts/burbark/burbark_20.fnt").then(font20 => {
			Jimp.loadFont("./src/data/fonts/burbark/burbark_16.fnt").then(font16 => {
				const textheight = Jimp.measureTextHeight(font20, (shopitem.bundle ? shopitem.bundle.name : shopitem.items[0].name).toUpperCase(), 245);
				const vbuckswidth = 26 + 5 + Jimp.measureText(font20, `${shopitem.finalPrice}`);
				var textpos;
				if (textheight <= 22) {
					background.blit(overlaysmall, 0, 0);
					textpos = 198;
				} else {
					background.blit(overlaylarge, 0, 0);
					textpos = 178;
				}
				if (shopitem.items.length >= 2 || shopitem.bundle) {
					const subitenssize = Jimp.measureText(font16, `${(shopitem.bundle ? (shopitem.items.length) : ("+" + (shopitem.items.length-1)))}`);
					var subitemtag = new Jimp((subitenssize + 4), 20, 0x0, (err) => {
						if (err) throw err;
					});
					subitemtag.print(font16, 2, 4, `${(shopitem.bundle ? (shopitem.items.length) : ("+" + (shopitem.items.length-1)))}`);
					background.blit(subitemtag, (243 - subitenssize), 226);
				}
				let vbucks = new Jimp(vbuckswidth, 26, 0x0, (err) => {
					if (err) throw err;
				});
				vbucks.blit(vbucksicon.resize(26, 26), 1, 0);
				background.print(font20, 8, textpos, {
					text: (shopitem.bundle ? shopitem.bundle.name : shopitem.items[0].name).toUpperCase(),
					alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
				}, 240);
				vbucks.print(font20, 31, 5, {
					text: `${shopitem.finalPrice}`,
				});
				background.blit(vbucks, (128 - (vbuckswidth/2)), 220);
				return background;
			}).then(editeditemimage => {
				editeditemimage.sortorder = itemimage.sortorder;
				itemimages.push(editeditemimage);
				if (itemimages.length == shopitems.length) {
					itemimages.sort((b, a) => {
						return b.sortorder - a.sortorder;
					});
					if (shopitems.length > 18) {
						if (shopitems.length > 21) { 
							var collums = 8; 
						} else {
							var collums = 7; 
						} 
					} else { 
						var collums = 6;
					}
					var storerolls = [];
					var rollid = 0;
					var itemindex = 1;
					itemimages.forEach(item => {
						if (!storerolls[rollid]) {
							storerolls[rollid] = [ item ];
						} else {
							storerolls[rollid].push(item);
						}
						if (itemindex == collums) {
							rollid += 1;
							itemindex = 0;
						}
						itemindex += 1;
					});
					var rolls = [];
					var rollnumber = 0;
					storerolls.forEach(async roll => {
						new Jimp((256 * roll.length) + (15 * (roll.length - 1)), 256, (err, shopline) => {
							var offsetsize = 0;
							roll.forEach(item => {
								shopline.blit(item, offsetsize, 0);
								offsetsize += 256 + 15;
							});
							if (!rolls[0]) {
								rolls = [ shopline ];
							} else {
								rolls.push(shopline);
							}
							rollnumber += 1;
							if (rollnumber == storerolls.length) {
								new Jimp(Math.max(1169, rolls[0].bitmap.width), 0 + (256 * rolls.length) + (15 * (rolls.length - 1)), async (err, finalshopitems) => {
									offsetsize = 0;
									var processedrolls = 0;
									await rolls.forEach(async rollid => {
										finalshopitems.blit(rollid, ((finalshopitems.bitmap.width/2) - (rollid.bitmap.width/2)), offsetsize);
										offsetsize += 256 + 15;
										processedrolls += 1;
										if (processedrolls == rolls.length) {
											Jimp.loadFont("./src/data/fonts/burbark/burbark_200.fnt").then(titlefont => {
												Jimp.loadFont("./src/data/fonts/burbark/burbark_64.fnt").then(datefont => {
													mainshop.resize(finalshopitems.bitmap.width + 100, finalshopitems.bitmap.height + 350);
													const titlewidth = Jimp.measureText(titlefont, `LOJA DE ITENS`);
													mainshop.print(titlefont, ((finalshopitems.bitmap.width/2) - (titlewidth/2)), 35, "LOJA DE ITENS");
													const datewidth = Jimp.measureText(datefont, `DIA ${currentdate[2]}/${currentdate[[1]]}/${currentdate[0]}`);
													mainshop.print(datefont, ((finalshopitems.bitmap.width/2) - (datewidth/2)), 215, `DIA ${currentdate[2]}/${currentdate[[1]]}/${currentdate[0]}`);
													mainshop.composite(finalshopitems, ((mainshop.bitmap.width/2) - (finalshopitems.bitmap.width/2)), 300, {
														mode: Jimp.BLEND_SOURCE_OVER
													});
													return mainshop;
												}).then(finalimage => {
													//console.log("[INFO] Imagem da loja criada");
													finalimage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
														if (!channel) {
															message.channel.send(`🟢 ${message.author} Imagem da loja criada:`, new discord.MessageAttachment(buffer, `loja_${currentdate[2]}-${currentdate[[1]]}-${currentdate[0]}.png`)).then(msg => {
																message.tempmsg.delete();
																msg.react("559669236058816532").then(() => {
																	msg.react("559669236046495746");
																});
															});
														} else {
															if((channel.permissionsFor(message.author).has('SEND_MESSAGES')) || (client.whitelisted)) {
																message.client.channels.cache.get(channel.id).send(new discord.MessageAttachment(buffer, `loja_${currentdate[2]}-${currentdate[[1]]}-${currentdate[0]}.png`)).then(msg => {
																	message.tempmsg.edit(`🟢 ${message.author} Enviei! Confira se está tudo certo com a mensagem no Chat especificado: https://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`);
																	msg.react("559669236058816532").then(() => {
																		msg.react("559669236046495746");
																	});
																});
															} else {
															  message.channel.send(`${message.author} Você não tem permissão para mandar mensagens no Chat mencionado!`).then(msg => msg.delete({ timeout: 10000 }));
															}
														}
													});
												});
											});
										}
									});
								});
							}
						});
					});
				}
			});
		});
	}
}