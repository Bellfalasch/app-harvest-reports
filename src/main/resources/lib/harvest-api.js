var libs = {
	portal: require('/lib/xp/portal'),
	httpClient: require('/lib/http-client'),
	util: require('/lib/enonic/util')
};

var conf = {
	contentType: 'application/json'
};

function request(settings) {
	var siteConfig = libs.portal.getSiteConfig();
	conf.token = siteConfig.token;
	conf.account = siteConfig.account;

	var appendix = '?';
	if (settings.params) {
		appendix += JSON.stringify(settings.params,"=").replace(/g;/,"&");
	}
	log.info(appendix);

	var params = {
		url: 'https://api.harvestapp.com/v2/' + settings.endpoint + appendix,
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + conf.token,
			'Harvest-Account-Id': conf.account,
			'User-Agent': 'Enonic XP - App: Harvest report (alpha)'
		},
		connectionTimeout: 3000,
		readTimeout: 3000,
		contentType: conf.contentType
	};

	log.info("REQUEST:");
	libs.util.log(params);

	log.info("RESPONSE:");
	var response = libs.httpClient.request(params);
	libs.util.log(response);

	log.info(response.status);
	var json = null;
	if (response.status === 200) {
		if (response.body !== null) {
			json = response.body;
			json = JSON.parse(json);
			libs.util.log(json);
		}
	}

}

// We need to wrap functionality into services to be able to control access better since services exposes URL endpoints by default.
exports.clients = function() {
	request({
		'endpoint': 'clients',
		'params': {}
	});
};

exports.contacts = function() {
	request({
		'endpoint': 'contacts',
		'params': {}
	});
};

exports.projects = function() {
	request({
		'endpoint': 'projects',
		'params': {}
	});
};

// TIME ENTRIES
// http://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/
exports.time_entries = function(params) {
	// Safely take care of all incoming settings and set defaults, for use in current scope only
	var settings = {
		user_id: params.user_id || null,
		client_id: params.client_id || null,
		project_id: params.project_id || null,
		is_billed: params.is_billed || null,
		updated_since: params.updated_since || null,
		from: params.from || null,
		to: params.to || null,
		page: params.page || 1,
		per_page: params.per_page || 100,
	};
	if (params) {
		request({
			'endpoint': 'time_entries',
			'params': settings
		});
	}
};
