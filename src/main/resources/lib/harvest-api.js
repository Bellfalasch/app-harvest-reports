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

	var params = {
		url: 'https://' + conf.account + '.harvestapp.com/' + params.endpoint + '',
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache',
			'Accept': conf.contentType,
			'Content-Type': conf.contentType,
			'Authorization': 'Basic ' + conf.auth
		}
	};
	log.info("REQUEST:");
	libs.util.log(params);
	log.info("RESPONSE:");
	var response = libs.httpClient.request(params);

	libs.util.log(response);
};
