/**
 * General global varables
 */

var ns = {
	api: {
		version: '2.0'
	},
    app: {
    	id: '1071717821'
    },
	tools: {
		moment: require('lib/momentjs'),
	 	underscore: require('lib/underscore')._
    },
    session: {
		user: '',
		timer: 0,
		token: '',
		cm_id: '',
		latitude: 0,
		user_sex: 0,
		category: 0,
		cm_status: '',
		longitude: 0,
		background: 1,
		location_id: 1,
		user_avatar: '',
		push_last_ts: 0,
		phone_number: '',
     	list_indicator: 0,
     	user_full_name: '',
     	push_last_type: '',
     	geo_push_status: '',
     	rate_me_counter: 10,
     	user_date_of_birth: '0000-00-00',
     	user_avatar_default: '',
     	push_last_group_idd: 0,
     	last_search_queries: [],
     	user_ts_modification: 0,
    	user_ts_avatar_modification: 0
	},
	limits: {
		search_places: 30,
		search_events: 10,
		general_search_places: 8,
		general_search_events: 2
	}
};

// Review pop-up

var review = require('ti.reviewdialog');

// Rate App

var rate = require('ui/RateMe');

// Permissions

var permissions = require('include/permissions');

// GEO Track

var track = require('include/track');

// Facebook

var fb = require('facebook');
fb.initialize();

// Map

var apple_map = require('ti.map');

// Social

var social = require('dk.napp.social');

// Push

var pushnotifications = require('com.pushwoosh.module');

// MomentJS config

ns.tools.moment.locale(L('general0010'));

/* Functions list */

function phoneCallRequest(phone, group_idd) {
	Ti.API.info('DEBUG LOG: LOG / Phone call request');

	var httpRegister;

	httpRegister = Ti.Network.createHTTPClient({
		onload: function() {
			Ti.API.info('DEBUG LOG: LOG / Phone call request / Success');
			return true;
		},
		onerror: function() {
			Ti.API.info('DEBUG LOG: LOG / Phone call request / Error');
			return false;
		},
		timeout: 15000
	});

	/**
	 * Platform
	 */

	var platform_osname = '';
	var platform_ostype = '';
	var platform_model = '';		
	var platform_locale = '';
	var platform_manufacturer = '';	
	var platform_processor_count = 1;
	var platform_username = '';
	var platform_version = '';

	if (Ti.Platform.osname) {
		platform_osname = Ti.Platform.osname;
	}

	if (Ti.Platform.ostype) {
		platform_ostype = Ti.Platform.ostype;
	}

	if (Ti.Platform.model) {
		platform_model = Ti.Platform.model;
	}

	if (Ti.Platform.locale) {
		platform_locale = Ti.Platform.locale;
	}

	if (Ti.Platform.manufacturer) {
		platform_manufacturer = Ti.Platform.manufacturer;
	}

	if (Ti.Platform.processorCount) {
		platform_processor_count = parseInt(Ti.Platform.processorCount);
	}

	if (Ti.Platform.username) {
		platform_username = Ti.Platform.username;
	}		
	
	if (Ti.Platform.version) {
		platform_version = Ti.Platform.version;
	}

    httpRegister.open('GET', 'https://qqnder.com/api.php' +
                             '?step=log_action' +
                             '&uuid=' + Ti.Platform.id +
    						 '&token=' + ns.session.token +
    						 '&phone=' + phone +
    						 '&lng=' + ns.session.longitude +
    						 '&lat=' + ns.session.latitude +
    						 '&group_idd=' + group_idd +
    						 '&category=' + ns.session.category +

    						 //platform details
    						 '&platform_osname=' + platform_osname +
    						 '&platform_ostype=' + platform_ostype +
    						 '&platform_model=' + platform_model +
    						 '&platform_locale=' + platform_locale +
    						 '&platform_manufacturer=' + platform_manufacturer +
    						 '&platform_processor_count=' + platform_processor_count +
    						 '&platform_username=' + platform_username +
    						 '&platform_version=' + platform_version);

    httpRegister.send();
};

function isiPhoneX() {
    return (Ti.Platform.displayCaps.platformWidth === 375 && Ti.Platform.displayCaps.platformHeight == 812) || // Portrait
           (Ti.Platform.displayCaps.platformHeight === 812 && Ti.Platform.displayCaps.platformWidth == 375); // Landscape
}

