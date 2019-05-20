/**
 * Library to do the actual tracking.
 */

// DEPENDENCIES

var moment = require('lib/momentjs');
var underscore = require('lib/underscore')._;

// PUBLIC INTERFACE

exports.startTracking = startTracking;
exports.isTracking = isTracking;
exports.stopTracking = stopTracking;

// PRIVATE VARIABLES

var currentLocationStatus = false;
var configuredMonitoring = false;

// PRIVATE FUNCTIONS

function isJsonString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }

    return true;
}

function sendToServer(url, method) {
	Ti.API.info('DEBUG LOG: GEO LOCATION / Send to server');
	
	var xhr = Ti.Network.createHTTPClient();

	xhr.setTimeout(15000);

	xhr.onerror = function(e) {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Send to server / Error');
	};

	xhr.onload = function() {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Send to server / Success');

		var geo_push_status = Ti.App.Properties.getString('geo_push_status', '');

		if (geo_push_status == 'on') {
			Ti.API.info('DEBUG LOG: GEO LOCATION / Geopush status in "On"');
			
			if (isJsonString(this.responseText)) {
				Ti.API.info('DEBUG LOG: GEO LOCATION / Valid JSON');

				var jsonResult = JSON.parse(this.responseText);

				if (underscore.has(jsonResult, 'success')) {
					Ti.API.info('DEBUG LOG: GEO LOCATION / JSON has result / Success');
					
					if (jsonResult.success.code == '800') {
						Ti.API.info('DEBUG LOG: GEO LOCATION / Code 800 / Success');

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
}

function getCurrentLocation() {
    return currentLocationStatus;
}

function isTracking() {
    return !!getCurrentLocation();
}

function initMonitoring(cb) {
    Ti.API.info('DEBUG LOG: GEO LOCATION / Init monitoring');

    permissions.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Request location permissions');

	    if (e.success && !configuredMonitoring) {
	    	Ti.API.info('DEBUG LOG: GEO LOCATION / Success location permissions');

			//if (OS_IOS) {
	        	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	        	Ti.Geolocation.distanceFilter = 1;
	        	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	        	//Ti.Geolocation.pauseLocationUpdateAutomatically = true;
	        	//Ti.Geolocation.activityType = Ti.Geolocation.ACTIVITYTYPE_FITNESS;
			//}

			//if (OS_ANDROID) {
			//	Ti.Geolocation.Android.addLocationProvider(Ti.Geolocation.Android.createLocationProvider({
			//	name: Ti.Geolocation.PROVIDER_GPS,
			//	minUpdateDistance: Alloy.CFG.minUpdateDistance,
			//	minUpdateTime: (Alloy.CFG.minAge / 1000)
			//	}));
			//	Ti.Geolocation.Android.addLocationRule(Ti.Geolocation.Android.createLocationRule({
			//	provider: Ti.Geolocation.PROVIDER_GPS,
			//	accuracy: Alloy.CFG.accuracy,
			//	maxAge: Alloy.CFG.maxAge,
			//	minAge: Alloy.CFG.minAge
			//	}));
			//	Ti.Geolocation.Android.manualMode = true;
			//	}

			configuredMonitoring = true;
		}
	
		return cb(e);
	});
}

function startTracking(cb) {
	Ti.API.info('DEBUG LOG: GEO LOCATION / Start tracking');
	
	if (isTracking()) {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Already tracking');

		return cb({
			success: false
		});
	}

	initMonitoring(function(e) {
		if (!e.success) {
			Ti.API.info('DEBUG LOG: GEO LOCATION / Init monitoring it not success');
			return cb(e);
		}

		currentLocationStatus = true;

		Ti.Geolocation.addEventListener('location', onLocation);

		Ti.Geolocation.addEventListener('authorization', function(e) {
			Ti.API.info('DEBUG LOG: GEO LOCATION / Authorization update');
			Ti.API.info(e);
			
			if (e.authorizationStatus == 4) {
				Ti.API.info('4');
				Ti.Geolocation.removeEventListener('location', onLocation);
			}
			/*
			if (Ti.Geolocation.locationServicesAuthorization == Ti.Geolocation.AUTHORIZATION_ALWAYS) {
				Ti.API.info('DEBUG LOG: GEO LOCATION / Authorization always is success');
				Ti.Geolocation.addEventListener('location', onLocation);
			}
			else if (Ti.Geolocation.locationServicesAuthorization == Ti.Geolocation.AUTHORIZATION_ALWAYS) {
				Ti.API.info('DEBUG LOG: GEO LOCATION / Authorization always is not success');
				Ti.Geolocation.removeEventListener('location', onLocation);
			}
			*/
		});

		return cb({
			success: true
		});
	});
}

function stopTracking(cb) {
	Ti.API.info('DEBUG LOG: GEO LOCATION / Stop tracking');

	if (!isTracking()) {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Stop tracking / Success');

		Ti.App.fireEvent('app:stop_geo_notification');

		return cb({
			success: true
		});
	}

	Ti.API.info('DEBUG LOG: GEO LOCATION / Stop tracking / Success');
	
	Ti.Geolocation.removeEventListener('location', onLocation);
	Ti.App.fireEvent('app:stop_geo_notification');
    currentLocationStatus = null;

    return cb({
        success: true
    });
}

function onLocation(e) {
	if (!e.error) {
		Ti.API.info('DEBUG LOG: GEO LOCATION / On location success');

		var coords = e.coords;
		sendLocation(coords);
    }
    else {
    	Ti.API.info('DEBUG LOG: GEO LOCATION / On location error');
    }
}

function sendLocation(location) {
	Ti.API.info('DEBUG LOG: GEO LOCATION / Send location');

	var active_session = Ti.App.Properties.getString('active_session', '');

	if (active_session != '') {
		Ti.API.info('DEBUG LOG: GEO LOCATION / Active session is not empty');

		var method = 'GET';
		var notification = '0';
		var query_addr = 'https://qqnder.com/api.php' +
		                 '?step=log_location' +
		                 '&lat=' + location.latitude +
		                 '&lng=' + location.longitude +
		                 '&token=' + active_session +
		                 '&uuid=' + Ti.Platform.id +
		                 '&hour=' + moment().format('H') +
	                     '&minute=' + moment().format('m') +
	                     '&day_of_week=' + moment().format('E') +
	                     '&notification=1';

		sendToServer(query_addr, 'GET');
	}
};