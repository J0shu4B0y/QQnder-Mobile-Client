function RegisterSlide() {

	/*
	 * iOS version style
	 */

	var headerTop = 0;

	if (isiPhoneX()) {
		headerTop = 44;
	}
	else if (versionChecker(Ti.Platform.getVersion(), '7.0')) {
		headerTop = 20;
	}

	/*
	 * Private functions
	 */

	function phone_code(country_code) {
		var result = '+7 ';
		
		if (country_code == 'country_KZ') {
			result = '+7 ';
		}

		return result;
	};
		
	/*
	 * Register
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

		var topSingInAndRegisterSlideHeaderCont = Ti.UI.createView({
			height: (headerTop + 44),
			width: Ti.Platform.displayCaps.platformWidth,
			top: 0,
			left: 0
		});

			topSingInAndRegisterSlideHeaderCont.add(Ti.UI.createView({
				height: 1,
				width: Ti.Platform.displayCaps.platformWidth,
				bottom: 0,
				left: 0,
				backgroundColor:'#CDCED2'
			}));

			var topSingInAndRegisterSlideHeaderCenter = Ti.UI.createView({
				right: 54,
				left: 54,
				height: 44,
				bottom: 0
			});

				topSingInAndRegisterSlideHeaderCenter.add(Ti.UI.createLabel({
					text: L('ui0047'),
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					height: Ti.UI.SIZE,
					color: '#000000',
					textAlign: 'center'
				}));

			var topSingInAndRegisterSlideHeaderLeft = Ti.UI.createView({
				left: 0,
				height: 44,
				width: 54,
				bottom: 0
			});

				topSingInAndRegisterSlideHeaderLeft.add(Ti.UI.createView({
					backgroundImage: '/img/ios/register/left_slider.png',
					backgroundRepeat: false,
					height: 22,
					width: 22
				}));

			topSingInAndRegisterSlideHeaderCont.add(topSingInAndRegisterSlideHeaderCenter);
			topSingInAndRegisterSlideHeaderCont.add(topSingInAndRegisterSlideHeaderLeft);
		self.add(topSingInAndRegisterSlideHeaderCont);

		var singInAndRegisterSlide = Ti.UI.createScrollView({
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

			var menuTypePositioning = Ti.UI.createView({
				layout: 'horizontal',
				right: 25,
				left: 25,
				top: 25,
				height: Ti.UI.SIZE
			});

				menuTypePositioning.add(Ti.UI.createLabel({
					top: 0,
					left: 0,
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					text: L('ui0195').toUpperCase(),
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 14,
						fontWeight: 'normal'
					},
					color: '#5C5C5C'
				}));

			singInAndRegisterSlide.add(menuTypePositioning);

			singInAndRegisterSlide.add(Ti.UI.createLabel({
				left: 25,
				right: 25,
				text: L('ui0023'),
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

			// Country

			singInAndRegisterSlide.add(Ti.UI.createView({
				width: Ti.UI.FILL,
				height: 1,
				backgroundColor: '#EFEFF3',
				top: 20,
				left: 0
			}));

			var countryInputCont = Ti.UI.createView({
				height: 50,
				width: Ti.Platform.displayCaps.platformWidth,
				top: 0,
				left: 0,
				right: 0,
				backgroundColor: '#FFFFFF'
			});

				var textFieldCountryFake = Ti.UI.createTextField({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					color: '#8C8C8C',
					textAlign: 'left',
					backgroundColor: 'transparent',
					top: 5,
					left: 25,
					right: 25,
					height: 40,
					value: L('country_KZ'),
					editable: false,
					preventDefault: true
				});

			    countryInputCont.add(textFieldCountryFake);

				countryInputCont.add(Ti.UI.createView({
					backgroundImage: '/img/ios/register/select_down.png',
					backgroundRepeat: false,
					height: 13,
					width: 8,
					top: 19,
					right: 25
				}));

			singInAndRegisterSlide.add(countryInputCont);

			// Phone

			var singInAndRegisterHrCont = Ti.UI.createView({
				width: Ti.UI.FILL,
				height: 1,
				backgroundColor: '#FFFFFF',
				top: 0,
				left: 0
			});

				singInAndRegisterHrCont.add(Ti.UI.createView({
					width: Ti.UI.FILL,
					height: 1,
					backgroundColor: '#EFEFF3',
					top: 0,
					left: 25,
					right: 25
				}));

			singInAndRegisterSlide.add(singInAndRegisterHrCont);

			var phoneInputCont = Ti.UI.createView({
				height: 50,
				top: 0,
				left: 0,
				right: 0,
				backgroundColor: '#FFFFFF'
			});

				var phoneInputAlertIcon = Ti.UI.createView({
					top: 14,
					width: 22,
					right: 25,
					height: 22,
					zIndex: 20,
					visible: false,
					backgroundImage: '/img/ios/register/circle_alert.png',
					backgroundRepeat: false
				});

				var textFieldPhone = Ti.UI.createTextField({
					top: 5,
					left: 65,
					font: {
						fontSize: 16,
						fontFamily: 'OpenSans-Regular',
						fontWeight: 'normal'
					},
					width: Ti.UI.FILL,
					value: '',
					color: '#5C5C5C',
					height: 40,
					visible: true,
					hintText: L('ui0015'),
					maxLength: 20,
					keyboardType: Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
					returnKeyType: Ti.UI.RETURNKEY_NEXT,
					hintTextColor: '#8C8C8C',
					preventDefault: true,
					backgroundColor: 'transparent',
					autocapitalization: false
				});

				var textFieldPrePhone = Ti.UI.createTextField({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					color: '#999999',
					backgroundColor: 'transparent',
					top: 5,
					left: 25,
					width: 40,
					height: 40,
					value: phone_code('country_KZ'),
					editable: false,
					preventDefault: true,
					textAlign: 'left'
				});

				phoneInputCont.add(textFieldPhone);
				phoneInputCont.add(textFieldPrePhone);
				phoneInputCont.add(phoneInputAlertIcon);
			singInAndRegisterSlide.add(phoneInputCont);

			singInAndRegisterSlide.add(Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.UI.FILL,
				height: 1,
				backgroundColor: '#EFEFF3'
			}));

			// Slide Forward

			var registerToFinishCont = Ti.UI.createView({
				top: 20,
				right: 25,
				left: 25,
				height: 50,
				backgroundColor: '#005AFF',
				borderRadius: 5
			});

				registerToFinishCont.add(Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 18,
						fontWeight: 'normal'
					},
					color: '#FFFFFF',
					textAlign: 'center',
					text: L('ui0011'),
					preventDefault: true
				}));

			singInAndRegisterSlide.add(registerToFinishCont);

			// Extra singIn text

			var registerRuleTextAttr = Titanium.UI.createAttributedString({
			    text: L('ui0018'),
			    attributes: [
			    	{
			            type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
                		value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
                		range: [0, L('ui0018').length]
			       	}
			    ]
			});

			var registerRuleText = Ti.UI.createLabel({
				color: '#8C8C8C',
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 15,
					fontWeight: 'normal'
				},
				textAlign: 'center',	
				top: 20,
				left: 25,
				right: 25,
				attributedString: registerRuleTextAttr,
				preventDefault: true
			});

			singInAndRegisterSlide.add(registerRuleText);

			singInAndRegisterSlide.add(Ti.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 20
			}));
			
		self.add(singInAndRegisterSlide);

	/**
	 * Actions
	 */
	
	var registerToFinishContChange = false;
	
	registerToFinishCont.addEventListener('touchstart', function() {
		registerToFinishCont.setBackgroundColor('#005AFF');
	});

	registerToFinishCont.addEventListener('touchend', function() {
		registerToFinishCont.setBackgroundColor('#007AFF');
	});

	var ConfernSlide = null;
	var confernSlide = null;

	registerToFinishCont.addEventListener('singletap', function() {
		if (registerToFinishContChange === false) {
			registerToFinishContChange = true;
			textFieldPhone.blur();
			phoneInputAlertIcon.setVisible(false);

			var phoneField = trim(textFieldPhone.getValue());

			if (!phoneField || phoneField == '') {
				registerToFinishContChange = false;
				phoneInputAlertIcon.setVisible(true);
			}
			else if (!checkConnection()) {
				var WindowError = require('ui/ErrorWindow');
				var windowError = new WindowError(L('ui0010'), L('x0011'));
				windowError.open();

				windowError.addEventListener('close_extra', function() {
					registerToFinishContChange = false;
					WindowError = null;
					windowError = null;
				});
			}
			else {
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
								if (jsonResult.error.code == '729' || jsonResult.error.code == '730') {
									phoneInputAlertIcon.setVisible(true);
									textFieldPhone.focus();
									registerToFinishContChange = false;
								}
								else {
									var WindowError = require('ui/ErrorWindow');
									var windowError = new WindowError(L('ui0010'), L('x0014'));
									windowError.open();				
									
									windowError.addEventListener('close_extra', function() {
										registerToFinishContChange = false;
										WindowError = null;
										windowError = null;
									});
								}	
							}
							else {								
								setTimeout(function() {
									ConfernSlide = require('ui/ConfernSlide');
									confernSlide = new ConfernSlide((trim(textFieldPrePhone.getValue()) + trim(textFieldPhone.getValue())));
									confernSlide.open();

									confernSlide.addEventListener('close_extra', function() {
										registerToFinishContChange = false;
										ConfernSlide = null;
										confernSlide = null;
									});
								}, 700);
							}
						}
						else {
							var WindowError = require('ui/ErrorWindow');
							var windowError = new WindowError(L('ui0010'), L('x0014'));
							windowError.open();
							
							windowError.addEventListener('close_extra', function() {
								registerToFinishContChange = false;
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
							registerToFinishContChange = false;
							WindowError = null;
							windowError = null;
						});
					},
					timeout: 15000
				});

			    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=register&uuid=' + Ti.Platform.id + '&phone=' +  trim(textFieldPrePhone.getValue()) + phoneField + '&lang=' + Ti.Platform.locale);
			    httpRegister.send();
			}
		}
	});

	registerRuleText.addEventListener('singletap', function() {
		if (registerToFinishContChange === false) {
			registerToFinishContChange = true;

			if (checkConnection()) {
				var rules_url = 'https://qqnder.com/mobile_rules_' + Ti.Locale.currentLanguage.toLowerCase() + '.html';
				var webWin = Ti.UI.createWindow();

				// Top terms

				var topTermsHeaderCont = Ti.UI.createView({
					height: (headerTop + 44),
					width: Ti.Platform.displayCaps.platformWidth,
					top: 0,
					left: 0,
					zIndex: 10000
				});

					var topTermsHeaderContBg = Ti.UI.createView({
						height: (headerTop + 44),
						width: Ti.Platform.displayCaps.platformWidth,
						top: 0,
						left: 0,
						zIndex: 100,
						backgroundColor: '#FAFAFA'
					});

						topTermsHeaderContBg.add(Ti.UI.createView({
							height: 1,
							width: Ti.Platform.displayCaps.platformWidth,
							bottom: 0,
							left: 0,
							backgroundColor: '#CDCED2'
						}));

					var topTermsHeaderCenter = Ti.UI.createView({
						right: 54,
						left: 54,
						height: 44,
						bottom: 0,
						zIndex: 200
					});

						topTermsHeaderCenter.add(Ti.UI.createLabel({
							textAlign: 'center',
							font: {
								fontFamily: 'OpenSans-Regular',
								fontSize: 16,
								fontWeight: 'normal'
							},
							height: Ti.UI.SIZE,
							color: '#000000',
							text: L('ui0104')
						}));

					var topTermsHeaderRight = Ti.UI.createView({
						right: 0,
						height: 44,
						width: 54,
						bottom: 0,
						zIndex: 200
					});

						topTermsHeaderRight.add(Ti.UI.createView({
							backgroundImage: '/img/ios/register/close.png',
							backgroundRepeat: false,
							height: 24,
							width: 24
						}));
	
					topTermsHeaderCont.add(topTermsHeaderContBg);
					topTermsHeaderCont.add(topTermsHeaderCenter);
					topTermsHeaderCont.add(topTermsHeaderRight);
				webWin.add(topTermsHeaderCont);			
	
				webWin.add(Ti.UI.createWebView({
					top: (headerTop + 44),
					url: rules_url,
					hideLoadIndicator: true,
					backgroundColor: '#FAFAFA'
				}));

				webWin.open({
					modal: true,
					animated: true
				});	

				topTermsHeaderRight.addEventListener('singletap', function() {
					registerToFinishContChange = false;
					webWin.close();
				});
			}
			else {
				var WindowError = require('ui/ErrorWindow');
				var windowError = new WindowError(L('ui0010'), L('x0011'));
				windowError.open();
				
				windowError.addEventListener('close_extra', function() {
					registerToFinishContChange = false;
					WindowError = null;
					windowError = null;
				});
			}
		}
	});

	self.addEventListener('singletap', function(e) {
		if (e.source.preventDefault != true) {
			textFieldPhone.blur();
		}
	});

	function showIntro() {
		if (registerToFinishContChange === false) {
			textFieldPhone.blur();
	    	self.fireEvent('close_extra');
	    	self.close();
		}
	};

	topSingInAndRegisterSlideHeaderLeft.addEventListener('singletap', showIntro);

	/*
	self.addEventListener('app:receive_notification', function(e) {
		if (confernSlide != null) {
			confernSlide.fireEvent('app:receive_notification', e);
		}
	});

	self.addEventListener('app:push_notification', function(e) {
		if (confernSlide != null) {
			confernSlide.fireEvent('app:push_notification', e);
		}
	});

	self.addEventListener('app:resumed', function() {
		if (confernSlide != null) {
			confernSlide.fireEvent('app:resumed');
		}
	});
	*/

	return self;
}

module.exports = RegisterSlide;