var libs = {
	portal: require('/lib/xp/portal'),
	util: require('/lib/enonic/util'),
	harvest: require('/lib/harvest-api')
};

exports.get = function() {
	libs.harvest.projects();
}
