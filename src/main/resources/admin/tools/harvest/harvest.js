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

	// Initiate moment() and get this weeks number, spanning dates, and more.
	libs.moment().format();
	var weekNow  = libs.moment().isoWeek();
	var weekLast = weekNow - 1; // TODO: unsafe, might yeild 0
	var weekLastBegin = libs.moment().week(weekLast).startOf('isoweek').format('YYYY-MM-DD');
	var weekLastEnd   = libs.moment().week(weekLast).endOf('isoweek').format('YYYY-MM-DD');

	var dateSpanFrom = libs.moment().startOf('isoweek').format('YYYY-MM-DD');
	var dateSpanTo  = libs.moment().endOf('isoweek').format('YYYY-MM-DD');
	if (req.params && req.params.from && req.params.to) {
		dateSpanFrom = req.params.from;
		dateSpanTo   = req.params.to;
	}

	// Finally do some requests
	var result = libs.harvest.time_entries({
		from: dateSpanFrom,
		to: dateSpanTo
	});
	var entries_raw = null;
	var entries_done = [];
	if (result != null) {
		if (result.total_entries != null) {
			if (result.total_entries > 0) {
				entries_raw = result.time_entries;
			}
		}
	}
//	log.info("result:");
//	libs.util.log(result);

	// Remove all entries that are not billable
	// And reverse the order
	for (var i = entries_raw.length - 1; i >= 0; i--) {
		if ( !(entries_raw[i].billable == false || entries_raw[i].billable_rate == null) ) {
			entries_done.push(entries_raw[i]);
		}
	}

	/*
		TODO: time_entries needs some sorting/config!
		* group on projects (sort on name)
		* each group (project) needs to output its own table and data
		* Cost does not round properly, find out how Harvest (so we match!)
			* or just omit cost in these reports
		* Link to note if connected to zendesk?
		* UI: Notification if timer is running
	*/

	log.info(libs.moment.duration().asWeeks(weekLast));

    var params = {
        adminUrl: adminUrl,
        assetsUrl: assetsUrl,
		appId: 'harvest',
        appName: 'Harvest Report Tool',
		moment: {
			weekNow: weekNow.toString(),
			weekLast: weekLast.toString()
		},
		report: {
			from: weekLastBegin,
			to: weekLastEnd
		},
		time_entries: entries_done
    };

    return {
		contentType: 'text/html',
        body: libs.thymeleaf.render(view, params)
    };
};
