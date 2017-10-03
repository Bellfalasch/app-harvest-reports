var libs = {
	portal: require('/lib/xp/portal'),
	util: require('/lib/enonic/util'),
	harvestApi: require('/lib/harvest-api')
};

// We need to wrap functionality into services to be able to control access better since services exposes URL endpoints by default.
exports.all = function() {
	libs.harvestApi.request({
		'endpoint': 'contacts'
	});
};
