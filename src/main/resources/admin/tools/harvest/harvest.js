var libs = {
	portal: require('/lib/xp/portal'),
	thymeleaf: require('/lib/xp/thymeleaf'),
	harvest: require("/lib/harvest-api"),
	util: require("/lib/enonic/util"),
	admin: require('/lib/xp/admin'),
	moment: require('/assets/momentjs/2.21.0/min/moment-with-locales.min.js'),
	appersist: require('/lib/openxp/appersist')
};

var timestamp = Date.now();
var view = resolve('harvest.html');

exports.get = function(req) {

	// Variables required by the Launcher Panel and other tool-specific things.
	var baseHref = libs.portal.pageUrl({
	    path: '',
	    type: 'absolute'
	});
	var adminUrl = libs.admin.getBaseUri();
    var assetsUrl = libs.portal.assetUrl({path: ""});

	// Initiate moment() and get this weeks number, spanning dates, and more.
	libs.moment().format();
	var weekNow  = libs.moment().isoWeek();
	var weekLast = weekNow -  1; // TODO: unsafe, might yeild 0
	var weekBeforeLast = weekNow - 2; // TODO: unsafe, might yeild -1 to 0
	var weekNowBegin = libs.moment().startOf('isoweek').format('YYYY-MM-DD');
	var weekNowEnd = libs.moment().endOf('isoweek').format('YYYY-MM-DD');
	var weekLastBegin = libs.moment().week(weekLast).startOf('isoweek').format('YYYY-MM-DD');
	var weekLastEnd   = libs.moment().week(weekLast).endOf('isoweek').format('YYYY-MM-DD');
	var weekBeforeLastBegin = libs.moment().week(weekBeforeLast).startOf('isoweek').format('YYYY-MM-DD');
	var weekBeforeLastEnd   = libs.moment().week(weekBeforeLast).endOf('isoweek').format('YYYY-MM-DD');

	var dateSpanFrom = weekNowBegin;
	var dateSpanTo = weekNowEnd;
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
	// And calculate name of weekday
	for (var i = entries_raw.length - 1; i >= 0; i--) {
		if ( !(entries_raw[i].billable == false || entries_raw[i].billable_rate == null) ) {
			entries_raw[i].spent_dateWeekdayName = libs.moment(entries_raw[i].spent_date).format('dddd');
			entries_raw[i].fullCost = Math.round(entries_raw[i].billable_rate * entries_raw[i].hours);
			entries_raw[i].notes = entries_raw[i].notes || 'N/A';
			entries_done.push(entries_raw[i]);
		}
	}

	function organise(arr) {
	    var headers = [], // an Array to let us lookup indicies by group
	        objs = [],    // the Object we want to create
	        i, j;
	    for (i = 0; i < arr.length; ++i) {
	        j = headers.indexOf(arr[i].project.name); // lookup
	        if (j === -1) { // this entry does not exist yet, init
	            j = headers.length;
	            headers[j] = arr[i].project.name;
	            objs[j] = {};
	            objs[j].header = {
						project: arr[i].project.name,
						client: arr[i].client.name
					};
	            objs[j].items = [];
	        }
	        objs[j].items.push( // create clone
	            arr[i]
	        );
	    }
	    return objs;
	}

	var entries_by_project = organise(entries_done);
	//libs.util.log(entries_by_project);

	// Sort the array of projects based on client name.
	entries_by_project.sort( function(a,b) {
		var nameA = a.header.client.toUpperCase();
		var nameB = b.header.client.toUpperCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
/*
	var repon = libs.appersist.repository.getConnection({repository:'test', branch:'master'});
	repon.create({
		favouriteFish: 'Rubarb',
		otherDetails: 'Additional things',
		openWindow: true,
		digits: 57,
		highValues: 400245350,
		html: '<strong>Nice!</strong>'
	});

	repon.create({
		openWindow: false,
		digits: 10
	});
*/
	/*
		TODO: reports
		* Cost does not round properly, find out how Harvest does it (so we match!)
			* or just omit cost in these reports
		* Link the notes that are connected to zendesk?
		* UI: Notification if timer is running
		* Do a sum/total per project at the end of each table
	*/

	/*
		TODO: send reports
		* Decide where to get client/customer email data (project notes or client staff-data?).
		* Output/collect email addresses that will get the report.
		* Generate hard-coded email template in English.
		* Inject project specific table over time entries into email template.
		* Send the email template (bcc to me?).
	*/

	log.info(libs.moment.duration().asWeeks(weekLast));

    var params = {
		baseHref: baseHref,
		adminUrl: adminUrl,
		assetsUrl: assetsUrl,
		thisToolUrl: libs.admin.getToolUrl(app.name, 'harvest'),
		appId: 'harvest',
		appName: 'Harvest Report Tool',
		launcherPath: libs.admin.getLauncherPath(),
		launcherUrl: libs.admin.getLauncherUrl(),
		moment: {
			weekNow: {
				weekNumber: weekNow.toString(),
				weekBegin: weekNowBegin,
				weekEnd: weekNowEnd
			},
			weekLast: {
				weekNumber: weekLast.toString(),
				weekBegin: weekLastBegin,
				weekEnd: weekLastEnd
			},
			weekBeforeLast: {
				weekNumber: weekBeforeLast.toString(),
				weekBegin: weekBeforeLastBegin,
				weekEnd: weekBeforeLastEnd
			}
		},
		report: {
			from: dateSpanFrom,
			to: dateSpanTo,
			forWeek: (req.params && req.params.week) ? req.params.week : weekNow,
			heading1: (req.params && req.params.week) ? "Report for week " + req.params.week : "Report for week " + weekNow
		},
		time_entries: entries_by_project//entries_done
    };

    return {
		contentType: 'text/html',
        body: libs.thymeleaf.render(view, params)
    };
};