function feedbackRequest(type, group_idd) {
    var httpRegister;

	httpRegister = Ti.Network.createHTTPClient({
		onload: function() {
			return true;
		},
		onerror: function() {
			return false;
		},
		timeout: 15000
	});

    httpRegister.open('GET', 'https://qqnder.com/api.php' +
                             '?step=feedback' +
                             '&uuid=' + Ti.Platform.id +
    						 '&token=' + ns.session.token +
    						 '&type=' + type +
    						 '&group_idd=' + group_idd);

    httpRegister.send();
};

function socialShareRequest(social_network, group_idd) {
	var httpRegister;

	httpRegister = Ti.Network.createHTTPClient({
		onload: function() {
			if (isJsonString(this.responseText)) {			
				var jsonResult = JSON.parse(this.responseText);

				if (ns.tools.underscore.has(jsonResult, 'success')) {
					return true;
				}
			}
			
			return false;
		},
		onerror: function() {
			return false;
		},
		timeout: 15000
	});

	/**
	 * Platform
	 */
	
	var platform_osname = '';
	var platform_ostype = '';
	var platform_model = '';		
	var platform_locale = '';
	var platform_manufacturer = '';	
	var platform_processor_count = 1;
	var platform_username = '';
	var platform_version = '';

	if (Ti.Platform.osname) {
		platform_osname = Ti.Platform.osname;
	}

	if (Ti.Platform.ostype) {
		platform_ostype = Ti.Platform.ostype;
	}

	if (Ti.Platform.model) {
		platform_model = Ti.Platform.model;
	}

	if (Ti.Platform.locale) {
		platform_locale = Ti.Platform.locale;
	}

	if (Ti.Platform.manufacturer) {
		platform_manufacturer = Ti.Platform.manufacturer;
	}

	if (Ti.Platform.processorCount) {
		platform_processor_count = parseInt(Ti.Platform.processorCount);
	}

	if (Ti.Platform.username) {
		platform_username = Ti.Platform.username;
	}		
	
	if (Ti.Platform.version) {
		platform_version = Ti.Platform.version;
	}		

    httpRegister.open('GET', 'https://qqnder.com/api.php' +
                             '?step=social_share' +
                             '&uuid=' + Ti.Platform.id +
    						 '&token=' + ns.session.token +
    						 '&social_network=' + social_network +
    						 '&lng=' + ns.session.longitude +
    						 '&lat=' + ns.session.latitude +
    						 '&group_idd=' + group_idd +
    						 '&category=' + ns.session.category +

    						 //platform details
    						 '&platform_osname=' + platform_osname +
    						 '&platform_ostype=' + platform_ostype +
    						 '&platform_model=' + platform_model +
    						 '&platform_locale=' + platform_locale +
    						 '&platform_manufacturer=' + platform_manufacturer +
    						 '&platform_processor_count=' + platform_processor_count +
    						 '&platform_username=' + platform_username +
    						 '&platform_version=' + platform_version);
    httpRegister.send();
};

function declOfNum(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];  
};

function canRate(usecount) {
	if (!Ti.App.Properties.hasProperty('RemindToRate' + Ti.App.version)) {
		Ti.App.Properties.setString('RemindToRate' + Ti.App.version, 0);
	}

	var remindCountAsInt = parseInt(Ti.App.Properties.getString('RemindToRate' + Ti.App.version), 10);
	var newRemindCount = remindCountAsInt + 1;

	if (remindCountAsInt === -1) {
		// the user has either rated the app already, or has opted to never be
		// reminded again.
		return false;
	}
	else if (newRemindCount < usecount) {
		Ti.App.Properties.setString('RemindToRate' + Ti.App.version, newRemindCount);
		return false;
	}
	else if (newRemindCount >= usecount) {
		return true;
	}
};

function rtrim(str, charlist) {
	charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
	var re = new RegExp('[' + charlist + ']+$', 'g');
	return str.replace(re, '');
};

