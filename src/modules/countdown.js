module.exports = async (client) => {
	countdown(client)
}

function countdown(client) {
		client.clipdb.find({"DBNameID":"ClipDB"}).toArray((err, items) => {
		countdowndb = items[0].countdown;
		countmessage = countdowndb.message;
		if (countdowndb.enabled == "true") {
			
			var enddate = new Date(countdowndb.enddate);
			var nowdate = new Date().getTime();
			var distance = enddate - nowdate;
			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			client.user.setActivity(`${countmessage} ${days} Dias, ${hours} Horas e ${minutes} Minutos!`, {type: 'WATCHING'});
			if (distance < 0) {
				client.user.setActivity('Alegria e Organização nos Chats', {type: 'PLAYING'});
				client.clipdb.updateOne({"DBNameID":"ClipDB"}, {'$set': { countdown: { enabled: "false", enddate: "EXPIRED", message: countmessage } } }, (err, item) => {
					if (err) console.error(err);
				});
			}
		}
		setTimeout(function() {
			countdown(client)
		}, 60000);
	});
}