function AuthWindow() {

	var self = Ti.UI.createWindow({
		top: 0,
		left: 0,
		backgroundColor: '#FAFAFA',
		statusBarStyle: Ti.UI.iOS.StatusBar.DEFAULT,
		width: Ti.Platform.displayCaps.platformWidth,
		height: Ti.UI.FILL
	});

	function buildAView1() {
		var view1 = Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL
		});
		
			var authSlideTop = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: '50%',
				zIndex: 10,
				top: 0
			});
	
				authSlideTop.add(Ti.UI.createView({
					width: 150,
					bottom: 20,
					height: 150,
					backgroundImage: '/img/ios/auth/logo.png',
					backgroundRepeat: false
				}));
				
			var authSlideBottom = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				top: '50%',
				layout: 'vertical',
				zIndex: 10
			});
	
				authSlideBottom.add(Ti.UI.createLabel({
					color: '#000000',
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 24,
						fontWeight: 'normal'
					},
					text: L('ui0027'),
					top: 20
				}));
		
				authSlideBottom.add(Ti.UI.createLabel({
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#5C5C5C',
					text: L('ui0026'),
					top: 12,
					width: 280
				}));
		
			view1.add(authSlideTop);
			view1.add(authSlideBottom);

		return view1;
	};

	function buildAView2() {
		var view2 = Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL
		});
	
			var authSlide2Top = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: '50%',
				zIndex: 10,
				top: 0
			});
		
				authSlide2Top.add(Ti.UI.createView({
					width: 150,
					bottom: 20,
					height: 150,
					backgroundImage: '/img/ios/auth/slide2.png',
					backgroundRepeat: false
				}));
				
			var authSlide2Bottom = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				top: '50%',
				layout: 'vertical',
				zIndex: 10
			});
	
				authSlide2Bottom.add(Ti.UI.createLabel({
					color: '#000000',
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 24,
						fontWeight: 'normal'
					},
					text: L('ui0173'),
					top: 20
				}));
	
				authSlide2Bottom.add(Ti.UI.createLabel({
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#5C5C5C',
					text: L('ui0174'),
					top: 12,
					width: 280
				}));
	
			view2.add(authSlide2Top);
			view2.add(authSlide2Bottom);

		return view2;
	};

	function buildAView3() {
		var view3 = Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL
		});
	
			var authSlide3Top = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: '50%',
				zIndex: 10,
				top: 0
			});
	
				authSlide3Top.add(Ti.UI.createView({
					width: 150,
					bottom: 20,
					height: 150,
					backgroundImage: '/img/ios/auth/slide3.png',
					backgroundRepeat: false
				}));
	
			var authSlide3Bottom = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				top: '50%',
				layout: 'vertical',
				zIndex: 10
			});
	
				authSlide3Bottom.add(Ti.UI.createLabel({
					color: '#000000',
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 24,
						fontWeight: 'normal'
					},
					text: L('ui0183'),
					top: 20
				}));
	
				authSlide3Bottom.add(Ti.UI.createLabel({
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#5C5C5C',
					text: L('ui0184'),
					top: 12,
					width: 280
				}));
	
			view3.add(authSlide3Top);
			view3.add(authSlide3Bottom);

		return view3;
	};

	function buildAView4() {
		var view4 = Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL
		});

			var authSlide4Top = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: '50%',
				zIndex: 10,
				top: 0
			});

				authSlide4Top.add(Ti.UI.createView({
					width: 150,
					bottom: 20,
					height: 150,
					backgroundImage: '/img/ios/auth/slide4.png',
					backgroundRepeat: false
				}));

			var authSlide4Bottom = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				top: '50%',
				layout: 'vertical',
				zIndex: 10
			});
	
				authSlide4Bottom.add(Ti.UI.createLabel({
					color: '#000000',
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 24,
						fontWeight: 'normal'
					},
					text: L('ui0185'),
					top: 20
				}));
	
				authSlide4Bottom.add(Ti.UI.createLabel({
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#5C5C5C',
					text: L('ui0186'),
					top: 12,
					width: 280
				}));
	
			view4.add(authSlide4Top);
			view4.add(authSlide4Bottom);

		return view4;
	};

	function buildAView5() {
		var view5 = Ti.UI.createView({
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL
		});
	
			var authSlide5Top = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: '50%',
				zIndex: 10,
				top: 0
			});
	
				authSlide5Top.add(Ti.UI.createView({
					width: 150,
					bottom: 20,
					height: 150,
					backgroundImage: '/img/ios/auth/slide5.png',
					backgroundRepeat: false
				}));
	
			var authSlide5Bottom = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				top: '50%',
				layout: 'vertical',
				zIndex: 10
			});
	
				authSlide5Bottom.add(Ti.UI.createLabel({
					color: '#000000',
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 24,
						fontWeight: 'normal'
					},
					text: L('ui0187'),
					top: 20
				}));
	
				authSlide5Bottom.add(Ti.UI.createLabel({
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#5C5C5C',
					text: L('ui0188'),
					top: 12,
					width: 280
				}));
	
			view5.add(authSlide5Top);
			view5.add(authSlide5Bottom);		
	
			var authBottomSliderSlide5Cont = Ti.UI.createView({
				width: Ti.UI.SIZE,
				height: 25,
				layout: 'horizontal',
				bottom: 15,
				zIndex: 20
			});
	
				authBottomSliderSlide5Cont.add(Ti.UI.createView({
					width: 12,
					height: 20,
					top: 5,
					right: 15
				}));
	
				authBottomSliderSlide5Cont.add(Ti.UI.createLabel({
					textAlign: 'center',
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 18,
						fontWeight: 'normal'
					},
					color: '#000000',			
					text: L('ui0025')
				}));
	
				authBottomSliderSlide5Cont.add(Ti.UI.createView({
					width: 12,
					height: 20,
					backgroundImage: '/img/ios/auth/bottom_slider_icon.png',
					backgroundRepeat: false,
					top: 3,
					left: 13
				}));
	
			view5.add(authBottomSliderSlide5Cont);
			
			var authBottomSliderEventEventListener = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth,
				height: 25,
				bottom: 15,
				zIndex: 30
			});

			view5.add(authBottomSliderEventEventListener);

			authBottomSliderEventEventListener.addEventListener('singletap', function() {
				self.fireEvent('app:auth_singletap');
			});
			
			authBottomSliderEventEventListener.addEventListener('swipe', function() {
				self.fireEvent('app:auth_singletap');
			});
	
		return view5;
	};

	var authScrollableView = Ti.UI.createScrollableView({
	  	top: 0,
	  	left: 0,
	  	showPagingControl: true,
	  	pageIndicatorColor: '#8C8C8C',
	  	currentPageIndicatorColor: '#000000',
	  	pagingControlAlpha: 1,
	  	pagingControlColor: '#FAFAFA',
	  	pagingControlHeight: 40,
	  	views: [
	  		buildAView1(),
	  		buildAView2(),
	  		buildAView3(),
	  		buildAView4(),
	  		buildAView5()
	  	]
	});

	self.add(authScrollableView);

	/**
	 * Actions
	 */

	authScrollableView.addEventListener('scrollend', function(e) {
		Ti.API.info(e.currentPage);
		if (e.currentPage == 1) {
			pushNotificationRegister();
		}
		else if (e.currentPage == 3) {
			registerUserNotificationSettings();

			permissions.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
				if (e.success) {
					Ti.API.info('DEBUG LOG: GEO LOCATION / Permissions AUTHORIZATION_ALWAYS / Success');

					ns.session.geo_push_status = 'on';
					Ti.App.Properties.setString('geo_push_status', 'on');
					
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
	});

	var authContChange = false;
	var Window = null;
	var window = null;

	function ShowRegisterSlide() {
		if (authContChange === false) {
			authContChange = true;

			Window = require('ui/RegisterSlide');
			window = new Window();
			window.open();

			window.addEventListener('close_extra', function() {
				authContChange = false;
				Window = null;
				window = null;
			});
		}
	};

	self.removeEventListener('app:auth_singletap', ShowRegisterSlide);
	self.addEventListener('app:auth_singletap', ShowRegisterSlide);

	self.addEventListener('app:receive_notification', function(e) {
		if (window != null) {
			window.fireEvent('app:receive_notification', e);
		}
	});

	self.addEventListener('app:resumed', function() {
		if (window != null) {
			window.fireEvent('app:resumed');
		}
	});

	return self;
}

module.exports = AuthWindow;