function buildLastSearchQueries() {
	var data = [];
	var last_search_queries = ns.session.last_search_queries.slice(-5);
	last_search_queries.reverse();

	var row = Ti.UI.createTableViewRow({
		allowsSelection: false,
		horizontalWrap: false,
		touchEnabled: true,
		hasChild: false,
		className: 'search-row-last-queries',
		height: 50,
		width: Ti.Platform.displayCaps.platformWidth,
		selectedBackgroundColor: '#FAFAFA',
		selectedColor: '#FAFAFA',
		backgroundColor: '#FAFAFA',
		borderColor: '#FAFAFA',
		dataSearch: '',
		dataType: 'search-last-queries-title',
		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE
	});

  		row.add(Ti.UI.createLabel({
  			bottom: 0,
			font: {
				fontFamily: 'OpenSans-Regular',
				fontSize: 18,
				fontWeight: 'normal'
			},
			color: '#5С5С5С',
			textAlign: 'center',
			text: L('ui0109')
		}));
		
	data.push(row);

	if (!last_search_queries.length) {
		var row = Ti.UI.createTableViewRow({
			allowsSelection: false,
			horizontalWrap: false,
    		touchEnabled: false,
    		hasChild: false,
    		className: 'search-row-last-queries',
    		height: 40,
    		width: Ti.Platform.displayCaps.platformWidth,
    		selectedBackgroundColor: '#FAFAFA',
    		selectedColor: '#FAFAFA',
    		backgroundColor: '#FAFAFA',
    		borderColor: '#FAFAFA',
    		dataSearch: '',
    		dataType: 'query-empty',
    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE
  		});

	  		row.add(Ti.UI.createLabel({
	  			bottom: 0,
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 16,
					fontWeight: 'normal'
				},
				color: '#8C8C8C',
				textAlign: 'center',
				text: L('ui0134')
			}));

		data.push(row);
	}
	else {
		for (var i=0,j=last_search_queries.length; i<j; i++) {
			var row = Ti.UI.createTableViewRow({
				allowsSelection: false,
				horizontalWrap: false,
	    		touchEnabled: true,
	    		hasChild: false,
	    		className: 'search-row-last-queries',
	    		height: 40,
	    		width: Ti.Platform.displayCaps.platformWidth,
	    		selectedBackgroundColor: '#FAFAFA',
	    		selectedColor: '#FAFAFA',
	    		backgroundColor: '#FAFAFA',
	    		borderColor: '#FAFAFA',
	    		dataSearch: last_search_queries[i],
	    		dataType: 'query',
	    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE
	  		});

		  		row.add(Ti.UI.createLabel({
		  			bottom: 0,
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					color: '#007AFF',
					textAlign: 'center',
					text: last_search_queries[i]
				}));

			data.push(row);
		};
	}

	return data;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function number_format(number, decimals, dec_point, thousands_sep) {
	var i, j, kw, kd, km;

	if (isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if (dec_point == undefined ){
		dec_point = ",";
	}
	if (thousands_sep == undefined ){
		thousands_sep = ".";
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + '';

	if( (j = i.length) > 3 ){
		j = j % 3;
	} else{
		j = 0;
	}

	km = (j ? i.substr(0, j) + thousands_sep : '');
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands_sep);
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : '');

	return km + kw + kd;
};

function deviceTokenSuccess(token) {
  	Ti.API.info('DEBUG LOG: PUSH / Successfully registered for apple device token with ' + token);
  	    
  	ns.session.cm_id = token;
  	Ti.App.Properties.setString('cm_id', ns.session.cm_id);

  	var httpRegister;

  	httpRegister = Ti.Network.createHTTPClient({
  		onload: function() {},
  		onerror: function() {},
  		timeout: 15000
  	});

    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=cm_id_auth&cm_id=' + ns.session.cm_id + '&uuid=' + Ti.Platform.id + '&token=' + ns.session.token);
    httpRegister.send();    
};

function socialNumberBeautifier(number) {
    var result = '0';

    if (number >= 1000) {
  	    result = parseInt((number / 1000)) + 'K';
    }
    else {
    	result = number;
    }
  
    return result;
};

function clearOldImages() {
	var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');

	if (!cacheDir.exists()) {
		cacheDir.createDirectory();
	}

	var dirFiles = cacheDir.getDirectoryListing();
	var timestamp = ns.tools.moment().unix() - (14 * 86400);

	for (var i = 1; i < dirFiles.length; i++) {      	
		var fileFromCache = Ti.Filesystem.getFile(cacheDir.resolve(), dirFiles[i].toString());

		if (fileFromCache.exists()) {
			if (ns.tools.moment(fileFromCache.modifiedAt()).unix() < timestamp) {
				fileFromCache.deleteFile();
			}
		}
	}
};

