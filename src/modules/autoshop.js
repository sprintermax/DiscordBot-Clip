const autoshopworker = require("./autoshop_run.js");
const request = require('request-promise');

module.exports = async (client) => {
	checkstore(client)
}

function checkstore(client) {
	client.clipdb.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
		autoshop = items[0].autoshop;
		if (autoshop.enabled == "true") {
			CheckHash(client, autoshop);
		}
	});
	setTimeout(function() {
		checkstore(client)
	}, 45000);
}

async function CheckHash(client, autoshop) {
	shophash = autoshop.lasthash;
	const shop = await request({
		url: 'https://fortnite-api.com/v2/shop/br?language=pt-BR',
		headers: { 'x-api-key': client.userconfig.ftnconfig.fortnite_api_com_apikey },
		json: true,
	});
	if (shop.data.hash != shophash) {
		autoshopworker(client, shop);
		status = autoshop.enabled;
		shophash = shop.data.hash;
		client.clipdb.updateOne({"DBNameID":"ClipDB"}, {'$set': { autoshop: { enabled: status, lasthash: shophash } } }, (err, item) => {
			if (err) console.error(err)
		});
	}
}