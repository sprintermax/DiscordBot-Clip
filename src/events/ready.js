const countdown = require("../modules/countdown.js");
const autoshop = require("../modules/autoshop.js");

module.exports = async client => {
	client.user.setStatus("online");
	console.log('[INFO] A Clip foi iniciada!');
	client.user.setActivity('Alegria e Organização nos Chats', {type: 'PLAYING'});
	countdown(client);
	autoshop(client);
}