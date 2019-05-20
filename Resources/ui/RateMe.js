function rateMe(appId) {

	var self = Ti.UI.createWindow({
		top: 0,
	    left: 0,
		width: Ti.Platform.displayCaps.platformWidth,
	    height: Ti.UI.FILL,
	    zIndex: 10000000000,
	    statusBarStyle: Ti.UI.iOS.StatusBar.GRAY,
	    backgroundColor: 'RGBA(0, 0, 0, 0.5)'
	});

		var rateCont = Titanium.UI.createView({
			width: 280,
			height: Ti.UI.SIZE,
			layout: 'vertical',
			borderRadius: 5,
			preventDefault: true,
			backgroundColor: 'RGBA(255, 255, 255, 1)'
		});

			var rateTitleCont = Titanium.UI.createView({
				top: 25,
				left: 25,
				right: 25,
				height: Ti.UI.SIZE,
				preventDefault: true
			});

				rateTitleCont.add(Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#000000',
					text: L('ui0088'),
					textAlign: 'center',
					preventDefault: true
				}));

			rateCont.add(rateTitleCont);

			rateCont.add(Ti.UI.createLabel({
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 15,
					fontWeight: 'normal'
				},
				color: '#5C5C5C',
				text: L('ui0089'),
				top: 15,
				left: 25,
				right: 25,
				textAlign: 'center',
				preventDefault: true
			}));

			rateCont.add(Titanium.UI.createView({
				top: 20,
				left: 0,
				height: 1,
				width: Ti.UI.FILL,
				backgroundColor: '#EFEFF3',
				preventDefault: true
			}));

			var rateAddRateCont = Titanium.UI.createView({
				top: 0,
				left: 0,
				height: 50,
				width: Ti.UI.FILL
			});

				rateAddRateCont.add(Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#000000',
					text: L('ui0090'),
					height: Ti.UI.SIZE
				}));

			rateCont.add(rateAddRateCont);

			rateCont.add(Titanium.UI.createView({
				top: 0,
				left: 0,
				height: 1,
				width: Ti.UI.FILL,
				backgroundColor: '#EFEFF3',
				preventDefault: true
			}));

			var rateRateNotDisturbCont = Titanium.UI.createView({
				top: 0,
				left: 0,
				height: 50,
				width: Ti.UI.FILL
			});

				rateRateNotDisturbCont.add(Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#000000',
					text: L('ui0091'),
					height: Ti.UI.SIZE
				}));

			rateCont.add(rateRateNotDisturbCont);
		self.add(rateCont);

	/**
	 * Actions
	 */

	function toRate() {
		Ti.App.Properties.setString('RemindToRate' + Ti.App.version, -1);
		Ti.Platform.openURL('itms-apps://itunes.apple.com/app/id' + appId);			
		self.close();
	};

	function notDisturb() {
		Ti.App.Properties.setString('RemindToRate' + Ti.App.version, -1);
		self.close();
	};

	rateAddRateCont.removeEventListener('singletap', toRate);
	rateAddRateCont.addEventListener('singletap', toRate);

	rateRateNotDisturbCont.removeEventListener('singletap', notDisturb);
	rateRateNotDisturbCont.addEventListener('singletap', notDisturb);

	return self;
}

module.exports = rateMe;