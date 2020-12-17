const request = require('request-promise');
const mergeImg = require("merge-img");
const discord = require('discord.js');
const Jimp = require("jimp");
const fs = require("fs");

exports.run = async (client, message, args, database) => {
	message.delete();
	if (client.dbdata.autoshop.enabled == "true") {
		message.channel.send(`${message.author} A Loja Automática está ativa! Caso queira usar o comando manual da loja, desligue o módulo usando \`${client.userconfig.botsettings.prefix}autoshop off\`.`).then(msg => msg.delete(10000));
	} else {
		CleanUpFiles();
		if((!message.member.hasPermission("MANAGE_MESSAGES")) && (!client.whitelisted)) return message.channel.send(`${message.author} Você não tem permissão para executar esse comando!`).then(msg => msg.delete(10000));
		var channel;
		if (args.length >= 1) {
			if (args[0].startsWith('<#') && args[0].endsWith('>')) {
				channel = message.mentions.channels.first();
			} else {
				channel = client.channels.get(args[0]);
			}
		}
		message.channel.send(`<a:cliploading:680776857854935092> Estou verificando a loja, aguarde um momento...`).then(msg => {
			message.tempmsg = msg;
		});
		const overlaylarge = await Jimp.read('./src/data/images/LargeOverlay.png');
		const overlaysmall = await Jimp.read('./src/data/images/SmallOverlay.png');
		const background = await Jimp.read('./src/data/images/Background.png');
		const vbucksicon = await Jimp.read('./src/data/images/VBucks.png');
		var finishedtasks = 0;
		var skippeditems = 0;
		var lastitem = 0;
		var storedata = [];
		var currentdate = [];
		var store = [];
		const requestshop = await request({
			url: 'https://fortnite-api.com/v2/shop/br?language=pt-BR',
			json: true,
			headers: { 
				'x-api-key': client.userconfig.ftnconfig.fortnite_api_com_apikey
			}
		});
		var storelength = 0;
		currentdate = requestshop.data.date.replace("T","-").split(`-`);
		if (requestshop.data.featured) storelength += requestshop.data.featured.entries.length;
		if (requestshop.data.daily) storelength += requestshop.data.daily.entries.length;
		if (requestshop.data.specialFeatured) storelength += requestshop.data.specialFeatured.entries.length;
		if (requestshop.data.specialDaily) storelength += requestshop.data.specialDaily.entries.length;
		if (requestshop.data.featured) {
			requestshop.data.featured.entries.forEach(destaque => {
				GetImage(destaque, storelength);
			});
		}
		if (requestshop.data.daily) {
			requestshop.data.daily.entries.forEach(diario => {
				GetImage(diario, storelength);
			});
		}
		if (requestshop.data.specialFeatured) {
			requestshop.data.specialFeatured.entries.forEach(specialdestaque => {
				GetImage(specialdestaque, storelength);
			});
		}
		if (requestshop.data.specialDaily) {
			requestshop.data.specialDaily.entries.forEach(specialdiario => {
				GetImage(specialdiario, storelength);
			});
		}

		async function GetImage(storeitem, storelength) {
			var itemimage;
			if (storeitem.items[0].type.backendValue == "AthenaItemWrap") {
				if (storeitem.items[0].images.icon) {
					itemimage = await Jimp.read(storeitem.items[0].images.icon);
				} else if (storeitem.items[0].images.featured) {
					itemimage = await Jimp.read(storeitem.items[0].images.featured);
				} else if (storeitem.items[0].images.smallIcon) {
					itemimage = await Jimp.read(storeitem.items[0].images.smallIcon);
				}
			} else {
				if (storeitem.items[0].images.featured) {
					itemimage = await Jimp.read(storeitem.items[0].images.featured);
				} else if (storeitem.items[0].images.icon) {
					itemimage = await Jimp.read(storeitem.items[0].images.icon);
				} else if (storeitem.items[0].images.smallIcon) {
					itemimage = await Jimp.read(storeitem.items[0].images.smallIcon);
				}
			}
			if (storeitem.bundle && storeitem.bundle.image) {
				itemimage = await Jimp.read(storeitem.bundle.image);
			}
			if (!itemimage) itemimage = await Jimp.read('./src/data/images/QuestionMark.png');
			var hasseries = storeitem.items[0].series ? true : false;
			var itemimg = await Jimp.read('./src/data/images/rarities/Common.png');
			if (hasseries && storeitem.items[0].series.backendValue == "MarvelSeries") {
				itemimg = await Jimp.read('./src/data/images/series/MarvelSeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "ShadowSeries") {
				itemimg = await Jimp.read('./src/data/images/series/ShadowSeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "LavaSeries") {
				itemimg = await Jimp.read('./src/data/images/series/LavaSeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "FrozenSeries") {
				itemimg = await Jimp.read('./src/data/images/series/FrozenSeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "CUBESeries") {
				itemimg = await Jimp.read('./src/data/images/series/CUBESeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "CreatorCollabSeries") {
				itemimg = await Jimp.read('./src/data/images/series/CreatorCollabSeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "SlurpSeries") {
				itemimg = await Jimp.read('./src/data/images/series/SlurpSeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "DCUSeries") {
				itemimg = await Jimp.read('./src/data/images/series/DCUSeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "ColumbusSeries") {
				itemimg = await Jimp.read('./src/data/images/series/ColumbusSeries.png');
			} else if (hasseries && storeitem.items[0].series.backendValue == "PlatformSeries") {
				itemimg = await Jimp.read('./src/data/images/series/PlatformSeries.png');
			} else {
				itemimg = await Jimp.read(`./src/data/images/rarities/${storeitem.items[0].rarity.backendValue.split("EFortRarity::")[1]}.png`);
			}
			///////////////////////////////////////////////
			var subitems = [];
			if (storeitem.items.length >= 2) {
				var subitemid = 0;
				storeitem.items.forEach(subitem => {
					var subitemimage;
					if (subitemid == 0) {
						subitemid +=1;
					} else {
						if (subitem.images.icon) {
							subitemimage = subitem.images.icon;
							subitemid += 1;
						} else if (subitem.images.featured) {
							subitemimage = subitem.images.featured;
							subitemid += 1;
						} else if (subitem.images.smallIcon) {
							subitemimage = subitem.images.smallIcon;
							subitemid += 1;
						}
						subitems.push(`${subitemimage}`);
					}
				});
				//console.log(`SUBITENS: `, subitems);
			}
			///////////////////////////////////////////////
			itemimg.blit(itemimage.resize(256, 256), 0, 0);
			Jimp.loadFont("./src/data/fonts/burbark/burbark_20.fnt").then(font20 => {
				Jimp.loadFont("./src/data/fonts/burbark/burbark_16.fnt").then(font16 => {
					const textheight = Jimp.measureTextHeight(font20, (storeitem.bundle ? storeitem.bundle.name : storeitem.items[0].name).toUpperCase(), 240);
					const vbuckswidth = 26 + 5 + Jimp.measureText(font20, `${storeitem.finalPrice}`);
					var textpos;
					if (textheight <= 22) {
						itemimg.blit(overlaysmall, 0, 0);
						textpos = 198;
					} else {
						itemimg.blit(overlaylarge, 0, 0);
						textpos = 178;
					}
					if (subitems.length >= 1 || storeitem.bundle) {
						const subitenssize = Jimp.measureText(font16, `${(storeitem.bundle ? (subitems.length+1) : ("+" + subitems.length))}`);
						var subitemtag = new Jimp((subitenssize + 4), 20, 0x0, (err) => {
							if (err) throw err;
						});
						subitemtag.print(font16, 2, 4, `${(storeitem.bundle ? (subitems.length+1) : ("+" + subitems.length))}`);
						itemimg.blit(subitemtag, (243 - subitenssize), 226);
					}
					let vbucks = new Jimp(vbuckswidth, 26, 0x0, (err) => {
						if (err) throw err;
					});
					vbucks.blit(vbucksicon.resize(26, 26), 1, 0);
					itemimg.print(font20, 8, textpos, {
						text: (storeitem.bundle ? storeitem.bundle.name : storeitem.items[0].name).toUpperCase(),
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
					}, 240);
					vbucks.print(font20, 31, 5, {
						text: `${storeitem.finalPrice}`,
					});
					itemimg.blit(vbucks, (128 - (vbuckswidth/2)), 220);
					return itemimg;
				}).then(itemimg => {
					itemimg.write(`./src/temp/store/items/${storeitem.bundle ? "Bundle" : "NotBundle"}_${storeitem.items[0].series ? storeitem.items[0].series.backendValue : "ZSeries"}_${(storeitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Legendary") ? "ALegendary" : (storeitem.items[0].rarity.backendValue.split("EFortRarity::")[1] == "Common") ? "ZCommon" : storeitem.items[0].rarity.backendValue.split("EFortRarity::")[1]}_${storeitem.items[0].id}_${storeitem.offerId.split(":/")[1]}.png`);
					finishedtasks += 1;
					if (finishedtasks == (storelength - skippeditems)) {
						var checkedfiles = 0;
						var rowdata = [];
						var rolls = 1;
						setTimeout(function() {
							fs.readdir("./src/temp/store/items/", (err, files) => {
								if (err) return;
								if ((((storelength - skippeditems) == 6) || ((storelength - skippeditems) == 12) || ((storelength - skippeditems) == 18) || ((storelength - skippeditems) == 21)) || (((storelength - skippeditems) >= 24) && ((storelength - skippeditems) % 8 == 0))) {
									lastitem = 1;
								}
								if ((storelength - skippeditems) > 18) {
									if ((storelength - skippeditems) > 21) { 
										var collums = 8; 
									} else {
										var collums = 7; 
									} 
								} else { 
									var collums = 6;
								}
								files.forEach(file => {
									store.push(`./src/temp/store/items/${file}`);
									if (!storedata["roll"+rolls]) storedata["roll"+rolls] = [];
									storedata["roll"+rolls] += `|||./src/temp/store/items/${file}`;
									rowdata["roll"+rolls] = storedata["roll"+rolls].slice(3).split("|||");
									checkedfiles += 1;
									if (checkedfiles >= collums) {
										checkedfiles = 0;
										rolls += 1;
									}
								});
								message.tempmsg.edit(`<a:cliploading:680776857854935092> Criando a imagem da loja, só mais uns instantes...`);
								storeheight = rolls * 256;
								var mergey = 0;
								var data;
								firstimage = rowdata[`roll1`][0];
								while (mergey < (rolls - lastitem)) {
									data = rowdata[`roll${mergey+1}`];
									Merger1(data, mergey);
									mergey += 1;
								};
								setTimeout(function() {
									fs.readdir("./src/temp/store/final/", (err, files) => {
										if (err) return console.log(err);
										var filedata = [];
										/*if (files.length == mergey) {*/
											files.forEach(file => {
												filedata.push(`./src/temp/store/final/${file}`);
											});
											Merger2(filedata);
										/*} else {
											message.tempmsg.edit(`Oops! Ocorreu um problema inesperado, tente novamente.`).then(msg => {
												msg.delete(10000)
											});
										}*/
									});
								}, 3000);
							});
						}, 5000);
					}
				});
			});
		}
		async function Merger1(data, mergey) {
			await mergeImg(data, {offset: 15, color: 0x0})
			.then((img) => {
				img.write(`./src/temp/store/final/final${mergey}.png`);
			});
		}
	
		async function Merger2(data) {
			await mergeImg(data, {direction: true, align: `center`, offset: 15, color: 0x0, margin: `300 50 50 50`})
			.then((img) => {
				Jimp.read(img.bitmap).then(image => {
					img.bitmap.width = Math.max(1169, img.bitmap.width);
					Jimp.loadFont("./src/data/fonts/burbark/burbark_200.fnt").then(titlefont => {
						Jimp.loadFont("./src/data/fonts/burbark/burbark_64.fnt").then(datefont => {
							background.resize(img.bitmap.width, img.bitmap.height);
							const titlewidth = Jimp.measureText(titlefont, `LOJA DE ITENS`);
							background.print(titlefont, ((img.bitmap.width/2) - (titlewidth/2)), 35, "LOJA DE ITENS");
							const datewidth = Jimp.measureText(datefont, `DIA ${currentdate[2]}/${currentdate[[1]]}/${currentdate[0]}`);
							background.print(datefont, ((img.bitmap.width/2) - (datewidth/2)), 215, `DIA ${currentdate[2]}/${currentdate[[1]]}/${currentdate[0]}`);
							background.composite(image, ((img.bitmap.width/2) - (image.bitmap.width/2)), 0, {
								mode: Jimp.BLEND_SOURCE_OVER
							});
							return background;
						}).then(finalimage => {
							finalimage.write(`./src/temp/store/finalimage.png`);
							setTimeout(function() {
								message.tempmsg.delete();
								if (!channel) {
									message.channel.send(new discord.Attachment("./src/temp/store/finalimage.png")).then(msg => {
										msg.react("559669236058816532").then(() => {
											msg.react("559669236046495746");
										});
										CleanUpFiles();
									});
								} else {
									if((channel.permissionsFor(message.author).has('SEND_MESSAGES')) || (client.whitelisted)) {
										message.client.channels.get(channel.id).send(new discord.Attachment("./src/temp/store/finalimage.png")).then(msg => {
											message.channel.send(`🔹 ${message.author} Enviei! Confira se está tudo certo com a mensagem no Chat especificado: https://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`);
											msg.react("559669236058816532").then(() => {
												msg.react("559669236046495746");
											});
											CleanUpFiles();
										});
									} else {
									  message.channel.send(`${message.author} Você não tem permissão para mandar mensagens no Chat mencionado!`).then(msg => msg.delete(10000));
									}
								}
							}, 1500);
						});
					});
				  }).catch(err =>{
					console.log(err);
				  })
			});
		}
	}
}

async function CleanUpFiles() {
	fs.access("./src/temp/store/", function(error) {
		if (error) {
			fs.mkdir('./src/temp/store/', { recursive: true }, (err) => { if (err) throw err; });
		} else {
			fs.readdir("./src/temp/store/", (err, files) => {
				if (err) return;
				files.forEach(file => {
					if (file == "finalimage.png"){
						fs.unlink(`./src/temp/store/finalimage.png`, function (err) {
							if (err) throw err;
						});
					}
				});
			});
		}
	});
	fs.access("./src/temp/store/items/", function(error) {
		if (error) {
			fs.mkdir('./src/temp/store/items/', { recursive: true }, (err) => { if (err) throw err; });
		} else {
			fs.readdir("./src/temp/store/items/", (err, files) => {
				if (err) return;
				files.forEach(file => {
					fs.unlink(`./src/temp/store/items/${file}`, function (err) {
						if (err) throw err;
					});
				});
			});
		}
	});
	fs.access("./src/temp/store/final/", function(error) {
		if (error) {
			fs.mkdir('./src/temp/store/final/', { recursive: true }, (err) => { if (err) throw err; });
		} else {
			fs.readdir("./src/temp/store/final/", (err, files) => {
				if (err) return;
				files.forEach(file => {
					fs.unlink(`./src/temp/store/final/${file}`, function (err) {
						if (err) throw err;
					});
				});
			});
		}
	});
}