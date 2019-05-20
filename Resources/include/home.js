/**
 * General global varables
 */
var internal_ns = {
	 tools:{
	 	moment : require('lib/momentjs'),
	 	underscore : require('lib/underscore')._
	 }
};

var deviceOldTimestamp = 0.0;
var i = 0;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * 
 * @param {Integer} min
 * @param {Integer} max
 * @return {Integer}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if a string is a valid JSON string
 * 
 * @param {String} str
 * @return {Boolean}
 */
function isJsonString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }

    return true;
};

helper_device = function(url, method) {
	var xhr = Ti.Network.createHTTPClient();
 
	xhr.setTimeout(15000);

	xhr.onerror = function(e) {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Error timeout');
	};

	xhr.onload = function() {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Send');

		var geo_push_status = Ti.App.Properties.getString('geo_push_status', '');

		if (geo_push_status == 'on') {
			Ti.API.info('DEBUG LOG: GEO LOCATION / Geopush status in "On"');
			
			if (isJsonString(this.responseText)) {
				Ti.API.info('DEBUG LOG: GEO LOCATION / Valid JSON');
				var jsonResult = JSON.parse(this.responseText);

				if (internal_ns.tools.underscore.has(jsonResult, 'success')) {
					Ti.API.info('DEBUG LOG: GEO LOCATION / Success response');
					
					if (jsonResult.success.code == '800') {
						Ti.API.info('DEBUG LOG: GEO LOCATION / JSON result ');

						if (jsonResult.success.result.length > 0) {
							var random = getRandomInt(10, 17);

							var notification = Ti.App.iOS.scheduleLocalNotification({
							    alertBody : L('g00' + random).replace('{{place_name}}', jsonResult.success.result[0].place_name),
							    alertAction : L('g0020'),
							    sound : 'default',
							    userInfo : {
							    	'id' : 'local_geo_push_' + jsonResult.success.result[0].group_idd,
							    	'group_idd' : jsonResult.success.result[0].group_idd,
							    	'type' : 'local_geo_push'
							    },
							    date : new Date(new Date().getTime() + 5000) // 5 seconds after backgrounding
							});
						}
					}
				}
			}
			else {
				Ti.API.info('DEBUG LOG: GEO LOCATION / Invalid JSON');
			}
		}
	};

	xhr.open(method, url);
	xhr.send();
};

exports.deviceResume = function(e) {
	Ti.API.info('DEBUG LOG: GEO LOCATION / Device app has resumed from the background');
};

exports.startDevice = function() {
	Ti.App.removeEventListener('resumed', exports.deviceResume);
	Ti.App.addEventListener('resumed', exports.deviceResume);
	exports.deviceResume();
};

exports.stopDevice = function() {
	Ti.App.removeEventListener('resumed', exports.deviceResume);
	exports.deviceResume();
};

exports.deviceTracking = function(e) {	
	var active_session = Ti.App.Properties.getString('active_session', '');

	if (active_session != '') {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Device Background Tracking Ping');

	    if (!e.success || e.error) {
	        Ti.API.info('DEBUG LOG: GEO LOCATION / Device Background Tracking Error');
	    }
	    else {
	    	var timestamp = parseFloat(e.coords.timestamp);

			if (deviceOldTimestamp < 1) {
				Ti.API.info('DEBUG LOG: GEO LOCATION / Timestamp < 1');
				deviceOldTimestamp = timestamp;
			}
			else if ((timestamp - deviceOldTimestamp) < 250000) {
				Ti.API.info('DEBUG LOG: GEO LOCATION / Timestamp < 250000');
	    		deviceOldTimestamp = timestamp;
	    	}
	    	else {
	    		Ti.API.info('DEBUG LOG: GEO LOCATION / Device Background Tracking Timestamp');
	       		exports.sendLocation(e.coords, active_session);
	       		deviceOldTimestamp = timestamp;
	       	}
	    }
   	}
   	else {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Active session is not defined');
	}
};

exports.startDeviceBackground = function() {
	Ti.API.info('DEBUG LOG: GEO LOCATION / Start device background service');

	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Location services enabled');

		Ti.Geolocation.distanceFilter = 100;
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.removeEventListener('location', exports.deviceTracking);
		Ti.Geolocation.addEventListener('location', exports.deviceTracking);
	}
	else {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Geolocation Disabled');
	}
};

exports.sendLocation = function(location, active_session) {
	Ti.API.info('DEBUG LOG: GEO LOCATION / Send location');
	
	var method = 'GET';

	var query_addr = 'https://qqnder.com/api.php' +
	                 '?step=log_location' +
	                 '&lat=' + location.latitude +
	                 '&lng=' + location.longitude +
	                 '&token=' + active_session +
	                 '&uuid=' + Ti.Platform.id +
	                 '&hour=' + internal_ns.tools.moment().format('H') +
                     '&minute=' + internal_ns.tools.moment().format('m') +
                     '&day_of_week=' + internal_ns.tools.moment().format('E') +
                     '&home=1';

	helper_device(query_addr, 'GET');
};