function ConfernSlide(phone) {

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
	 * Global varibles
	 */

	var interval;
	var minutes_default = 0;
	var minutes = minutes_default;
	var seconds_default = 30;
	var seconds = seconds_default;

	/**
	 * Confern slide
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

		var confernSlideHeaderCont = Ti.UI.createView({
			height: (headerTop + 44),
			width: Ti.Platform.displayCaps.platformWidth,
			top: 0,
			left: 0
		});

			confernSlideHeaderCont.add(Ti.UI.createView({
				height: 1,
				width: Ti.Platform.displayCaps.platformWidth,
				bottom: 0,
				left: 0,
				backgroundColor:'#CDCED2'
			}));

			var confernSlideHeaderCenter = Ti.UI.createView({
				right: 54,
				left: 54,
				height: 44,
				bottom: 0
			});

				confernSlideHeaderCenter.add(Ti.UI.createLabel({
					text: L('ui0196'),
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					height: Ti.UI.SIZE,
					color: '#000000',
					textAlign: 'center'
				}));

			var confernSlideHeaderLeft = Ti.UI.createView({
				left: 0,
				height: 44,
				width: 54,
				bottom: 0,
				zIndex: 10
			});

				confernSlideHeaderLeft.add(Ti.UI.createView({
					backgroundImage: '/img/ios/confern/left_slider.png',
					backgroundRepeat: false,
					height: 22,
					width: 22
				}));

			confernSlideHeaderCont.add(confernSlideHeaderCenter);	
			confernSlideHeaderCont.add(confernSlideHeaderLeft);
		self.add(confernSlideHeaderCont);

		var confernSlide = Ti.UI.createScrollView({
			width: Ti.Platform.displayCaps.platformWidth,
		    height: Ti.UI.FILL,
		    top: (headerTop + 44),
			left: 0,
			contentWidth: Ti.UI.FILL,
		    contentHeight: Ti.UI.SIZE,
		    showVerticalScrollIndicator: false,
		    showHorizontalScrollIndicator: false,
		    layout: 'vertical'
		});

			// Header

			var confernHeaderPositioning = Ti.UI.createView({
				layout: 'horizontal',
				right: 25,
				left: 25,
				top: 25,
				height: Ti.UI.SIZE
			});

				confernHeaderPositioning.add(Ti.UI.createLabel({
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

				confernHeaderPositioning.add(Ti.UI.createLabel({
					top: 0,
					left: 7,
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					text: phone.toUpperCase(),
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 14,
						fontWeight: 'normal'
					},
					color: '#5c5c5c'
				}));

			confernSlide.add(confernHeaderPositioning);

			confernSlide.add(Ti.UI.createLabel({
				left: 25,
				right: 25,
				text: L('ui0014'),
				top: 8,
				textAlign: 'left',
				height: Ti.UI.SIZE,
				color: '#000000',
				font: {
					fontFamily: 'OpenSans-Bold',
					fontSize: 24,
					fontWeight: 'normal'
				}
			}));

			// Confern

			confernSlide.add(Ti.UI.createView({
				width: Ti.UI.FILL,
				height: 1,
				backgroundColor: '#EFEFF3',
				top: 20,
				left: 0
			}));

			var confernInputCont = Ti.UI.createView({
				height: 50,
				top: 0,
				left: 0,
				right: 0,
				backgroundColor: '#FFFFFF'
			});

				var confernInputAlertIcon = Ti.UI.createView({
					width: 22,
					height: 22,
					top: 14,
					right: 25,
					zIndex: 20,
					visible: false,
					backgroundImage: '/img/ios/confern/circle_alert.png',
					backgroundRepeat: false
				});

				var textFieldConfern = Ti.UI.createTextField({
					top: 5,
					font: {
						fontSize: 16,
						fontWeight: 'normal',
						fontFamily: 'OpenSans-Regular',
					},
					left: 25,
					color: '#5C5C5C',
					right: 25,
					value: '',
					height: 40,
					visible: true,
					hintText: L('ui0021'),
					maxLength: 5,
					textAlign: 'left',
					hintTextColor: '#8C8C8C',
					preventDefault: true,
					backgroundColor: 'transparent',
					autocapitalization: false,
					keyboardType: Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
					returnKeyType: Ti.UI.RETURNKEY_NEXT
				});

				confernInputCont.add(textFieldConfern);
				confernInputCont.add(confernInputAlertIcon);
			confernSlide.add(confernInputCont);

			confernSlide.add(Ti.UI.createView({
				width: Ti.UI.FILL,
				height: 1,
				left: 0,
				top: 0,
				backgroundColor: '#EFEFF3'
			}));

			// Extra interval text

			var intervalText = Ti.UI.createLabel({
				top: 27,
				left: 25,
				font: {
					fontFamily: 'Open Sans',
					fontSize: 14,
					fontWeight: 'normal'
				},
				text: L('ui0197').replace('{{value}}', 30 + ' ' + L('ui0049')),
				right: 25,
				color: '#999999',
				textAlign: 'center',
				preventDefault: true
			});

			confernSlide.add(intervalText);
		self.add(confernSlide);

	/**
	 * Actions
	 */

	var confernContChange = false;

	// Open add comments

	self.addEventListener('open', function() {
		interval = setInterval(function() {
		    if (seconds == 0) {
		        if (minutes == 0) {
		            intervalText.setText(L('x0015'));                    
		            clearInterval(interval);
		            return;
		        }
		        else {
		            minutes--;
		            seconds = 60;
		        }
		    }

		    var minute_text = '';

		    if (minutes > 0) {
		        minute_text = minutes + (minutes > 1 ? ' ' + L('ui0048') : ' ' + L('ui0048'));
		    }

		    var second_text = seconds > 1 ? L('ui0049') : L('ui0049');

		    intervalText.setText(L('ui0197').replace('{{value}}', seconds + ' ' + second_text));
		    seconds--;
		}, 1000);
	});

	// Add comment
	
	var WindowMenu = null;
	var windowMenu = null;

	textFieldConfern.addEventListener('change', function() {
		if (confernContChange === false) {
			confernContChange = true;

			confernInputAlertIcon.setVisible(false);
			var confernField = trim(textFieldConfern.getValue());

			if (textFieldConfern.getValue().length == 5) {
				textFieldConfern.blur();

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
								if (jsonResult.error.code == '731' || jsonResult.error.code == '710') {
									confernContChange = false;
									confernInputAlertIcon.setVisible(true);
									textFieldConfern.focus();
								}
								else {
									var WindowError = require('ui/ErrorWindow');
									var windowError = new WindowError(L('ui0010'), L('x0014'));
									windowError.open();

									windowError.addEventListener('close_extra', function() {
										confernContChange = false;
										WindowError = null;
										windowError = null;
									});
								}
							}
							else {
								ns.session.token = jsonResult.success.result.token;
								Ti.App.Properties.setString('active_session', ns.session.token);
								ns.session.user_avatar = jsonResult.success.result.user_avatar;
								Ti.App.Properties.setString('user_avatar', jsonResult.success.result.user_avatar);
								ns.session.user_avatar_default = jsonResult.success.result.user_avatar_default;
								Ti.App.Properties.setString('user_avatar_default', jsonResult.success.result.user_avatar_default);
								ns.session.user_ts_modification = parseInt(jsonResult.success.result.user_ts_modification);
								Ti.App.Properties.setString('user_ts_modification', parseInt(jsonResult.success.result.user_ts_modification));
								ns.session.user_ts_avatar_modification = parseInt(jsonResult.success.result.user_ts_avatar_modification);
								Ti.App.Properties.setString('user_ts_avatar_modification', parseInt(jsonResult.success.result.user_ts_avatar_modification));
								ns.session.phone_number = phone;
								Ti.App.Properties.setString('phone_number', phone);
								ns.session.user_full_name = jsonResult.success.result.user_full_name;
								Ti.App.Properties.setString('user_full_name', jsonResult.success.result.user_full_name);
								ns.session.user_sex = parseInt(jsonResult.success.result.user_sex);
								Ti.App.Properties.setString('user_sex', parseInt(jsonResult.success.result.user_sex));
								ns.session.user_date_of_birth = jsonResult.success.result.user_date_of_birth;
								Ti.App.Properties.setString('user_date_of_birth', jsonResult.success.result.user_date_of_birth);

								ns.session.cm_status = 'on';
								Ti.App.Properties.setString('cm_status', 'on');

								setTimeout(function() {
									WindowMenu = require('ui/MenuWindow');
									windowMenu = new WindowMenu();
									windowMenu.open();

									windowMenu.addEventListener('open', function() {
										setTimeout(function() {
											confernContChange = false;
										}, 500);
									});

									windowMenu.addEventListener('close_extra', function() {
										confernContChange = false;
										WindowMenu = null;
										windowMenu = null;
									});
								}, 700);
							}
						}
						else {
							var WindowError = require('ui/ErrorWindow');
							var windowError = new WindowError(L('ui0010'), L('x0014'));
							windowError.open();				
							
							windowError.addEventListener('close_extra', function() {
								confernContChange = false;
								WindowError = null;
								windowError = null;
							});						
						}
					},
					onerror: function() {
						clearInterval(incLoadingTime);

						if (headerLoading !== undefined) {
							self.remove(headerLoading);
						}

						var WindowError = require('ui/ErrorWindow');
						var windowError = new WindowError(L('ui0010'), L('x0011'));
						windowError.open();				

						windowError.addEventListener('close_extra', function() {
							confernContChange = false;
							WindowError = null;
							windowError = null;
						});
					},
					timeout: 15000
				});

			    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=auth&uuid=' + Ti.Platform.id + '&phone=' +  phone + '&code=' + confernField + '&screen_type=' + Ti.Platform.displayCaps.dpi);
			    httpRegister.send();
			}
			else {
				confernContChange = false;
			}
		}
	});

	// Any tap

	self.addEventListener('singletap', function(e) {
		if (e.source.preventDefault != true) {
			textFieldConfern.blur();
		}
	});

	// Go back to the previous screen

	confernSlideHeaderLeft.addEventListener('singletap', function() {
		if (confernContChange === false) {
			confernContChange = true;
			textFieldConfern.blur();
			clearInterval(interval);
			minutes = minutes_default;
			seconds = seconds_default;

	    	confernContChange = true;
	    	self.fireEvent('close_extra');
	    	self.close();
		}
	});

	/*
	self.addEventListener('app:receive_notification', function(e) {
		if (windowEvents != null) {
			windowEvents.fireEvent('app:receive_notification', e);
		}
	});

	self.addEventListener('app:push_notification', function(e) {
		if (windowEvents != null) {
			windowEvents.fireEvent('app:push_notification', e);
		}
	});

	self.addEventListener('app:resumed', function() {
		if (windowEvents != null) {
			windowEvents.fireEvent('app:resumed');
		}
	});
	*/

	return self;
}

module.exports = ConfernSlide;