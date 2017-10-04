var libs = {
	portal: require('/lib/xp/portal'),
	thymeleaf: require('/lib/xp/thymeleaf'),
	moment: require("/lib/moment")
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
	var weekLast = weekNow--;

    var params = {
        adminUrl: adminUrl,
        assetsUrl: assetsUrl,
		appId: 'harvest',
        appName: 'Harvest Report Tool',
		moment: {
			weekNow: weekNow.toString(),
			weekLast: weekLast.toString()
		}
    };

    return {
		contentType: 'text/html',
        body: libs.thymeleaf.render(view, params)
    };
};
