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
	conf.account = siteConfig.account;
	conf.auth = libs.encoding.base64Encode(siteConfig.user + ':' + siteConfig.password);

	var response = libs.httpClient.request({
		url: 'https://' + conf.account + '.harvestapp.com/' + params.endpoint + '/',
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache',
			'Accept': conf.contentType,
			'Content-Type': conf.contentType,
			'Authorization': 'Basic ' + conf.auth,
			'User-Agent': 'Enonic XP - App: Harvest report (alpha)'
		},
		connectionTimeout: 5000,
		readTimeout: 5000,
		contentType: conf.contentType
	});

	libs.util.log(response);
};
