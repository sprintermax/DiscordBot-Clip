module.exports = async client => {
	client.user.setStatus("offline");
	console.log('[INFO] A Clip foi desligada!');
}