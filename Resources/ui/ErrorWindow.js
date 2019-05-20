function ErrorWindow(title, description) {

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
	 * Error
	 */

	var self = Titanium.UI.createWindow({
		top: 0,
		left: 0,
	    width: Ti.Platform.displayCaps.platformWidth,
	    height: Ti.UI.FILL
	});

		// Top

		var top = Titanium.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: (parseInt(Ti.Platform.displayCaps.platformHeight) / 2),
			zIndex: 10
		});

			top.add(Titanium.UI.createView({
				width: 68,
				height: 68,
				bottom: 40,
				zIndex: 20,
				backgroundImage: '/img/ios/error/eIcon.png',
				backgroundRepeat: false
			}));

			var topPre = Titanium.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.FILL,
				backgroundColor: 'RGBA(0, 0, 0, 0.2)'
			});

			top.add(topPre);
	    self.add(top);

		// Down

		var down = Titanium.UI.createView({
			height: (parseInt(Ti.Platform.displayCaps.platformHeight) / 2),
			width: Ti.Platform.displayCaps.platformWidth,
			bottom: 0,
			zIndex: 10,
			left: 0
		});

			down.add(Titanium.UI.createLabel({
				top: 55,
				text: title,
				font: {
					fontSize: 24,
					fontWeight: 'normal',
					fontFamily: 'OpenSans-Bold'
				},
				color: '#000000',
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				zIndex: 10
			}));

			down.add(Titanium.UI.createTextArea({
				top: 90,
				left: 70,
				font: {
					fontSize: 14,
					fontFamily: 'OpenSans-Regular',
					fontWeight: 'normal'
				},
				right: 70,
				value: description,
				color: '#3E3E3E',
				zIndex: 10,
				editable: false,
				textAlign: 'center',
				touchEnabled: false,
				verticalAlign: 'top',
				backgroundColor: 'transparent'
			}));

			down.add(Titanium.UI.createView({	
				top: 30,
				width: 22,
				zIndex: 10,
				height: 9,
				backgroundImage: '/img/ios/error/slideDown.png',
				backgroundRepeat: false
			}));

			var downPre = Titanium.UI.createView({
				top: 0,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.FILL,
				backgroundColor: 'RGBA(255, 255, 255, 0.9)'
			});

			down.add(downPre);
	    self.add(down);

	/**
	 * Actions
	 */

	var errorContChange = true;

	// Open error
	
	self.addEventListener('open', function() {
		errorContChange = false;
	});	

	// Close error

    self.addEventListener('singletap', function(e) {
    	if (errorContChange === false) {
    		errorContChange = true;

			setTimeout(function() {
				self.fireEvent('close_extra');
				self.close();
			}, 200);
    	}
	});

	// Extra close error by swipe

	self.addEventListener('swipe', function(e) {
		self.fireEvent('singletap');
	});

	return self;
}

module.exports = ErrorWindow;