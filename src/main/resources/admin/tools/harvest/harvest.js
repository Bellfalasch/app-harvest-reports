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
	log.info( libs.moment().isoWeek() );
	var weekNow = libs.moment().isoWeek();
	var weekLast = weekNow - 1;

	// Finally do some requests
	var result = libs.harvest.time_entries({
		from: '2017-10-02T00:00:00Z',
		to: '2017-10-09T00:00:00Z'
	});
	var entries = null;
	if (result != null) {
		if (result.total_entries != null) {
			if (result.total_entries > 0) {
				entries = result.total_entries;
			}
		}
	}
	libs.util.log(result);

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