function unregisterDeviceTokenSuccess(cm_id, token) {
  	Ti.API.info('DEBUG LOG: PUSH / Successfully unregister for apple device token with ' + token);

  	var httpRegister;

  	httpRegister = Ti.Network.createHTTPClient({
  		onload: function() {},
  		onerror: function() {},
  		timeout: 15000
  	});

    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=cm_id_logout&cm_id=' + cm_id + '&uuid=' + Ti.Platform.id + '&token=' + token);
    httpRegister.send();    
};

function setBadge(type) {
	var badgeCount = Ti.UI.iOS.getAppBadge();

	if (type == 'reset') {
		badgeCount = 0;
	}
	else if (type == 'inc') {
		badgeCount = badgeCount + 1;
	}
	else if (type == 'dec') {
		badgeCount = badgeCount - 1;
	}

    return Ti.UI.iOS.setAppBadge(badgeCount);
};

function registerUserNotificationSettings() {
	Ti.App.iOS.registerUserNotificationSettings({
	    types: [
	        Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
	        Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
	        Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
	    ]
	});
};

function pushNotificationUnregister() {
	//pushnotifications.unregister();
};

function pushNotificationRegister() {
	registerUserNotificationSettings();

	/*
	pushnotifications.registerForPushNotifications(
		function(e) {
			setTimeout(function() {
	        	deviceTokenSuccess(e.registrationId);
	        }, 0);
    	},
	    function(e) {
	    	setTimeout(function() {
	        	Ti.API.error('DEBUG LOG: PUSH / Error during registration');
	        	pushNotificationRegister();
	        }, 10000);
	    }
	);
	*/
};

function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

function charToCurrencySymbol(str) {
	var currency_symbol = str.replace(/[^\D]/g, '');
	var price = str.replace(/[^0-9\.]/g, '');
	var price_with_currency_symbol = '';
	
	currency_symbol = str_replace('T', '₸', trim(currency_symbol));  // Latin T char
	currency_symbol = str_replace('Т', '₸', trim(currency_symbol));  // Curilic Т char
	
	if (currency_symbol == 'т') {
		price_with_currency_symbol = number_format(price, 0, '', ' ') + ' ' + currency_symbol;
	} else {
		price_with_currency_symbol = number_format(price, 0, '', ' ') + ' ' + currency_symbol;
	}

	return price_with_currency_symbol;
};

function checkConnection() {
	if (Ti.Network.networkType === Ti.Network.NETWORK_NONE || !Ti.Network.online) {
		return false;
	}

	return true;
};

function str_replace(search, replace, subject, count) {

    // discuss at: http://phpjs.org/functions/str_replace/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Gabriel Paderni
    // improved by: Philip Peterson
    // improved by: Simon Willison (http://simonwillison.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Onno Marsman
    // improved by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // bugfixed by: Anton Ongson
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Oleg Eremeev
    //    input by: Onno Marsman
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Oleg Eremeev
    //        note: The count parameter must be passed as a string in order
    //        note: to find a global variable in which the result will be given
    //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
    //   returns 1: 'Kevin.van.Zonneveld'
    //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
    //   returns 2: 'hemmo, mars'

    var i = 0,
    	j = 0,
	    temp = '',
	    repl = '',
	    sl = 0,
	    fl = 0,
	    f = [].concat(search),
	    r = [].concat(replace),
	    s = subject,
	    ra = Object.prototype.toString.call(r) === '[object Array]',
	    sa = Object.prototype.toString.call(s) === '[object Array]';
	    s = [].concat(s);

    if (count) {
        this.window[count] = 0;
    }

    for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
    
        for (j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length - s[i].length) / f[j].length;
            }
        }
    }

    return sa ? s : s[0];
};

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    
    return true;
};

function versionChecker(current, min, max) {
    if (current) {
        var current = parseInt(current.replace('.', ''));
    } else {
    	var current = '';
    }

    if (min) {
        var min = parseInt(min.replace('.', ''));
    } else {
    	var min = '';
    }

    if (max) {
        var max = parseInt(max.replace('.', ''));
    } else {
    	var max = '';
    }

    if (current != '' && min != '' && max != '') {
        if (current >= min && current <= max) {
            return true;
        }
    } else if (current != '' && min != '') {
        if (current >= min) {
            return true;
        }
    }
    
    return false;
};

