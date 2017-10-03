var libs = {
	portal: require('/lib/xp/portal'),
	util: require('/lib/enonic/util'),
	contacts: require('/lib/contacts')
};

exports.get = function() {
	libs.contacts.all();
}
