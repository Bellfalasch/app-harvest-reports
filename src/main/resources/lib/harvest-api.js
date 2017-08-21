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
	conf.user = siteConfig.user;
	conf.pass = siteConfig.pass;
	conf.auth = libs.encoding.base64Encode(conf.user + ':' + conf.pass);

	var response = libs.httpClient.request({
		url: 'https://' + conf.account + '.harvestapp.com/' + params.endpoint,
		method: 'POST',
		headers: {
			'Cache-Control': 'no-cache',
			'Accept': conf.contentType,
			'Authorization': conf.auth
		},
		connectionTimeout: 5000,
		readTimeout: 5000,
		contentType: conf.contentType
	});

	libs.util.log(response);
};
