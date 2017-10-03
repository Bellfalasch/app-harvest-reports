var libs = {
	portal: require('/lib/xp/portal'),
	httpClient: require('/lib/http-client'),
	util: require('/lib/enonic/util'),
	encoding: require('/lib/text-encoding')
};

var conf = {
	contentType: 'application/json'
};

exports.request = function(params){
	var siteConfig = libs.portal.getSiteConfig();
	conf.token = siteConfig.token;
	conf.account = siteConfig.account;

	var params = {
		url: 'https://api.harvestapp.com/v2/' + params.endpoint + '/',
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache',
			'Accept': conf.contentType,
			'Authorization': 'Bearer ' + conf.token,
			'Harvest-Account-Id': conf.account,
			'User-Agent': 'Enonic XP - App: Harvest report (alpha)',
			'Content-Type': conf.contentType + '; charset=utf-8'
		},
		connectionTimeout: 5000,
		readTimeout: 5000,
		contentType: conf.contentType
	};
	log.info("REQUEST:");
	libs.util.log(params);
	log.info("RESPONSE:");
	var response = libs.httpClient.request(params);

	libs.util.log(response);
};
