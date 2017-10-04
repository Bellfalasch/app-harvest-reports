var libs = {
	portal: require('/lib/xp/portal'),
	util: require('/lib/enonic/util'),
	harvest: require('/lib/harvest-api')
};

exports.get = function() {
	libs.harvest.time_entries({});
	/*
		http://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/
		In the response we'll get data (and name) on user, client, project, and task.
		* Be aware that "is_running" will be true for any running timer, we need to inform user and stop these (inform in v1, automatic in v2).
		* "billable" is true if "hours" should be invoicable, the cost is in "billable_rate" (is null if not billable).
		* Field "is_billed" has already been invoiced, should be highlighted in the emails.
		* "notes" contains the row with description.
		* "spent_date" will store the calendar date the entry is for.
		* "hours" field is in decimals! Easy for calculating full price. Harder to display number of hours:minutes to clients.
		* Prices are without tax, needs to be specified if it is to be sent.
		* "updated_at" and "created_at" can be used to filter entries so not all needs to be worked on.
		* "notes" needs to be extracted for one specific "project" for a given week (span of "spent_date").
	*/
}
