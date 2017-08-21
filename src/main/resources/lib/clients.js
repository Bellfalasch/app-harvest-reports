var libs = {
	portal: require('/lib/xp/portal'),
	util: require('/lib/enonic/util'),
	harvestApi: require('/lib/harvest-api')
};

exports.all = function() {
	libs.harvestApi.request({
		'endpoint': 'clients'
	});
};
