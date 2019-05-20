// PUBLIC INTERFACE

exports.requestLocationPermissions = requestLocationPermissions;

// PRIVATE FUNCTIONS

function requestLocationPermissions(authorizationType, cb) {
    if (!Ti.Geolocation.locationServicesEnabled) {
	    Ti.API.info('DEBUG LOG: PERMISSIONS / Location Services Disabled');

        return cb({
            success: false
        });
    }

    if (Ti.Geolocation.hasLocationPermissions(authorizationType)) {
    	Ti.API.info('DEBUG LOG: PERMISSIONS / Location has Location Permissions');

	    return cb({
	        success: true
	    });
    }

	if (Ti.Geolocation.locationServicesAuthorization === Ti.Geolocation.AUTHORIZATION_DENIED
		|| Ti.Geolocation.locationServicesAuthorization === Ti.Geolocation.AUTHORIZATION_RESTRICTED
		|| Ti.Geolocation.locationServicesAuthorization === Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE) {

		var dialog = Ti.UI.createAlertDialog({
    		cancel: 0,
    		buttonNames: [L('p0010'), L('p0011')],
    		message: L('p0013'),
    		title: L('p0012')
  		});

		dialog.addEventListener('click', function(e) {
		    if (e.index === e.source.cancel) {
		        Ti.API.info('DEBUG LOG: PERMISSIONS / Location Service Authorization Cancel');
		    }
		    else {
		    	Ti.API.info('DEBUG LOG: PERMISSIONS / Location Service Authorization Open Settings');
		    	Ti.Platform.openURL(Ti.App.iOS.applicationOpenSettingsURL);
		    }
		});

	    dialog.show();

		// return success:false without an error since we've informed the user already
	    return cb({
	        success: false
	    });
	}
	
	Ti.API.info(Ti.Geolocation.locationServicesAuthorization);

    Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
        if (!e.success) {
        	Ti.API.info('DEBUG LOG: PERMISSIONS / Failed to request Location Permissions / Error');

            return cb({
                success: false,
            });
        }

        cb({
            success: true
        });
    });
}