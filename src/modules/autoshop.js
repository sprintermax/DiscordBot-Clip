const autoshopworker = require("./autoshop_run.js");
const request = require('request');
const discord = require('discord.js');

module.exports = async (client) => {
	checkstore(client)
}

function checkstore(client) {
	client.clipdb.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
		autoshop = items[0].autoshop;
		CheckHash(client, autoshop);
	});
	setTimeout(function() {
		checkstore(client)
	}, 45000);
}

const requestcfg = {
	url: 'https://fortnite-api.com/v2/shop/br/combined?language=pt-BR',
    method: 'GET'/*,
    headers: {
        'Authorization': client.userconfig.ftnconfig.fortnite_api_com_apikey,
    }*/
};

async function CheckHash(client, autoshop) {
	shophash = autoshop.lasthash;

	request(requestcfg, async (err, res, body) => {
		if (err) {
			console.error(`Erro ao conectar a API: ${err.message}`);
			return;
		}
		if (res.statusCode != 200) {
			console.error(`O Status Code recebido é direrente do esperado (200): ${res.statusCode}`);
			return;
		}
	
		const shop = JSON.parse(body);
		const shopitemcount = shop.data.featured.entries.length + shop.data.daily.entries.length;
		const currentdate = shop.data.date.replace("T","-").split(`-`);

		if (shop.data.hash != shophash) {
			status = autoshop.enabled;
			shophash = shop.data.hash;
			client.clipdb.updateOne({"DBNameID":"ClipDB"}, {'$set': { autoshop: { enabled: status, lasthash: shophash } } }, (err, item) => {
				if (err) console.error(err)
			});
			if (autoshop.enabled == "true") {
				autoshopworker(client, shop.data);
				console.log(`[INFO] Loja Detectada, ${shopitemcount} itens encontrados. Data: ${currentdate[2]}/${currentdate[[1]]}/${currentdate[0]}. Hash: "${shop.data.hash}"`);
				client.channels.get("745411460758241331").send(`**__Loja de Itens Detectada:__**\n**-Itens encontrados:** \`${shopitemcount}\`\n**-Data:** \`${currentdate[2]}/${currentdate[[1]]}/${currentdate[0]}\`\n**-Hash:** \`${shop.data.hash}\``, new discord.Attachment(Buffer.from(JSON.stringify(shop), 'utf-8'), `shopdata.json`));
			}
		}
	});
}