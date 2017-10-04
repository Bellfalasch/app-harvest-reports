var libs = {
	portal: require('/lib/xp/portal'),
	thymeleaf: require('/lib/xp/thymeleaf')
}

var timestamp = Date.now();

exports.get = function(req) {
    var view = resolve('harvest.html');

    // Variables required by the Launcher Panel
    var adminUrl = libs.portal.url({path: '/admin'})
    var adminAssetsUrl = libs.portal.url({path: "/admin/assets/" + timestamp});
    var assetsUrl = libs.portal.assetUrl({path: ""});
    var params = {
        adminUrl: adminUrl,
        assetsUrl: assetsUrl,
		appId: 'harvest',
        appName: 'Harvest Report Tool'
    };

    return {
		contentType: 'text/html',
        body: libs.thymeleaf.render(view, params)
    };
};
