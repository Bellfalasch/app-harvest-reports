var libs = {
	portal: require('/lib/xp/portal'),
	httpClient: require('/lib/http-client'),
	util: require('/lib/enonic/util');
};

var conf = {
	contentType: 'application/json',
};

exports.get = function(req){
	var siteConfig = libs.portal.getSiteConfig();
	conf.account = siteConfig.account;
	conf.user = siteConfig.user;
	conf.pass = siteConfig.pass;

	var response = libs.httpClient.request({
		url: 'https://' + conf.account + '.harvestapp.com',
		method: 'POST',
		headers: {
			'Cache-Control': 'no-cache',
			'Accept': conf.contentType,
			'Authorization': btoa(conf.user + ':' + conf.pass)
		},
		connectionTimeout: 20000,
		readTimeout: 5000,
		body: '{"id": 123}',
		contentType: conf.contentType
	});
};
