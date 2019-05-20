function ProfileWindow() {

	/**
	 * iOS version style
	 */

	var headerTop = 0;

	if (isiPhoneX()) {
		headerTop = 44;
	}
	else if (versionChecker(Ti.Platform.getVersion(), '7.0')) {
		headerTop = 20;
	}

	/**
	 * Include Functions
	 */

	function bytesToSize(bytes) {
	    var sizes = [L('sys0010'), L('sys0011'), L('sys0012'), L('sys0013')];

	    if (bytes == 0) return '0 ' + L('sys0010');

	    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	};

	function getFileSystemTotalSize() {
		var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');

		if (!cacheDir.exists()) {
		    cacheDir.createDirectory();
		}

		var fileList = cacheDir.getDirectoryListing();
		var totalSize = 0;

		if (fileList && fileList.length) {
			for (var i = 0, len = fileList.length; i < len; i++) {
			    var file = Ti.Filesystem.getFile(cacheDir.resolve(), fileList[i]);
			    if (file.exists()) {
			        totalSize += file.size;
			    }
			}
		}

		// dispose of file handles
		fileList = null;
		cacheDir = null;

		return totalSize;
	};

	function profileElSelector() {
		return Ti.UI.createView({
			backgroundImage: '/img/ios/profile/select_right.png',
			backgroundRepeat: false,
			height: 13,
			width: 13,
			top: 19,
			right: 25
		});
	};

	function profileElTitle(title) {
		return Ti.UI.createLabel({
			font: {
				fontFamily: 'OpenSans-Regular',
				fontSize: 15,
				fontWeight: 'normal'
			},
			color: '#5C5C5C',
			textAlign: 'left',
			text: title,
			left: 60
		});
	};

	function profileElIcon(top, left, size, img) {
		var elCont = Ti.UI.createImageView({
			top: top,
			left: left,
			width: size,
			height: size
		});

			elCont.add(Ti.UI.createView({
				backgroundImage: img,
				backgroundRepeat: false,
				height: size,
				width: size
			}));

		return elCont;
	};

	function profileTitle(title, extra_top_space) {
		return Ti.UI.createLabel({
			font: {
				fontFamily: 'OpenSans-Semibold',
				fontSize: 14,
				fontWeight: 'normal'
			},
			color: '#5C5C5C',
			text: title.toUpperCase(),
			top: 25 + extra_top_space,
			left: 25,
			height: Ti.UI.SIZE
		});
	};

	function profileDescSpace() {
		return Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: 10,
			left: 0,
			top: 0
		});
	};

	function profileTitleSpace() {
		return Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: 6,
			left: 0,
			top: 0
		});	
	};

	function profileSpace() {
		return Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: 18,
			left: 0,
			top: 0
		});	
	};	

	function profileHr() {
		return Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: 1,
			backgroundColor: '#EFEFF3',
			top: 0,
			left: 0,
			zIndex: 10
		});
	};

	function profileShortHr() {
		var profileShortHrTmp = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 1,
			backgroundColor: '#FFFFFF',
			top: 0,
			left: 0,
			zIndex: 10
		});
		
		profileShortHrTmp.add(Ti.UI.createView({
			height: 1,
			backgroundColor: '#EFEFF3',
			top: 0,
			left: 25,
			right: 25
		}));

		return profileShortHrTmp;
	};

	var createProfileAvatar = {
	    RemoteImage: function(a) {
			a = a || {};

			var md5;
			var needsToSave = false;
			var savedFile = null;
			var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');

			if (!cacheDir.exists()) {
				Ti.API.info('DEBUG LOG: Profile / Create cache dir');
			    cacheDir.createDirectory();
			}

			if (a.image) {
				md5 = Ti.Utils.md5HexDigest(a.image + a.ts_modification) + '.png';
				savedFile = Ti.Filesystem.getFile(cacheDir.resolve(), md5);

				if (savedFile.exists()) {
					a.image = savedFile;
				}
				else {
					needsToSave = true;
				}
			}

			if (needsToSave == true) {
				Ti.API.info('DEBUG LOG: Profile / Avatar needs to save');

				a.image = a.image + '?cache=' + new Date().getTime();
				var image = Ti.UI.createImageView(a);

				image.addEventListener('load', function() {
					Ti.API.info('DEBUG LOG: Profile / Save user avatar');

					if (savedFile.write(image.toImage(null, true)) === false) {
						Ti.API.info('DEBUG LOG: Profile / Save user avatar / Write error');
					}
				});

				image.addEventListener('error', function(e) {
					// If file not found
					if (e.code == 1) {
						Ti.API.info('DEBUG LOG: Profile / Use default avatar');
						image.setImage(a.data_user_avatar_default);
					}
					else {
						setTimeout(function() {
							Ti.API.info('DEBUG LOG: Profile / Re-load avatar');
							image.setImage(a.image);
						}, 15000);
					}
				});
			}
			else {
				Ti.API.info('DEBUG LOG: Profile / Avatar not needs to save');
				var image = Ti.UI.createImageView(a);
			}

			return image;
		}
	};

	/**
	 * Profile
	 */

	var self = Ti.UI.createWindow({
		top: 0,
		left: 0,
	    width: Ti.Platform.displayCaps.platformWidth,
	    height: Ti.UI.FILL,
	    statusBarStyle: Ti.UI.iOS.StatusBar.GRAY,
	    backgroundColor: '#FAFAFA'
	});

    	// Top Menu

		var profileHeaderCont = Ti.UI.createView({
			height: (headerTop + 44),
			width: Ti.Platform.displayCaps.platformWidth,
			top: 0,
			left: 0
		});

			profileHeaderCont.add(Ti.UI.createView({
				height: 1,
				width: Ti.Platform.displayCaps.platformWidth,
				bottom: 0,
				left: 0,
				backgroundColor:'#CDCED2'
			}));

			var profileHeaderCenter = Ti.UI.createView({
				right: 54,
				left: 54,
				height: 44,
				bottom: 0
			});

				profileHeaderCenter.add(Ti.UI.createLabel({
					text: L('ui0044'),
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					height: Ti.UI.SIZE,
					color: '#000000',
					textAlign: 'center'
				}));

			var profileHeaderLeft = Ti.UI.createView({
				left: 0,
				height: 44,
				width: 54,
				bottom: 0,
				zIndex: 10
			});

				profileHeaderLeft.add(Ti.UI.createView({
					backgroundImage: '/img/ios/profile/left_slider.png',
					backgroundRepeat: false,
					height: 22,
					width: 22
				}));

			profileHeaderCont.add(profileHeaderCenter);	
			profileHeaderCont.add(profileHeaderLeft);
		self.add(profileHeaderCont);

		var profileCont = Ti.UI.createScrollView({
			top: (headerTop + 44),
		    left: 0,
		    width: Ti.Platform.displayCaps.platformWidth,
		    layout: 'vertical',
		    contentWidth: Ti.UI.FILL,
		    contentHeight: Ti.UI.SIZE,
		    backgroundColor: 'transparent',
		    showVerticalScrollIndicator: false,
		    showHorizontalScrollIndicator: false
		});

			var profileAvatarBack = Ti.UI.createView({
				top: 25,
				right: 25,
				width: 60,
				height: 60,
				borderRadius: 5
			});

				var profile_avatar_image = '';

				if (ns.session.user_avatar != '') {
					profile_avatar_image = Ti.Utils.base64decode(ns.session.user_avatar).toString();
				}

				var profile_avatar_image_default = '/img/ios/profile/user_avatar_preload.png';

				if (ns.session.user_avatar_default != '') {
					profile_avatar_image_default = Ti.Utils.base64decode(ns.session.user_avatar_default).toString();
				}

				var profileAvatar = createProfileAvatar.RemoteImage({
					top: 0,
					left: 0,
					width: 60,
					height: 60,
					image: profile_avatar_image,
					defaultImage: '/img/ios/profile/user_avatar_preload.png',
					ts_modification: ns.session.user_ts_avatar_modification,
					data_user_avatar_default: profile_avatar_image_default
				});

				profileAvatarBack.add(profileAvatar);
			profileCont.add(profileAvatarBack);

			// Header

			var profileHeaderPositioning = Ti.UI.createView({
				layout: 'horizontal',
				right: 85,
				left: 25,
				top: -60,
				height: Ti.UI.SIZE
			});

				profileHeaderPositioning.add(Ti.UI.createLabel({
					top: 0,
					left: 0,
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					text: L('ui0013').toUpperCase(),
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 14,
						fontWeight: 'normal'
					},
					color: '#000000'
				}));

				profileHeaderPositioning.add(Ti.UI.createLabel({
					top: 0,
					left: 7,
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					text: '+' + ns.session.phone_number.replace('+', ''),
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 14,
						fontWeight: 'normal'
					},
					color: '#5C5C5C'
				}));
			profileCont.add(profileHeaderPositioning);
	
			var profileFullNameLabel = Ti.UI.createTextField({
				borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
				returnKeyType: Ti.UI.RETURNKEY_DONE,
				font: {
					fontFamily: 'OpenSans-Bold',
					fontSize: 24,
					fontWeight: 'normal'
				},
				color: '#000000',
				hintText: L('ui0098'),
				hintTextColor: '#000000',
				height: Ti.UI.SIZE,
				left: 25,
				value: '',
				top: 8,
				right: 85,
				maxLength: 100,
				textAlign: 'left',
				preventDefault: true
			});

				profileCont.add(profileFullNameLabel);

			// genegal info
			profileCont.add(profileTitle(L('ui0086'), 10));
			profileCont.add(profileTitleSpace());

			// genegal info / sex

			profileCont.add(profileHr());

			var profileInfoSexEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});

				var profileInfoSexElLabel = Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					height: Ti.UI.SIZE,
					textAlign: 'left',
					color: '#5C5C5C',
					text: L('ui0096'),
					left: 60
				});

				profileInfoSexEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_sex.png'));
				profileInfoSexEl.add(profileInfoSexElLabel);
			profileCont.add(profileInfoSexEl);
			profileCont.add(profileShortHr());

			// general info / date of birth

			var profileInfoDateOfBirthEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});

				var profileInfoDateOfBirthElLabel = Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					textAlign: 'left',
					color: '#5C5C5C',
					text: L('ui0095'),
					left: 60
				});

				profileInfoDateOfBirthEl.add(profileInfoDateOfBirthElLabel);
				profileInfoDateOfBirthEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_dob.png'));
			profileCont.add(profileInfoDateOfBirthEl);
			profileCont.add(profileHr());

			var profileInfoDesc = Ti.UI.createLabel({
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 15,
					fontWeight: 'normal'
				},
				color: '#8C8C8C',
				textAlign: 'center',
				text: L('ui0097'),
				height: Ti.UI.SIZE,
				top: 25,
				left: 25,
				right: 25
			});

			profileCont.add(profileInfoDesc);
			profileCont.add(profileDescSpace());

			// profile
			profileCont.add(profileTitle(L('ui0050'), 0));
			profileCont.add(profileTitleSpace());

			// cache / clearCache
			profileCont.add(profileHr());

			var profileInfoClearCacheEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});

				var profileInfoCacheValue = Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 13,
						fontWeight: 'normal'
					},
					textAlign: 'right',
					color: '#005AFF',
					text: bytesToSize(getFileSystemTotalSize()),
					right: 25
				});

				profileInfoClearCacheEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_cache.png'));
				profileInfoClearCacheEl.add(profileElTitle(L('ui0054')));
				profileInfoClearCacheEl.add(profileInfoCacheValue);
			profileCont.add(profileInfoClearCacheEl);
			profileCont.add(profileShortHr());

			// profile / notifications

			var profileInfoNotificationEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});

				var profileInfoNotificationValue = Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 13,
						fontWeight: 'normal'
					},
					color: '#03CA1E',
					text: L('ui0059'),
					textAlign: 'right',
					right: 25
				});

				var settings = pushnotifications.getNotificationSettings();

				if (settings.enabled == 1) {
					profileInfoNotificationValue.setText(L('ui0059'));
					profileInfoNotificationValue.setColor('#03CA1E');					
				}
				else {
					profileInfoNotificationValue.setText(L('ui0060'));
					profileInfoNotificationValue.setColor('#FF3B30');
				}

				profileInfoNotificationEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_notification.png'));
				profileInfoNotificationEl.add(profileElTitle(L('ui0051')));
				profileInfoNotificationEl.add(profileInfoNotificationValue);
			profileCont.add(profileInfoNotificationEl);
			profileCont.add(profileShortHr());

			// profile / geo notifications

			var profileInfoGeoNotificationEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});

				var profileInfoGeoNotificationValue = Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 13,
						fontWeight: 'normal'
					},
					color: '#03CA1E',
					text: L('ui0059'),
					textAlign: 'right',
					right: 25
				});

				if (ns.session.geo_push_status == 'on') {
					profileInfoGeoNotificationValue.setText(L('ui0059'));
					profileInfoGeoNotificationValue.setColor('#03CA1E');					
				}
				else {
					profileInfoGeoNotificationValue.setText(L('ui0060'));
					profileInfoGeoNotificationValue.setColor('#FF3B30');
				}

				profileInfoGeoNotificationEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_geo_notification.png'));
				profileInfoGeoNotificationEl.add(profileElTitle(L('ui0146')));
				profileInfoGeoNotificationEl.add(profileInfoGeoNotificationValue);
			profileCont.add(profileInfoGeoNotificationEl);
			profileCont.add(profileShortHr());

			// profile / logout

			var profileInfoLogoutEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});
				profileInfoLogoutEl.add(profileElTitle(L('ui0052')));
				profileInfoLogoutEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_logout.png'));
				profileInfoLogoutEl.add(profileElSelector());
			profileCont.add(profileInfoLogoutEl);
			profileCont.add(profileHr());

			// extras
			profileCont.add(profileTitle(L('ui0055'), 0));
			profileCont.add(profileTitleSpace());

			// extras / rateApp

			profileCont.add(profileHr());
			var profileInfoGetRateAppEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});
				profileInfoGetRateAppEl.add(profileElTitle(L('ui0092')));
				profileInfoGetRateAppEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_rate_app.png'));
				profileInfoGetRateAppEl.add(profileElSelector());
			profileCont.add(profileInfoGetRateAppEl);
			profileCont.add(profileShortHr());

			// extras / getSupport

			var profileInfoGetSupportEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});
				profileInfoGetSupportEl.add(profileElTitle(L('ui0056')));
				profileInfoGetSupportEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_support.png'));
				profileInfoGetSupportEl.add(profileElSelector());
			profileCont.add(profileInfoGetSupportEl);
			profileCont.add(profileShortHr());

			// etras / terms of services

			var profileInfoTermsOfServiceEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});
				profileInfoTermsOfServiceEl.add(profileElTitle(L('ui0057')));
				profileInfoTermsOfServiceEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_terms.png'));
				profileInfoTermsOfServiceEl.add(profileElSelector());
			profileCont.add(profileInfoTermsOfServiceEl);
			profileCont.add(profileShortHr());

			// etras / version

			var profileInfoVersionEl = Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 50,
				backgroundColor: '#FFFFFF'
			});

				var profileInfoVersionValue = Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 13,
						fontWeight: 'normal'
					},
					color: '#5C5C5C',
					text: Ti.App.version,
					textAlign: 'right',
					right: 25
				});

				profileInfoVersionEl.add(profileElTitle(L('ui0058')));
				profileInfoVersionEl.add(profileElIcon(15, 25, 22, '/img/ios/profile/info_version.png'));
				profileInfoVersionEl.add(profileInfoVersionValue);
			profileCont.add(profileInfoVersionEl);
			profileCont.add(profileHr());
			profileCont.add(profileSpace());
		self.add(profileCont);

	// Sex dialog

	var sexOpts = {
	    cancel: 2,
	    options: [
	    	L('ui0099'),
	    	L('ui0100'),
	    	L('ui0101')
    	],
	    selectedIndex: 2,
	    destructive: 0,
	    title: L('ui0096')
	};

	var sexDialog = Ti.UI.createOptionDialog(sexOpts);
	
	// Camera dialog

	var cameraOpts = {
	    cancel: 2,
	    options: [
	    	L('ui0175'),
	    	L('ui0176'),
	    	L('ui0101')
    	],
	    selectedIndex: 2,
	    destructive: 0,
	    title: L('ui0177')
	};

	var cameraDialog = Ti.UI.createOptionDialog(cameraOpts);

	// Date picker

	var pickerBg = Ti.UI.createView({
		width: Ti.Platform.displayCaps.platformWidth,
		height: Ti.UI.FILL,
		backgroundColor: 'RGBA(0, 0, 0, 0.3)',
		left: 0,
		top: 0,
		visible: false,
		zIndex: 20000
	});

		self.add(pickerBg);

	var pickerCont = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.Platform.displayCaps.platformWidth,
		bottom: 0,
		left: 0,
		backgroundColor: '#FAFAFA',
		layout: 'vertical',
		zIndex: 20100,
		visible: false
	});

		var pickerTop = Ti.UI.createView({
			top: 0,
			left: 0,
			height: 50,
			width: Ti.Platform.displayCaps.platformWidth,
			backgroundColor: '#FAFAFA'
		});

			pickerTop.add(Ti.UI.createView({
				top: 0,
				left: 0,
				height: 1,
				width: Ti.Platform.displayCaps.platformWidth,
				backgroundColor: '#CDCED2'
			}));

			pickerTop.add(Ti.UI.createView({
				height: 1,
				width: Ti.Platform.displayCaps.platformWidth,
				bottom: 0,
				backgroundColor: '#CDCED2'
			}));

			pickerTop.add(Ti.UI.createLabel({
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 15,
					fontWeight: 'normal'
				},
				color: '#5C5C5C',
				text: L('ui0094')
			}));

			var pickerTopCloseLabel = Ti.UI.createLabel({
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 15,
					fontWeight: 'normal'
				},
				color: '#000000',
				text: L('ui0087'),
				right: 25
			});

			pickerTop.add(pickerTopCloseLabel);
		pickerCont.add(pickerTop);

	    var picker = Ti.UI.createPicker({
	        type: Ti.UI.PICKER_TYPE_DATE,
	        minDate: ns.tools.moment().subtract(100, 'years').toDate(),
	        maxDate: ns.tools.moment().toDate(),
	        value: ns.tools.moment().toDate(),
	        top: 0,
	        backgroundColor: '#FAFAFA',
	        date_value: ns.tools.moment().format('YYYY-MM-DD')
	    });

	    pickerCont.add(picker);
    self.add(pickerCont);

	/**
	 * Actions
	 */

	var profileContChange = true;
	var WindowError = null;
	var windowError = null;

	self.addEventListener('singletap', function(e) {
		if (e.source.preventDefault != true) {
			profileFullNameLabel.blur();
		}
	});

	profileHeaderLeft.addEventListener('singletap', function() {
		if (profileContChange === false) {
			profileContChange = true;
			
			self.fireEvent('close_extra');
			self.close();
		}
	});

	profileFullNameLabel.addEventListener('singletap', function() {
		if (checkConnection() && profileContChange === false) {
			profileFullNameLabel.focus();
		}
		else if (!checkConnection()) {
			WindowError = require('ui/ErrorWindow');
			windowError = new WindowError(L('ui0010'), L('x0010'));
			windowError.open();

			windowError.addEventListener('close_extra', function() {
				if (windowError != null) {
					WindowError = null;
					windowError = null;
				}
			});
		}
	});

	// Rate App

	profileInfoGetRateAppEl.addEventListener('singletap', function(e) {
		if (checkConnection() && profileContChange === false) {
			if (review.isSupported()) {
			  	review.requestReview();
			}
			else {
				Ti.Platform.openURL('itms-apps://itunes.apple.com/app/id' + ns.app.id);
			}
		}
		else if (!checkConnection()) {
			WindowError = require('ui/ErrorWindow');
			windowError = new WindowError(L('ui0010'), L('x0010'));
			windowError.open();

			windowError.addEventListener('close_extra', function() {
				if (windowError != null) {
					WindowError = null;
					windowError = null;
				}
			});
		}
	});

	// Sex

	profileInfoSexEl.addEventListener('singletap', function(e) {
		if (checkConnection() && profileContChange === false) {
    		sexDialog.show();
    	}
    	else if (!checkConnection()) {
			WindowError = require('ui/ErrorWindow');
			windowError = new WindowError(L('ui0010'), L('x0010'));
			windowError.open();

			windowError.addEventListener('close_extra', function() {
				if (windowError != null) {
					WindowError = null;
					windowError = null;
				}
			});
		}
    });

	sexDialog.addEventListener('click', function(e) {
		if (profileContChange === false) {
			profileContChange = true;

			if (checkConnection()) {
				if (e.index == 0 || e.index == 1) {
					if (e.index == 0) {
						profileInfoSexElLabel.setText(L('ui0099'));
					}
					else if (e.index == 1) {
						profileInfoSexElLabel.setText(L('ui0100'));
					}

					var httpRegister;

					/**
					 * Header loading
					 */

					var headerLoading = Ti.UI.createView({
						width: 10,
						height: 2,
						top: (headerTop + 42),
						left: 0,
						backgroundColor: '#007AFF'
					});

					self.add(headerLoading);

					var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);													
					var incLoadingTime = null;

					if (incLoadingTime != null) {
				    	clearInterval(incLoadingTime);
				    }

					httpRegister = Ti.Network.createHTTPClient({
						validatesSecureCertificate: true,
						onreadystatechange: function() {
							if (headerLoading !== undefined) {
								if (this.readyState == 1) {
									headerLoading.animate({
										duration: 400,
										width: parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100)
									});

								    incLoadingTime = setInterval(function() {
								    	headerLoading.setWidth(incLoadingVal);
										incLoadingVal = incLoadingVal + 1;
										if (parseInt(65 * Ti.Platform.displayCaps.platformWidth / 100) == incLoadingVal) {
										    clearInterval(incLoadingTime);
										}
								    }, 500);
								}
							}
						},
						onload: function() {
							clearInterval(incLoadingTime);

							var headerLoadingProgressAnimation = Ti.UI.createAnimation({
								duration: 400,
								width: Ti.Platform.displayCaps.platformWidth,
								curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
							});

							headerLoading.animate(headerLoadingProgressAnimation);

							headerLoadingProgressAnimation.addEventListener('complete', function() {
								if (headerLoading !== undefined) {
									self.remove(headerLoading);
								}
							});

							if (isJsonString(this.responseText)) {
								var jsonResult = JSON.parse(this.responseText);

								if (ns.tools.underscore.has(jsonResult, 'error')) {
									if (jsonResult.error.code == '710') {
										Ti.App.fireEvent('app:auth_window');
									}
									else {
										if (ns.session.user_sex == 0) {
											profileInfoSexElLabel.setText(L('ui0099'));
										}
										else if (ns.session.user_sex == 1) {
											profileInfoSexElLabel.setText(L('ui0100'));
										}
										else {
											profileInfoSexElLabel.setText(L('ui0096'));
										}

										WindowError = require('ui/ErrorWindow');
										windowError = new WindowError(L('ui0010'), L('x0014'));
										windowError.open();

										windowError.addEventListener('close_extra', function() {
											if (windowError != null) {
												profileContChange = false;
												WindowError = null;
												windowError = null;
											}
										});
									}
								}
								else {
									ns.session.user_sex = e.index + 1;
									Ti.App.Properties.setString('user_sex', e.index + 1);
									profileContChange = false;			
								}
							}
							else {
								if (ns.session.user_sex == 0) {
									profileInfoSexElLabel.setText(L('ui0099'));
								}
								else if (ns.session.user_sex == 1) {
									profileInfoSexElLabel.setText(L('ui0100'));
								}
								else {
									profileInfoSexElLabel.setText(L('ui0096'));
								}
								
								WindowError = require('ui/ErrorWindow');
								windowError = new WindowError(L('ui0010'), L('x0014'));
								windowError.open();

								windowError.addEventListener('close_extra', function() {
									if (windowError != null) {
										profileContChange = false;
										WindowError = null;
										windowError = null;
									}
								});
							}
						},
						onerror: function() {
							if (headerLoading !== undefined) {
								self.remove(headerLoading);
							}

							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0011'));
							windowError.open();

							if (ns.session.user_sex == 0) {
								profileInfoSexElLabel.setText(L('ui0099'));
							}
							else if (ns.session.user_sex == 1) {
								profileInfoSexElLabel.setText(L('ui0100'));
							}
							else {
								profileInfoSexElLabel.setText(L('ui0096'));
							}

							windowError.addEventListener('close_extra', function() {
								if (windowError != null) {
									profileContChange = false;
									WindowError = null;
									windowError = null;
								}
							});
						},
						timeout: 15000
					});
					
					var sex = 0;
					
					if (e.index == 0) {
						sex = 1;
					}
					else if (e.index == 1) {
						sex = 2; 
					}

				    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=update_profile&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&sex=' + sex);
				    httpRegister.send();
				}
				else {
					profileContChange = false;
				}
			}
			else {
				profileContChange = false;
			}
		}
	});

    // Date of Birth

    profileInfoDateOfBirthEl.addEventListener('singletap', function(e) {
		if (checkConnection() && profileContChange === false) {
	    	if (ns.session.user_date_of_birth != '0000-00-00') {
	    		var date_of_birth_arr = ns.session.user_date_of_birth.split('-');
	    		picker.setValue(new Date(date_of_birth_arr[0], date_of_birth_arr[1] - 1, date_of_birth_arr[2]));
			}
			else {
				picker.setValue(ns.tools.moment().toDate());
	        	picker.date_value = ns.tools.moment().format('YYYY-MM-DD');
			}

			pickerBg.setVisible(true);
			pickerCont.setVisible(true);
		}
		else if (!checkConnection()) {
			WindowError = require('ui/ErrorWindow');
			windowError = new WindowError(L('ui0010'), L('x0010'));
			windowError.open();

			windowError.addEventListener('close_extra', function() {
				if (windowError != null) {
					WindowError = null;
					windowError = null;
				}
			});
		}
    });

    picker.addEventListener('change', function(e) {
	    picker.date_value = e.value.getFullYear() + '-' + (e.value.getMonth() + 1) + '-' + e.value.getDate();
	});

	pickerTopCloseLabel.addEventListener('singletap', function() {
		if (profileContChange === false) {
			profileContChange = true;

			pickerBg.setVisible(false);
			pickerCont.setVisible(false);

			if (checkConnection()) {
				if (picker.date_value != '0000-00-00') {
					var date_of_birth_arr = picker.date_value.split('-');
					profileInfoDateOfBirthElLabel.setText(ns.tools.moment(picker.date_value, ['YYYY-MM-DD']).format('D MMMM YYYY'));
					picker.setValue(ns.tools.moment(picker.date_value, ['YYYY-MM-DD']).toDate());

					var httpRegister;

					/**
					 * Header loading
					 */

					var headerLoading = Ti.UI.createView({
						width: 10,
						height: 2,
						top: (headerTop + 42),
						left: 0,
						backgroundColor: '#007AFF'
					});

					self.add(headerLoading);

					var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);													
					var incLoadingTime = null;

					if (incLoadingTime != null) {
				    	clearInterval(incLoadingTime);
				    }

					httpRegister = Ti.Network.createHTTPClient({
						validatesSecureCertificate: true,
						onreadystatechange: function() {
							if (headerLoading !== undefined) {
								if (this.readyState == 1) {
									headerLoading.animate({
										duration: 400,
										width: parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100)
									});
	
								    incLoadingTime = setInterval(function() {
								    	headerLoading.setWidth(incLoadingVal);
										incLoadingVal = incLoadingVal + 1;
										if (parseInt(65 * Ti.Platform.displayCaps.platformWidth / 100) == incLoadingVal) {
											clearInterval(incLoadingTime);
										}
								    }, 500);
								}
							}
						},
						onload: function() {
							clearInterval(incLoadingTime);

							var headerLoadingProgressAnimation = Ti.UI.createAnimation({
								duration: 400,
								width: Ti.Platform.displayCaps.platformWidth
							});

							headerLoading.animate(headerLoadingProgressAnimation);

							headerLoadingProgressAnimation.addEventListener('complete', function() {
								if (headerLoading !== undefined) {
									self.remove(headerLoading);
								}								
							});

							if (isJsonString(this.responseText)) {
								var jsonResult = JSON.parse(this.responseText);
	
								if (ns.tools.underscore.has(jsonResult, 'error')) {
									if (jsonResult.error.code == '710') {
										Ti.App.fireEvent('app:auth_window');
									}
									else {
										if (ns.session.user_date_of_birth != '0000-00-00') {
											profileInfoDateOfBirthElLabel.setText(ns.tools.moment(ns.session.user_date_of_birth, ['YYYY-MM-DD']).format('D MMMM YYYY'));
										}
										else {
											profileInfoDateOfBirthElLabel.setText(L('ui0095'));
										}	
										
										picker.date_value = '0000-00-00';

										WindowError = require('ui/ErrorWindow');
										windowError = new WindowError(L('ui0010'), L('x0014'));
										windowError.open();				
										
										windowError.addEventListener('close_extra', function() {
											if (windowError != null) {
												profileContChange = false;
												WindowError = null;
												windowError = null;
											}
										});
									}
								}
								else {
									profileContChange = false;
	
									if (picker.date_value != '0000-00-00') {
										var date_of_birth_arr = picker.date_value.split('-');

										if (date_of_birth_arr[1] < 10) {
											date_of_birth_arr[1] = '0' + date_of_birth_arr[1];
										}

										if (date_of_birth_arr[2] < 10) {
											date_of_birth_arr[2] = '0' + date_of_birth_arr[2];
										}

										ns.session.user_date_of_birth = date_of_birth_arr[0] + '-' + date_of_birth_arr[1] + '-' + date_of_birth_arr[2];
										Ti.App.Properties.setString('user_date_of_birth', date_of_birth_arr[0] + '-' + date_of_birth_arr[1] + '-' + date_of_birth_arr[2]);
										picker.date_value = '0000-00-00';
									}
								}
							}
							else {
								profileInfoDateOfBirthElLabel.setText(ns.tools.moment(ns.session.user_date_of_birth, ['YYYY-MM-DD']).format('D MMMM YYYY'));
								picker.date_value = '0000-00-00';

								WindowError = require('ui/ErrorWindow');
								windowError = new WindowError(L('ui0010'), L('x0014'));
								windowError.open();

								windowError.addEventListener('close_extra', function() {
									if (windowError != null) {
										profileContChange = false;
										WindowError = null;
										windowError = null;
									}
								});
							}
						},
						onerror: function() {
							if (headerLoading !== undefined) {
								self.remove(headerLoading);
							}

							if (ns.session.user_date_of_birth != '0000-00-00') {
								profileInfoDateOfBirthElLabel.setText(ns.tools.moment(ns.session.user_date_of_birth, ['YYYY-MM-DD']).format('D MMMM YYYY'));
							}
							else {
								profileInfoDateOfBirthElLabel.setText(L('ui0095'));
							}		
							
							picker.date_value = '0000-00-00';					
	
							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0011'));
							windowError.open();
	
							windowError.addEventListener('close_extra', function() {
								if (windowError != null) {
									profileContChange = false;
									WindowError = null;
									windowError = null;
								}
							});
						},
						timeout: 15000
					});

				    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=update_profile&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&date_of_birth=' + date_of_birth_arr[0] + '-' + date_of_birth_arr[1] + '-' + date_of_birth_arr[2]);
				    httpRegister.send();
				}
				else {
					if (ns.session.user_date_of_birth != '0000-00-00') {
						profileInfoDateOfBirthElLabel.setText(ns.tools.moment(ns.session.user_date_of_birth, ['YYYY-MM-DD']).format('D MMMM YYYY'));
					}
					else {
						profileInfoDateOfBirthElLabel.setText(L('ui0095'));
					}
					
					picker.date_value = '0000-00-00';
					profileContChange = false;
				}
	   		}
	   		else {
				if (ns.session.user_date_of_birth != '0000-00-00') {
					profileInfoDateOfBirthElLabel.setText(ns.tools.moment(ns.session.user_date_of_birth, ['YYYY-MM-DD']).format('D MMMM YYYY'));
				}
				else {
					profileInfoDateOfBirthElLabel.setText(L('ui0095'));
				}

				picker.date_value = '0000-00-00';

				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();

				windowError.addEventListener('close_extra', function() {
					if (windowError != null) {
						profileContChange = false;
						WindowError = null;
						windowError = null;
					}
				});
	   		}
	   	}
	});

	pickerBg.addEventListener('singletap', function(e) {
		picker.date_value = '0000-00-00';
    	pickerBg.setVisible(false);
    	pickerCont.setVisible(false);
    });

	// Avatar

	profileAvatarBack.addEventListener('singletap', function(e) {
		if (profileContChange === false) {
			if (checkConnection()) {
				cameraDialog.show();
			}
			else {
				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();

				windowError.addEventListener('close_extra', function() {
					if (windowError != null) {
						WindowError = null;
						windowError = null;
					}
				});
			}
		}
	});

	cameraDialog.addEventListener('click', function(e) {
		if (profileContChange === false) {
			profileContChange = true;

			if (checkConnection()) {
				if (e.index == 0) {
	        		Ti.Media.showCamera({
	        			transform: Ti.UI.create2DMatrix(),
	       				success: function(event) {
							if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					    		if (event.media.width >= 500 && event.media.height >= 500) {
	
									/**
									 * Header loading
									 */
	
									var headerLoaging = Ti.UI.createView({
										width: 10,
										height: 2,
										top: (headerTop + 42),
										left: 0,
										backgroundColor: '#007AFF',
										zIndex: 10000
									});
	
									self.add(headerLoaging);
	
									if (event.media.width > event.media.height) {
										var resized = event.media.imageAsResized(parseInt(500 / (event.media.height / event.media.width)), 500);
						       			var cropped = resized.imageAsCropped({
						       				x: parseInt((resized.width - 500) / 2),
						       				y: 0,
						       				width: 500,
						       				height: 500
					       				});
							        }
							        else if (event.media.width < event.media.height) {
										var resized = event.media.imageAsResized(500, parseInt(500 / (event.media.width / event.media.height)));
						       			var cropped = resized.imageAsCropped({
						       				x: 0,
						       				y: parseInt((resized.height - 500) / 2),
						       				width: 500,
						       				height: 500
					       				});
							       	}
							       	else {
							       		var cropped = event.media.imageAsThumbnail(500);
							       	}
	
									var xhr = Ti.Network.createHTTPClient();
	
								    xhr.onerror = function(e) {
										if (headerLoaging !== undefined) {
											self.remove(headerLoaging);
										}
	
										WindowError = require('ui/ErrorWindow');
										windowError = new WindowError(L('ui0010'), L('x0011'));
										windowError.open();
				
										windowError.addEventListener('close_extra', function() {
											if (windowError != null) {
												profileContChange = false;
												WindowError = null;
												windowError = null;
											}
										});
								    };
	
									xhr.onreadystatechange = function(e) {
								        if (e.readyState == 4) {
											if (headerLoaging !== undefined) {
												self.remove(headerLoaging);
											}
								        }
								    };
	
							        xhr.onload = function() {
										if (headerLoaging !== undefined) {
											self.remove(headerLoaging);
										}

										if (isJsonString(this.responseText)) {
											var jsonResult = JSON.parse(this.responseText);

											if (ns.tools.underscore.has(jsonResult, 'error')) {
												Ti.App.fireEvent('app:auth_window');
											}
											else {
												var md5 = Ti.Utils.md5HexDigest(Ti.Utils.base64decode(ns.session.user_avatar).toString() + jsonResult.success.result.user_ts_avatar_modification) + '.png';
												var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');
												var savedFile = Ti.Filesystem.getFile(cacheDir.resolve(), md5);

												if (savedFile.exists() && savedFile.writable) {
													savedFile.deleteFile();
												}

												savedFile.write(cropped);
												profileAvatar.setImage(cropped);

												cacheDir = null;
												savedFile = null;
									        	profileContChange = false;
											}
										}
										else {
											var WindowError = require('ui/ErrorWindow');
											var windowError = new WindowError(L('ui0010'), L('x0014'));
											windowError.open();				

											windowError.addEventListener('close_extra', function() {
												profileContChange = false;
												WindowError = null;
												windowError = null;
											});						
										}
							        };

							        xhr.setTimeout(15000);

									xhr.onsendstream = function(e) {
										headerLoaging.setWidth(parseInt((e.progress * 100) * Ti.Platform.displayCaps.platformWidth / 100));
									};
	
							        xhr.open('POST', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=update_user_avatar&uuid=' + Ti.Platform.id + '&token=' + ns.session.token);
		
							        xhr.send({
							            file: cropped
							        });
					    		}
					    		else {
					    			WindowError = require('ui/ErrorWindow');
									windowError = new WindowError(L('ui0010'), L('x0016'));
									windowError.open();				
	
									windowError.addEventListener('close_extra', function() {
										if (windowError != null) {
											profileContChange = false;
											WindowError = null;
											windowError = null;
										}
									});
					    		}
					    	}
					    	else {
					    		profileContChange = false;
					    	}
						},
	               		cancel: function() {
	                  		profileContChange = false;
	               		},
	               		error: function(error) {
							profileContChange = false;
						},
						mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
						animated: true,
	               		allowImageEditing: true,
	               		saveToPhotoGallery: false
	       			});
				}
				else if (e.index == 1) {
					Ti.Media.openPhotoGallery({
						mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
						cancel: function() {
							profileContChange = false;
						},
						error: function(error) {
							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0014'));
							windowError.open();
	
							windowError.addEventListener('close_extra', function() {
								if (windowError != null) {
									profileContChange = false;
									WindowError = null;
									windowError = null;
								}
							});
						},
					    success: function(event) {
					    	if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					    		if (event.media.width >= 500 && event.media.height >= 500) {

									/**
									 * Header loading
									 */

									var headerLoaging = Ti.UI.createView({
										width: 10,
										height: 2,
										top: (headerTop + 42),
										left: 0,
										backgroundColor: '#007AFF',
										zIndex: 10000
									});

									self.add(headerLoaging);

									if (event.media.width > event.media.height) {
										var resized = event.media.imageAsResized(parseInt(500 / (event.media.height / event.media.width)), 500);
						       			var cropped = resized.imageAsCropped({
						       				x: parseInt((resized.width - 500) / 2),
						       				y: 0,
						       				width: 500,
						       				height: 500
					       				});
							        }
							        else if (event.media.width < event.media.height) {
										var resized = event.media.imageAsResized(500, parseInt(500 / (event.media.width / event.media.height)));
						       			var cropped = resized.imageAsCropped({
						       				x: 0,
						       				y: parseInt((resized.height - 500) / 2),
						       				width: 500,
						       				height: 500
					       				});
							       	}
							       	else {
							       		var cropped = event.media.imageAsThumbnail(500);
							       	}

									var xhr = Ti.Network.createHTTPClient();

								    xhr.onerror = function(e) {
										var headerLoadingProgressAnimation = Ti.UI.createAnimation({
											duration: 400,
											width: Ti.Platform.displayCaps.platformWidth
										});

										headerLoaging.animate(headerLoadingProgressAnimation);

										headerLoadingProgressAnimation.addEventListener('complete', function() {
											if (headerLoaging !== undefined) {
												self.remove(headerLoaging);
											}
										});
										
										WindowError = require('ui/ErrorWindow');
										windowError = new WindowError(L('ui0010'), L('x0011'));
										windowError.open();
				
										windowError.addEventListener('close_extra', function() {
											if (windowError != null) {
												profileContChange = false;
												WindowError = null;
												windowError = null;
											}
										});
								    };

									xhr.onreadystatechange = function(e) {
								        if (e.readyState == 4) {
											if (headerLoaging !== undefined) {
												self.remove(headerLoaging);
											}
								        }
								    };

							        xhr.onload = function(e) {
										if (headerLoaging !== undefined) {
											self.remove(headerLoaging);
										}

										if (isJsonString(this.responseText)) {
											var jsonResult = JSON.parse(this.responseText);

											if (ns.tools.underscore.has(jsonResult, 'error')) {
												Ti.App.fireEvent('app:auth_window');
											}
											else {
												md5 = Ti.Utils.md5HexDigest(Ti.Utils.base64decode(ns.session.user_avatar).toString() + jsonResult.success.result.user_ts_avatar_modification) + '.png';

												var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');
												var savedFile = Ti.Filesystem.getFile(cacheDir.resolve(), md5);

												if (savedFile.exists() && savedFile.writable) {
													savedFile.deleteFile();
												}

												savedFile.write(cropped);
												profileAvatar.setImage(cropped);

												cacheDir = null;
												savedFile = null;
									        	profileContChange = false;
											}
										}
										else {
											var WindowError = require('ui/ErrorWindow');
											var windowError = new WindowError(L('ui0010'), L('x0014'));
											windowError.open();

											windowError.addEventListener('close_extra', function() {
												profileContChange = false;
												WindowError = null;
												windowError = null;
											});						
										}
							        };

							        xhr.setTimeout(15000);

									xhr.onsendstream = function(e) {
										headerLoaging.setWidth(parseInt((e.progress * 100) * Ti.Platform.displayCaps.platformWidth / 100));
									};

							        xhr.open('POST', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=update_user_avatar&uuid=' + Ti.Platform.id + '&token=' + ns.session.token);

							        xhr.send({
							            file: cropped
							        });
					    		}
					    		else {
					    			WindowError = require('ui/ErrorWindow');
									windowError = new WindowError(L('ui0010'), L('x0016'));
									windowError.open();
				
									windowError.addEventListener('close_extra', function() {
										if (windowError != null) {
											profileContChange = false;
											WindowError = null;
											windowError = null;
										}
									});
					    		}
					    	}
					    	else {
					    		profileContChange = false;
					    	}
					    }
					});
				}
				else {
					profileContChange = false;
				}
			}
			else {
				profileContChange = false;
			}
		}
	});

	// Notification button

	profileInfoNotificationEl.addEventListener('singletap', function() {
		var settings = pushnotifications.getNotificationSettings();

		if (settings.enabled == 1) {
			ns.session.cm_status = '';
			Ti.App.Properties.setString('cm_status', '');
			profileInfoNotificationValue.setText(L('ui0060'));
			profileInfoNotificationValue.setColor('#FF3B30');
			//pushNotificationUnregister();
			//unregisterDeviceTokenSuccess(ns.session.cm_id, ns.session.token);
		}
		else {
			ns.session.cm_status = 'on';
			Ti.App.Properties.setString('cm_status', 'on');
			profileInfoNotificationValue.setText(L('ui0059'));
			profileInfoNotificationValue.setColor('#03CA1E');
			//pushNotificationRegister();
		}
	});

	// Geo Push Notification button

	profileInfoGeoNotificationEl.addEventListener('singletap', function() {
		if (ns.session.geo_push_status == 'on') {
			ns.session.geo_push_status = '';
			Ti.App.Properties.setString('geo_push_status', '');
			profileInfoGeoNotificationValue.setText(L('ui0060'));
			profileInfoGeoNotificationValue.setColor('#FF3B30');
		}
		else {
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
					    
						ns.session.geo_push_status = 'on';
						Ti.App.Properties.setString('geo_push_status', 'on');
						profileInfoGeoNotificationValue.setText(L('ui0059'));
						profileInfoGeoNotificationValue.setColor('#03CA1E');
					});					
				}
			});
		}
	});

	// Logout button

	profileInfoLogoutEl.addEventListener('singletap', function() {
		if (profileContChange === false) {
			Ti.App.fireEvent('app:auth_window');
		}
	});

	// Clear cache

	profileInfoClearCacheEl.addEventListener('singletap', function() {
		if (profileContChange === false) {
			var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');

			if (!cacheDir.exists()) {
				cacheDir.createDirectory();
			}

			cacheDir.deleteDirectory(true);

			profileInfoCacheValue.setText(bytesToSize(getFileSystemTotalSize()));
			Ti.App.Properties.setString('user_profile_cache', 0);
			ns.session.user_profile_cache = 0;
		}
	});

	// Support

	profileInfoGetSupportEl.addEventListener('singletap', function() {
		if (profileContChange === false && checkConnection()) {
			var emailDialog = Ti.UI.createEmailDialog();
			emailDialog.subject = L('ui0102');
			emailDialog.toRecipients = ['support@qqnder.com'];
			emailDialog.messageBody = L('ui0103');
			emailDialog.open();
		}
		else if (!checkConnection()) {
			WindowError = require('ui/ErrorWindow');
			windowError = new WindowError(L('ui0010'), L('x0010'));
			windowError.open();

			windowError.addEventListener('close_extra', function() {
				if (windowError != null) {
					WindowError = null;
					windowError = null;
				}
			});
		}
	});

	// Terms

	var webWin;

	profileInfoTermsOfServiceEl.addEventListener('singletap', function() {
		if (profileContChange === false) {
			profileContChange = true;

			if (checkConnection()) {
				var rules_url = 'https://qqnder.com/mobile_rules_' + Ti.Locale.currentLanguage.toLowerCase() + '.html';
				webWin = Ti.UI.createWindow();

				// Top terms

				var topTermsHeaderCont = Ti.UI.createView({
					height: (headerTop + 44),
					width: Ti.Platform.displayCaps.platformWidth,
					top: 0,
					zIndex: 10000
				});

					var topTermsHeaderContBg = Ti.UI.createView({
						height: (headerTop + 44),
						width: Ti.Platform.displayCaps.platformWidth,
						top: 0,
						zIndex: 100,
						backgroundColor: '#F7F7F7'
					});
		
						topTermsHeaderContBg.add(Ti.UI.createView({
							height: 1,
							width: Ti.Platform.displayCaps.platformWidth,
							bottom: 0,
							backgroundColor: '#DADADA'
						}));
		
					var topTermsHeaderCenter = Ti.UI.createView({
						right: 54,
						left: 54,
						height: 44,
						bottom: 0,
						zIndex: 200
					});
	
						var topTermsHeaderCenterLabel = Ti.UI.createLabel({
							textAlign: 'center',
							font: {
								fontFamily: 'OpenSans-Regular',
								fontSize: 16,
								fontWeight: 'normal'
							},
							height: Ti.UI.SIZE,
							color: '#000000',
							text: L('ui0104')
						});
						
					var topTermsHeaderRight = Ti.UI.createView({
						right: 0,
						height: 44,
						width: 54,
						bottom: 0,
						zIndex: 200
					});
	
						var topTermsHeaderRightIcon = Ti.UI.createView({
							backgroundImage: '/img/ios/profile/right_close.png',
							backgroundRepeat: false,
							height: 22,
							width: 22
						});

					topTermsHeaderCont.add(topTermsHeaderContBg);
					topTermsHeaderCenter.add(topTermsHeaderCenterLabel);
					topTermsHeaderCont.add(topTermsHeaderCenter);
					topTermsHeaderRight.add(topTermsHeaderRightIcon);
					topTermsHeaderCont.add(topTermsHeaderRight);
				webWin.add(topTermsHeaderCont);			

				webWin.add(Ti.UI.createWebView({
					top: (headerTop + 44),
					url: rules_url,
					hideLoadIndicator: true,
					zIndex: 10
				}));

				webWin.open({
					modal: true,
					animated: true
				});	

				topTermsHeaderRight.addEventListener('singletap', function() {
					webWin.close();
					profileContChange = false;
				});
			}
			else {
				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();
	
				windowError.addEventListener('close_extra', function() {
					if (windowError != null) {
						WindowError = null;
						windowError = null;
						profileContChange = false;
					}
				});
			}
		}
	});

	// Change full name

	profileFullNameLabel.addEventListener('return', function(e) {
		if (profileContChange === false) {
			profileContChange = true;

			if (checkConnection() && e.value && e.value.trim() != '') {
				profileFullNameLabel.setValue(e.value.trim());
				
				var httpRegister;
	
				/**
				 * Header loading
				 */

				var headerLoading = Ti.UI.createView({
					width: 10,
					height: 2,
					top: (headerTop + 42),
					left: 0,
					backgroundColor: '#007AFF'
				});

				self.add(headerLoading);

				var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);													
				var incLoadingTime = null;

				if (incLoadingTime != null) {
			    	clearInterval(incLoadingTime);
			    }

				httpRegister = Ti.Network.createHTTPClient({
					validatesSecureCertificate: true,
					onreadystatechange: function() {
						if (headerLoading !== undefined) {
							if (this.readyState == 1) {
								headerLoading.animate({
									duration: 400,
									width: parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100)
								});

								incLoadingTime = setInterval(function() {
							    	headerLoading.setWidth(incLoadingVal);
									incLoadingVal = incLoadingVal + 1;
									if (parseInt(65 * Ti.Platform.displayCaps.platformWidth / 100) == incLoadingVal) {
										clearInterval(incLoadingTime);
									}
							    }, 500);
							}
						}
					},
					onload: function() {
						clearInterval(incLoadingTime);

						var headerLoadingProgressAnimation = Ti.UI.createAnimation({
							duration: 400,
							width: Ti.Platform.displayCaps.platformWidth
						});

						headerLoading.animate(headerLoadingProgressAnimation);

						headerLoadingProgressAnimation.addEventListener('complete', function() {
							if (headerLoading !== undefined) {
								self.remove(headerLoading);
							}
						});

						if (isJsonString(this.responseText)) {
							var jsonResult = JSON.parse(this.responseText);

							if (ns.tools.underscore.has(jsonResult, 'error')) {
								if (jsonResult.error.code == '710') {
									Ti.App.fireEvent('app:auth_window');
								}
								else {
									if (ns.session.user_full_name != '') {
										profileFullNameLabel.setValue(ns.session.user_full_name);
									}
									else {
										profileFullNameLabel.setValue('');
									}
				
									WindowError = require('ui/ErrorWindow');
									windowError = new WindowError(L('ui0010'), L('x0014'));
									windowError.open();				

									windowError.addEventListener('close_extra', function() {
										if (windowError != null) {
											profileContChange = false;
											WindowError = null;
											windowError = null;
										}
									});
								}
							}
							else {
								ns.session.user_full_name = e.value.trim();
								Ti.App.Properties.setString('user_full_name', e.value.trim());
								profileFullNameLabel.setValue(e.value.trim());
								profileContChange = false;		
							}
						}
						else {
							if (ns.session.user_full_name != '') {
								profileFullNameLabel.setValue(ns.session.user_full_name);
							}
							else {
								profileFullNameLabel.setValue('');
							}

							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0014'));
							windowError.open();

							windowError.addEventListener('close_extra', function() {
								if (windowError != null) {
									profileContChange = false;
									WindowError = null;
									windowError = null;
								}
							});					
						}
					},
					onerror: function() {
						if (headerLoading !== undefined) {
							self.remove(headerLoading);
						}
						
						if (ns.session.user_full_name != '') {
							profileFullNameLabel.setValue(ns.session.user_full_name);
						}
						else {
							profileFullNameLabel.setValue('');
						}

						WindowError = require('ui/ErrorWindow');
						windowError = new WindowError(L('ui0010'), L('x0011'));
						windowError.open();

						windowError.addEventListener('close_extra', function() {
							if (windowError != null) {
								profileContChange = false;
								WindowError = null;
								windowError = null;
							}
						});	
					},
					timeout: 15000
				});

			    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=update_profile&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&full_name=' + e.value.trim());
			    httpRegister.send();
			}
			else if (!checkConnection()) {
				if (ns.session.user_full_name != '') {
					profileFullNameLabel.setValue(ns.session.user_full_name);
				}
				else {
					profileFullNameLabel.setValue('');
				}
				
				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();
	
				windowError.addEventListener('close_extra', function() {
					if (windowError != null) {
						WindowError = null;
						windowError = null;
						profileContChange = false;
					}
				});
			}
			else {
				if (ns.session.user_full_name != '') {
					profileFullNameLabel.setValue(ns.session.user_full_name);
				}
				else {
					profileFullNameLabel.setValue('');
				}

				profileContChange = false;
			}
		}
	});

	// Load profile info

	self.addEventListener('open', function() {
		if (ns.session.user_full_name != '') {
			profileFullNameLabel.setValue(ns.session.user_full_name);
		}

		if (ns.session.user_sex > 0) {
			if (ns.session.user_sex == 1) {
				profileInfoSexElLabel.setText(L('ui0099'));
			}
			else if (ns.session.user_sex == 2) {
				profileInfoSexElLabel.setText(L('ui0100'));
			}
		}

		if (ns.session.user_date_of_birth != '0000-00-00' && ns.tools.moment(ns.session.user_date_of_birth, 'YYYY-MM-DD', true).isValid()) {
			profileInfoDateOfBirthElLabel.setText(ns.tools.moment(ns.session.user_date_of_birth, ['YYYY-MM-DD']).format('D MMMM YYYY'));
		}

		if (checkConnection()) {

			var httpRegister;

			/**
			 * Header loading
			 */

			var headerLoading = Ti.UI.createView({
				width: 1,
				height: 2,
				top: (headerTop + 42),
				left: 0,
				backgroundColor: '#007AFF'
			});

			self.add(headerLoading);

			var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);													
			var incLoadingTime = null;

			if (incLoadingTime != null) {
		    	clearInterval(incLoadingTime);
		    }

			httpRegister = Ti.Network.createHTTPClient({
				validatesSecureCertificate: true,
				onreadystatechange: function() {
					if (headerLoading !== undefined) {
						if (this.readyState == 1) {
							headerLoading.animate({
								duration: 300,
								width: parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100)
							});

						    incLoadingTime = setInterval(function() {
						    	headerLoading.setWidth(incLoadingVal);
								incLoadingVal = incLoadingVal + 1;
								if (parseInt(65 * Ti.Platform.displayCaps.platformWidth / 100) == incLoadingVal) {
									clearInterval(incLoadingTime);
								}
						    }, 500);
						}
					}
				},
				onload: function() {
					clearInterval(incLoadingTime);

					var headerLoadingProgressAnimation = Ti.UI.createAnimation({
						duration: 400,
						width: Ti.Platform.displayCaps.platformWidth
					});

					headerLoading.animate(headerLoadingProgressAnimation);

					headerLoadingProgressAnimation.addEventListener('complete', function() {
						if (headerLoading !== undefined) {
							self.remove(headerLoading);
						}					
					});

					if (isJsonString(this.responseText)) {
						var jsonResult = JSON.parse(this.responseText);

						if (ns.tools.underscore.has(jsonResult, 'error')) {
							if (jsonResult.error.code == '710') {
								Ti.App.fireEvent('app:auth_window');
							}
							else {
								WindowError = require('ui/ErrorWindow');
								windowError = new WindowError(L('ui0010'), L('x0014'));
								windowError.open();

								windowError.addEventListener('close_extra', function() {
									if (windowError != null) {
										profileContChange = false;
										WindowError = null;
										windowError = null;
									}
								});
							}
						}
						else {
							if (jsonResult.success.result.full_name != '') {
								if (parseInt(jsonResult.success.result.ts_modification) > 0 && parseInt(ns.session.user_ts_modification) < parseInt(jsonResult.success.result.ts_modification)) {
									profileFullNameLabel.setValue(jsonResult.success.result.full_name);
									ns.session.user_full_name = jsonResult.success.result.full_name;
									Ti.App.Properties.setString('user_full_name', jsonResult.success.result.full_name);
								}
							}
							else {
								profileFullNameLabel.setValue('');
								profileFullNameLabel.setHintText(L('ui0098'));
							}

							if (jsonResult.success.result.sex > 0) {
								if (parseInt(jsonResult.success.result.ts_modification) > 0 && parseInt(ns.session.user_ts_modification) < parseInt(jsonResult.success.result.ts_modification)) {
									if (parseInt(jsonResult.success.result.sex) == 1) {
										profileInfoSexElLabel.setText(L('ui0099'));
									}
									else if (parseInt(jsonResult.success.result.sex) == 2) {
										profileInfoSexElLabel.setText(L('ui0100'));
									}

									ns.session.user_sex = parseInt(jsonResult.success.result.sex);
									Ti.App.Properties.setString('user_sex', parseInt(jsonResult.success.result.sex));
								}
							}
							else {
								ns.session.user_sex = 0;
								Ti.App.Properties.setString('user_sex', 0);
								profileInfoSexElLabel.setText(L('ui0096'));
							}

							if (ns.session.user_avatar == '' || ns.session.user_avatar_default == '') {
								ns.session.user_avatar = jsonResult.success.result.user_avatar;
								Ti.App.Properties.setString('user_avatar', jsonResult.success.result.user_avatar);
								ns.session.user_avatar_default = jsonResult.success.result.user_avatar_default;
								Ti.App.Properties.setString('user_avatar_default', jsonResult.success.result.user_avatar_default);
								ns.session.user_ts_avatar_modification = jsonResult.success.result.user_ts_avatar_modification;
								Ti.App.Properties.setString('user_ts_avatar_modification', jsonResult.success.result.user_ts_avatar_modification);

								// remove old avatar
								profileAvatarBack.removeAllChildren();

								profileAvatar = createProfileAvatar.RemoteImage({
									top: 0,
									left: 0,
									width: 60,
									height: 60,
									image: Ti.Utils.base64decode(ns.session.user_avatar).toString(),
									defaultImage: '/img/ios/profile/user_avatar_preload.png',
									ts_modification: ns.session.user_ts_avatar_modification,
									data_user_avatar_default: Ti.Utils.base64decode(ns.session.user_avatar_default).toString()
								});

								//profileAvatar
								profileAvatarBack.add(profileAvatar);
							}
							else if (ns.session.user_ts_avatar_modification < jsonResult.success.result.user_ts_avatar_modification) {
								ns.session.user_avatar = jsonResult.success.result.user_avatar;
								Ti.App.Properties.setString('user_avatar', jsonResult.success.result.user_avatar);
								ns.session.user_avatar_default = jsonResult.success.result.user_avatar_default;
								Ti.App.Properties.setString('user_avatar_default', jsonResult.success.result.user_avatar_default);
								ns.session.user_ts_avatar_modification = jsonResult.success.result.user_ts_avatar_modification;
								Ti.App.Properties.setString('user_ts_avatar_modification', jsonResult.success.result.user_ts_avatar_modification);

								// remove old avatar
								profileAvatarBack.removeAllChildren();

								profileAvatar = createProfileAvatar.RemoteImage({
									top: 0,
									left: 0,
									width: 60,
									height: 60,
									image: Ti.Utils.base64decode(ns.session.user_avatar).toString(),
									defaultImage: '/img/ios/profile/user_avatar_preload.png',
									ts_modification: ns.session.user_ts_avatar_modification,
									data_user_avatar_default: Ti.Utils.base64decode(ns.session.user_avatar_default).toString()
								});

								//profileAvatar
								profileAvatarBack.add(profileAvatar);
							}

							if (jsonResult.success.result.date_of_birth != '0000-00-00' || !ns.tools.moment(jsonResult.success.result.date_of_birth, 'YYYY-MM-DD', true).isValid()) {
								var date_of_birth_arr = jsonResult.success.result.date_of_birth;
								profileInfoDateOfBirthElLabel.setText(ns.tools.moment(date_of_birth_arr, ['YYYY-MM-DD']).format('D MMMM YYYY'));
								ns.session.user_date_of_birth = date_of_birth_arr;
								Ti.App.Properties.setString('user_date_of_birth', date_of_birth_arr);
							}
							else {
								picker.old_date_value = '0000-00-00';
								picker.date_value != '0000-00-00';
								profileInfoDateOfBirthElLabel.setText(L('ui0095'));
								ns.session.user_date_of_birth = '0000-00-00';
								Ti.App.Properties.setString('user_date_of_birth', '0000-00-00');
							}

							profileContChange = false;
						}
					}
					else {
						WindowError = require('ui/ErrorWindow');
						windowError = new WindowError(L('ui0010'), L('x0014'));
						windowError.open();

						windowError.addEventListener('close_extra', function() {
							profileContChange = false;
							
							if (windowError != null) {
								WindowError = null;
								windowError = null;
							}
						});
					}
				},
				onerror: function() {
					if (headerLoading !== undefined) {
						self.remove(headerLoading);
					}

					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0011'));
					windowError.open();

					windowError.addEventListener('close_extra', function() {
						if (windowError != null) {
							profileContChange = false;
							WindowError = null;
							windowError = null;
						}
					});
				},
				timeout: 15000
			});

		    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=get_profile&uuid=' + Ti.Platform.id + '&token=' + ns.session.token);
		    httpRegister.send();
	    }
	    else {
	    	profileContChange = false;
		}
   	});

	// Close window

	self.addEventListener('close', function() {
		if (windowError != null) {
			windowError.close();
		}
	});

	return self;
}

module.exports = ProfileWindow;