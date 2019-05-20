function CommentAddWindow(eventGroupIdd) {

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
	 * Add comment
	 */

	var self = Ti.UI.createWindow({
		top: 0,	    
		left: 0,
		width: Ti.Platform.displayCaps.platformWidth,
		height: Ti.UI.FILL,
		statusBarStyle: Ti.UI.iOS.StatusBar.GRAY,
		backgroundColor: '#FAFAFA'
	});

		// Empty screen

		var spinnerCommentAddCont = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			zIndex: 1000000,
			visible: false,
			backgroundColor: 'RGBA(0, 0, 0, 0.5)'
		});

		self.add(spinnerCommentAddCont);

	// Top Menu

	var topCommentAddHeaderCont = Ti.UI.createView({
		top: 0,
		left: 0,
		height: (headerTop + 44),
		width: Ti.Platform.displayCaps.platformWidth
	});

		topCommentAddHeaderCont.add(Ti.UI.createView({
			height: 1,
			width: Ti.Platform.displayCaps.platformWidth,
			bottom: 0,
			left: 0,
			backgroundColor:'#CDCED2'
		}));

		var topCommentAddHeaderCenter = Ti.UI.createView({
			left: 54,
			right: 54,
			height: 44,
			bottom: 0
		});

			topCommentAddHeaderCenter.add(Ti.UI.createLabel({
				text: L('ui0164'),
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 16,
					fontWeight: 'normal'
				},
				color: '#000000',
				height: Ti.UI.SIZE,
				textAlign: 'center'
			}));

		var topCommentAddHeaderLeft = Ti.UI.createView({
			left: 0,
			width: 54,
			height: 44,
			bottom: 0,
			zIndex: 10
		});

			topCommentAddHeaderLeft.add(Ti.UI.createView({
				width: 22,
				height: 22,
				backgroundImage: '/img/ios/comments/left_slider.png',
				backgroundRepeat: false
			}));

		topCommentAddHeaderCont.add(topCommentAddHeaderCenter);
		topCommentAddHeaderCont.add(topCommentAddHeaderLeft);
	self.add(topCommentAddHeaderCont);

	// Comment input

	var commentInputCont = Ti.UI.createView({
		top: (headerTop + 44),
		left: 0,
		right: 0,
		height: 150,
		backgroundColor: '#FAFAFA'
	});

		var textFieldComment = Ti.UI.createTextArea({
			top: 10,
			font: {
				fontFamily: 'OpenSans-Regular',
				fontSize: 16,
				fontWeight: 'normal'
			},
			left: 25,
			right: 25,
			value: L('ui0160'),
			color: '#8C8C8C',
			height: 140,
			zIndex: 0,
			visible: true,
			hintText: L('ui0160'),
			editable: true,
			maxLength: 250,
			keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
			hintTextColor: '#8C8C8C',
			returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
			preventDefault: true,
			suppressReturn: false,
			backgroundColor: 'transparent',
			autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES
		});

		commentInputCont.add(textFieldComment);
	self.add(commentInputCont);

	self.add(Ti.UI.createView({
		top: (headerTop + 209),
		left: 25,
		right: 25,
		height: 1,
		backgroundColor: '#C8C7CC',
	}));

	var commentCharCounter = Ti.UI.createLabel({
		top: (headerTop + 221),
		text: str_replace('{{value}}', '250', L('ui0166')),
		textAlign: 'center',
		color: '#222222',
		font: {
			fontFamily: 'Open Sans',
			fontSize: 14,
			fontWeight: 'normal'
		}
	});

	self.add(commentCharCounter);

	var commentInputButton = Ti.UI.createView({
		top: (headerTop + 255),
		left: 25,
		right: 25,
		height: 50,
		borderRadius: 5,
		backgroundColor: '#005AFF'
	});

		commentInputButton.add(Ti.UI.createLabel({
			font: {
				fontFamily: 'OpenSans-Regular',
				fontSize: 18,
				fontWeight: 'normal'
			},
			color: '#FFFFFF',
			textAlign: 'center',
			text: L('ui0040')
		}));

	self.add(commentInputButton);

	/**
	 * Actions
	 */

	var addCommentsContChange = true;
	var WindowError = null;
	var windowError = null;

	textFieldComment.addEventListener('focus', function() {
		if(textFieldComment.getValue() == textFieldComment.getHintText()){
			textFieldComment.setValue('');
	        textFieldComment.setColor('#555555');
	    }
	});

	textFieldComment.addEventListener('blur', function(e){
	    if (textFieldComment.getValue() == '') {
	        textFieldComment.setValue(textFieldComment.getHintText());
	        textFieldComment.setColor(textFieldComment.getHintTextColor());
	    }
	});

	textFieldComment.addEventListener('change', function() {
		if (trim(textFieldComment.getValue()) == '') {
			commentCharCounter.setText(str_replace('{{value}}', '250', L('ui0166')));
		}
		else {
			commentCharCounter.setText(str_replace('{{value}}', (250 - trim(textFieldComment.getValue()).length), L('ui0166')));
		}
	});

	// Go back to the previous screen

	topCommentAddHeaderLeft.addEventListener('singletap', function() {
		if (addCommentsContChange === false) {
			addCommentsContChange = true;

	    	self.fireEvent('close_extra');
    		self.close();
    	}
	});

	// Comment Add

	commentInputButton.addEventListener('touchstart', function() {
		commentInputButton.setBackgroundColor('#005AFF');
	});

	commentInputButton.addEventListener('touchend', function() {
		commentInputButton.setBackgroundColor('#007AFF');
	});

	commentInputButton.addEventListener('singletap', function() {
		addCommentsContChange = true;

		if (!checkConnection()) {
			WindowError = require('ui/ErrorWindow');
			windowError = new WindowError(L('ui0010'), L('x0010'));
			windowError.open();

			windowError.addEventListener('close_extra', function() {
				WindowError = null;
				windowError = null;
				addCommentsContChange = false;
			});
		}
		else if (checkConnection() && textFieldComment.getValue().trim() != '') {

			var httpRegister;

			/**
			 * Header loading
			 */

			var headerLoading = Ti.UI.createView({
				top: (headerTop + 42),
				left: 0,
				width: 1,
				height: 2,
				zIndex: 10000,
				backgroundColor: '#555555'
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
								WindowError = require('ui/ErrorWindow');
								windowError = new WindowError(L('ui0010'), L('x0014'));
								windowError.open();

								windowError.addEventListener('close_extra', function() {
									addCommentsContChange = false;
									WindowError = null;
									windowError = null;
								});
							}
						}
						else {
							addCommentsContChange = false;
							topCommentAddHeaderLeft.fireEvent('singletap');
						}
					}
					else {
						WindowError = require('ui/ErrorWindow');
						windowError = new WindowError(L('ui0010'), L('x0014'));
						windowError.open();				
						
						windowError.addEventListener('close_extra', function() {
							addCommentsContChange = false;
							WindowError = null;
							windowError = null;
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
						addCommentsContChange = false;
						WindowError = null;
						windowError = null;
					});
				},
				timeout: 15000
			});

		    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=add_comment&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&text=' + Ti.Network.encodeURIComponent(textFieldComment.getValue().trim()) + '&group_idd=' + eventGroupIdd);
		    httpRegister.send();
		}
		else {
			addCommentsContChange = false;
		}
	});

	// Any tap

	self.addEventListener('singletap', function(e) {
		if (e.source.preventDefault != true) {
			Ti.API.info('DEBUG LOG: Comment Add / Prevent default singletap');

			textFieldComment.blur();
		}
	});

	// Open window

	self.addEventListener('open', function() {
		addCommentsContChange = false;
	});

	// Close window

	self.addEventListener('close', function() {
		if (addCommentsContChange === false) {
			addCommentsContChange = true;

			self.fireEvent('close_extra');
			self.close();
		}
	});

	return self;
}

module.exports = CommentAddWindow;