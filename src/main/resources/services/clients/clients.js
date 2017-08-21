var libs = {
	portal: require('/lib/xp/portal'),
	util: require('/lib/enonic/util'),
	clients: require('/lib/clients')
};

exports.get = function() {
	libs.clients.all();
}