function round(value, precision, mode) {
  //  discuss at: http://phpjs.org/functions/round/
  // original by: Philip Peterson
  //  revised by: Onno Marsman
  //  revised by: T.Wild
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
  //    input by: Greenseed
  //    input by: meo
  //    input by: William
  //    input by: Josep Sanz (http://www.ws3.es/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //        note: Great work. Ideas for improvement:
  //        note: - code more compliant with developer guidelines
  //        note: - for implementing PHP constant arguments look at
  //        note: the pathinfo() function, it offers the greatest
  //        note: flexibility & compatibility possible
  //   example 1: round(1241757, -3);
  //   returns 1: 1242000
  //   example 2: round(3.6);
  //   returns 2: 4
  //   example 3: round(2.835, 2);
  //   returns 3: 2.84
  //   example 4: round(1.1749999999999, 2);
  //   returns 4: 1.17
  //   example 5: round(58551.799999999996, 2);
  //   returns 5: 58551.8

  var m, f, isHalf, sgn; // helper variables
  precision |= 0; // making sure precision is integer
  m = Math.pow(10, precision);
  value *= m;
  sgn = (value > 0) | -(value < 0); // sign of the number
  isHalf = value % 1 === 0.5 * sgn;
  f = Math.floor(value);

  if (isHalf) {
    switch (mode) {
      case 'PHP_ROUND_HALF_DOWN':
        value = f + (sgn < 0); // rounds .5 toward zero
        break;
      case 'PHP_ROUND_HALF_EVEN':
        value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
        break;
      case 'PHP_ROUND_HALF_ODD':
        value = f + !(f % 2); // rounds .5 towards the next odd integer
        break;
      default:
        value = f + (sgn > 0); // rounds .5 away from zero
    }
  }

  return (isHalf ? value : Math.round(value)) / m;
};

function strripos(haystack, needle, offset) {
  //  discuss at: http://phpjs.org/functions/strripos/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: saulius
  //   example 1: strripos('Kevin van Zonneveld', 'E');
  //   returns 1: 16

  haystack = (haystack + '')
    .toLowerCase();
  needle = (needle + '')
    .toLowerCase();

  var i = -1;

  if (offset) {
    i = (haystack + '')
      .slice(offset)
      .lastIndexOf(needle); // strrpos' offset indicates starting point of range till end,
    // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
    if (i !== -1) {
      i += offset;
    }
  }
  else {
    i = (haystack + '')
      .lastIndexOf(needle);
  }
  return i >= 0 ? i : false;
};

function in_array(needle, haystack, argStrict) {
  //  discuss at: http://phpjs.org/functions/in_array/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: vlado houba
  // improved by: Jonas Sciangula Street (Joni2Back)
  //    input by: Billy
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
  //   returns 1: true
  //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
  //   returns 2: false
  //   example 3: in_array(1, ['1', '2', '3']);
  //   example 3: in_array(1, ['1', '2', '3'], false);
  //   returns 3: true
  //   returns 3: true
  //   example 4: in_array(1, ['1', '2', '3'], true);
  //   returns 4: false

  var key = '',
    strict = !!argStrict;

  //we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
  //in just one for, in order to improve the performance 
  //deciding wich type of comparation will do before walk array
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }

  return false;
};

function distanceLevel(distance) {
	if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS)) {
		if (distance > 1000) {
	        return 'far';
		}
		else if (distance >= 500 && distance <= 1000) {
	        return 'middle';
		}
		else {
			return 'near';
		}
	}
	else {
		return 'middle';
	}
};

