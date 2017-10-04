var libs = {
	portal: require('/lib/xp/portal'),
	thymeleaf: require('/lib/xp/thymeleaf'),
	moment: require("/lib/moment"),
	harvest: require("/lib/harvest-api"),
	util: require("/lib/enonic/util")
};

var timestamp = Date.now();
var view = resolve('harvest.html');

exports.get = function(req) {

    // Variables required by the Launcher Panel
    var adminUrl = libs.portal.url({path: '/admin'})
    var adminAssetsUrl = libs.portal.url({path: "/admin/assets/" + timestamp});
    var assetsUrl = libs.portal.assetUrl({path: ""});

	// Initiate moment() and get this weeks number
	libs.moment().format();
	var weekNow = libs.moment().isoWeek();
	var weekLast = weekNow - 1;

	// Finally do some requests
	var result = libs.harvest.time_entries({
		from: '2017-10-02',
		to: '2017-10-09'
	});
	var entries = null;
	if (result != null) {
		if (result.total_entries != null) {
			if (result.total_entries > 0) {
				entries = result.time_entries;
			}
		}
	}
	log.info("result:");
	libs.util.log(result);

	/*
		TODO: time_entries needs some sorting/config!
		* remove all items that does not bill the client (cost = 0)
		* reverse-sort on date
		* group on projects (sort on name)
		* each group (project) needs to output its own table and data
	*/

    var params = {
        adminUrl: adminUrl,
        assetsUrl: assetsUrl,
		appId: 'harvest',
        appName: 'Harvest Report Tool',
		moment: {
			weekNow: weekNow.toString(),
			weekLast: weekLast.toString()
		},
		time_entries: entries
    };

    return {
		contentType: 'text/html',
        body: libs.thymeleaf.render(view, params)
    };
};