function checkTime(t1, t2, tn, soon) {
	t1 = parseInt(t1);
    t2 = parseInt(t2);
    tn = parseInt(tn);

    if (t1 == 2400 && t2 == 2400) {
    	return true;
    }

    if (soon == true) {
    	tn = tn + 100;
    }

    if (t1 > t2) {
        if (tn < t2) {
            return true;
        }
        else if (tn > t1) {
            return true;
        }
    }

    if (t1 <= tn && tn < t2) {
        return true;
    }

    return false;
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function timeScheduleNormalizer(time) {
	var hours = '00',
	    min = '00';
	
	if (typeof(time) == 'number') {
		time = String(time);
	}

	min = time.substr(-2);
	hours = time.substr(0, 1);

	if (time.length > 3) {
	    hours = time.substr(0, 2);
	}
	
	return hours + ':' + min;
};

function two(a) {
	if (9 < a) {
		return a;
	}
	else {
		return '0' + a;	
	}
};

function formatTime(a) {
    a = Math.floor(a / 1E3);
    var b = Math.floor(a / 60),
        c = Math.floor(b / 60),
        d = c / 24 | 0,
        c = c % 24;
    a %= 60;
    b %= 60;
  
	if (d > 0) {
		if (d == 11) {
			return L('ui0117') + ' ' + d + ' ' + declOfNum(d, [L('ui0111'), L('ui0112'), L('ui0113')]);
		}
		else if (d.toString()[d.toString().length - 1] == '1') {
			return L('ui0120') + ' ' + d + ' ' + declOfNum(d, [L('ui0111'), L('ui0112'), L('ui0113')]);
		}
		else {
			return L('ui0117') + ' ' + d + ' ' + declOfNum(d, [L('ui0111'), L('ui0112'), L('ui0113')]);
		}
	}
	else if (c > 0) {
		if (c == 11) {
			return L('ui0117') + ' ' + c + ' ' + declOfNum(c, [L('ui0114'), L('ui0115'), L('ui0116')]);
		}
		else if (d.toString()[d.toString().length - 1] == '1') {
			return L('ui0120') + ' ' + c + ' ' + declOfNum(c, [L('ui0114'), L('ui0115'), L('ui0116')]);
		}
		else {
			return L('ui0117') + ' ' + c + ' ' + declOfNum(c, [L('ui0114'), L('ui0115'), L('ui0116')]);
		}
	}
	else {
		if ((d + c) > 0) {
			if (c == 11) {
				return L('ui0117') + ' ' + c + ' ' + declOfNum(c, [L('ui0114'), L('ui0115'), L('ui0116')]);
			}
			else if (d.toString()[d.toString().length - 1] == '1') {
				return L('ui0120') + ' ' + c + ' ' + declOfNum(c, [L('ui0114'), L('ui0115'), L('ui0116')]);
			}
			else {
				return L('ui0117') + ' ' + c + ' ' + declOfNum(c, [L('ui0114'), L('ui0115'), L('ui0116')]);
			}
		}
		else {
			return L('ui0110');
		}
	}
};

function countToDown(today_date, finish_date) {
	var a = new Date(today_date),
        b = new Date(finish_date),
        a = b.getTime() - a.getTime();

	if (a > 0) {
		return formatTime(a);
	}
	else {
		return L('ui0110');
	}
};

function editPermissions(e) {
	/**
	 * Open the app settings.
	 */
	Ti.Platform.openURL(Ti.App.iOS.applicationOpenSettingsURL);
};

/**
 * Sessions
 */

// Activ session
var active_session = Ti.App.Properties.getString('active_session', '');
Ti.App.Properties.setString('active_session', active_session);

// CM id
var cm_id = Ti.App.Properties.getString('cm_id', '');
Ti.App.Properties.setString('cm_id', cm_id);

// CM status
var cm_status = Ti.App.Properties.getString('cm_status', '');
Ti.App.Properties.setString('cm_status', cm_status);

// Geo push status
var geo_push_status = Ti.App.Properties.getString('geo_push_status', '');
Ti.App.Properties.setString('geo_push_status', geo_push_status);

// User avatar
var user_avatar = Ti.App.Properties.getString('user_avatar', '');
Ti.App.Properties.setString('user_avatar', user_avatar);

// User avatar default
var user_avatar_default = Ti.App.Properties.getString('user_avatar_default', '');
Ti.App.Properties.setString('user_avatar_default', user_avatar_default);

// User avatar timestamp modification
var user_ts_avatar_modification = Ti.App.Properties.getString('user_ts_avatar_modification', 0);
Ti.App.Properties.setString('user_ts_avatar_modification', user_ts_avatar_modification);

// User timestamp modification
var user_ts_modification = Ti.App.Properties.getString('user_ts_modification', 0);
Ti.App.Properties.setString('user_ts_modification', user_ts_modification);

// User full name
var user_full_name = Ti.App.Properties.getString('user_full_name', '');
Ti.App.Properties.setString('user_full_name', user_full_name);

// User sex
var user_sex = Ti.App.Properties.getString('user_sex', 0);
Ti.App.Properties.setString('user_sex', user_sex);

// User date of birth
var user_date_of_birth = Ti.App.Properties.getString('user_date_of_birth', '0000-00-00');
Ti.App.Properties.setString('user_date_of_birth', user_date_of_birth);

// User phone number
var phone_number = Ti.App.Properties.getString('phone_number', '');
Ti.App.Properties.setString('phone_number', phone_number);

// List indicator
var list_indicator = Ti.App.Properties.getString('list_indicator', 0);
Ti.App.Properties.setString('list_indicator', list_indicator);

Ti.App.addEventListener('app:stop_geo_notification', function() {
	Ti.API.info('DEBUG LOG: GEO LOCATION / Stop GEO notification / Success');
	ns.session.geo_push_status = '';
	Ti.App.Properties.setString('geo_push_status', '');
});

(function() {
    var Window = null;
    var window = null;

	if (active_session != '') {
		if (geo_push_status == 'on') {
			registerUserNotificationSettings();
			permissions.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
				if (e.success) {
					Ti.API.info('DEBUG LOG: GEO LOCATION / Permissions AUTHORIZATION_ALWAYS / Success');

					track.startTracking(function(e) {
						if (e.success) {
							Ti.API.info('DEBUG LOG: GEO LOCATION / Start tracking / Success');
					    }
					    else {
					    	Ti.API.info('DEBUG LOG: GEO LOCATION / Start tracking / Error');
					    }
					});
				}
				else {
					Ti.API.info('DEBUG LOG: GEO LOCATION / Permissions AUTHORIZATION_ALWAYS / Error');
				}
			});
		}
		
		// session attr
		ns.session.token = active_session;
		ns.session.cm_id = cm_id;
		ns.session.cm_status = cm_status;
		ns.session.geo_push_status = geo_push_status;
		ns.session.user_avatar = user_avatar;
		ns.session.user_avatar_default = user_avatar_default;
		ns.session.user_ts_modification = user_ts_modification;
		ns.session.user_ts_avatar_modification = user_ts_avatar_modification;
		ns.session.phone_number = phone_number;
		ns.session.user_full_name = user_full_name;
		ns.session.user_sex = user_sex;
		ns.session.user_date_of_birth = user_date_of_birth;
		ns.session.list_indicator = list_indicator;

		if (window == null) {
			//TODO: ATTR CHANGE
			Window = require('ui/MenuWindow');
			window = new Window(0, 'normal');
	        window.open();
       	}
	}
	else {
		  Ti.App.iOS.UserNotificationCenter.removePendingNotifications();
		  setBadge('reset');
		  Window = require('ui/AuthWindow');
		  window = new Window();
          window.open();
	}

    Ti.App.addEventListener('app:auth_window', function(e) {
        if (window != null) {
            window.close();
        }

        if (fb.getLoggedIn()) {
            fb.logout();
        }
        
        // Reset to default system properties
        Ti.App.Properties.setString('active_session', '');
        Ti.App.Properties.setString('cm_id', '');
        Ti.App.Properties.setString('cm_status', '');
        Ti.App.Properties.setString('geo_push_status', '');
        Ti.App.Properties.setString('list_indicator', 0);

		// Reset all notification and badges
        Ti.App.iOS.UserNotificationCenter.removePendingNotifications();

        track.stopTracking(function(e) {
			if (e.success) {
				Ti.API.info('DEBUG LOG: GEO LOCATION / Stop tracking / Success');
		    }
		    else {
		    	Ti.API.info('DEBUG LOG: GEO LOCATION / Stop tracking / Error');
		    }
		});

        setBadge('reset');

        Window = require('ui/AuthWindow');
        window = new Window();
        window.open();
    });

	// App Local Push Notification

	Ti.App.iOS.addEventListener('notification', function(e) {
		Ti.API.info('DEBUG LOG: App / Receive an incoming local notification');

		if (window != null) {
            window.fireEvent('app:local_notification', e.userInfo);
        }
	});

    // App Resumed

    Ti.App.addEventListener('app:resumed', function() {
        if (window != null) {
            window.fireEvent('app:resumed');
        }
    });

})();
