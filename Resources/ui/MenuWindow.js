function MenuWindow() {

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
	 * Menu slide
	 */

	var self = Ti.UI.createWindow({
		top: 0,
		left: 0,
	    width: Ti.Platform.displayCaps.platformWidth,
	    height: Ti.UI.FILL,
	    statusBarStyle: Ti.UI.iOS.StatusBar.GRAY,
	    backgroundColor: '#FAFAFA'
	});

		// Spinner

		var spinnerCont = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			backgroundColor: 'RGBA(0, 0, 0, 0.5)',
			visible: false,
			zIndex: 300
		});

		self.add(spinnerCont);

		// Select city
	
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
					text: L('ui0136')
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
		        top: 0,
		        data_value: 0,
		        selectionIndicator: true
		    });

		    var data = [];
			data[0]=Ti.UI.createPickerRow({title:L('city1')});
			data[1]=Ti.UI.createPickerRow({title:L('city4')});
			picker.add(data);
	
		    pickerCont.add(picker);
	    self.add(pickerCont);

		// Top Menu

		var topMenuHeaderCont = Ti.UI.createView({
			height: (headerTop + 44),
			width: Ti.Platform.displayCaps.platformWidth,
			top: 0,
			left: 0,
			zIndex: 10
		});

			var topMenuHeaderBottomHr = Ti.UI.createView({
				height: 1,
				width: Ti.Platform.displayCaps.platformWidth,
				bottom: 0,
				left: 0,
				backgroundColor: '#CDCED2'
			});

			topMenuHeaderCont.add(topMenuHeaderBottomHr);
	
			var topMenuHeaderLeft = Ti.UI.createView({
				left: 0,
				width: 54,
				height: 44,
				bottom: 0
			});

				var topMenuHeaderLeftIcon = Ti.UI.createView({
					backgroundImage: '/img/ios/menu/profile.png',
					backgroundRepeat: false,
					height: 22,
					width: 22
				});
	
			var topMenuHeaderCenter = Ti.UI.createView({
				right: 54,
				left: 54,
				height: 44,
				bottom: 0
			});
	
				topMenuHeaderCenter.add(Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					height: Ti.UI.SIZE,
					color: '#000000',
					text: 'QQnder'
				}));
	
			var topMenuHeaderRight = Ti.UI.createView({
				right: 0,
				height: 44,
				width: 54,
				bottom: 0
			});
	
				var topMenuHeaderRightIcon = Ti.UI.createView({
					backgroundImage: '/img/ios/menu/list.png',
					backgroundRepeat: false,
					height: 22,
					width: 22
				});
	
				var topMenuHeaderRightIconIndicator = Ti.UI.createView({
					top: 10,
					width: 8,
					right: 15,
					height: 8,
					visible: false,
					borderRadius: 4,
					borderColor: '#FAFAFA',
					borderWidth: 1,
					backgroundColor: '#FF3B30'
				});
	
				if (ns.session.list_indicator == 1) {
					topMenuHeaderRightIconIndicator.setVisible(true);
				}
	
			topMenuHeaderLeft.add(topMenuHeaderLeftIcon);
			topMenuHeaderRight.add(topMenuHeaderRightIcon);
			topMenuHeaderRight.add(topMenuHeaderRightIconIndicator);
			topMenuHeaderCont.add(topMenuHeaderLeft);
			topMenuHeaderCont.add(topMenuHeaderRight);
			topMenuHeaderCont.add(topMenuHeaderCenter);
		self.add(topMenuHeaderCont);

		var generalInfoScrollView = Ti.UI.createScrollView({
			top: (headerTop + 44),
	  	    left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
		    layout: 'vertical',
		    contentWidth: Ti.UI.FILL,
		    contentHeight: Ti.UI.SIZE,
		    disableBounce: true,
		    showVerticalScrollIndicator: false,
		    showHorizontalScrollIndicator: false
		});
	
			// Header city
	
			var menuTypePositioning = Ti.UI.createView({
				layout: 'horizontal',
				right: 25,
				left: 25,
				top: 25,
				height: Ti.UI.SIZE
			});
	
				var menuTypePositioning1st = Ti.UI.createLabel({
					top: 0,
					left: 0,
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					text: L('ui0190').toUpperCase(),
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 14,
						fontWeight: 'normal'
					},
					color: '#000000'
				});
	
				var menuTypePositioning2nd = Ti.UI.createLabel({
					top: 0,
					left: 7,
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					text: L('ui0189').toUpperCase(),
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 14,
						fontWeight: 'normal'
					},
					color: '#5C5C5C'
				});
	
				menuTypePositioning.add(menuTypePositioning1st);
				menuTypePositioning.add(menuTypePositioning2nd);
			generalInfoScrollView.add(menuTypePositioning);
	
			var menuGeneralDesc = Ti.UI.createLabel({
				left: 25,
				right: 25,
				text: L('city1'),
				top: 8,
				textAlign: 'left',
				height: Ti.UI.SIZE,
				color: '#000000',
				font: {
					fontFamily: 'OpenSans-Bold',
					fontSize: 24,
					fontWeight: 'normal'
				}
			});
	
			generalInfoScrollView.add(menuGeneralDesc);
	
			var headerCityImg = Ti.UI.createImageView({
				top: 25,
				left: 0,
				image: '/img/ios/menu/header_city_1.png',
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE
			});
	
			generalInfoScrollView.add(headerCityImg);
	
			var searchCont = Ti.UI.createView({
				left: 25,
				right: 25,
				top: 25,
				height: 50,
				backgroundColor:'#FFFFFF',
			    borderColor: '#CDCED2',
			    borderRadius: 5,
			    zIndex: 20
			});
	
				searchCont.add(Ti.UI.createView({
			    	top: 15,
			    	left: 15,
			    	width: 20,
			    	height: 20,
			    	backgroundImage: '/img/ios/menu/search.png',
			    	backgroundRepeat: false
			    }));
	
				searchCont.add(Ti.UI.createLabel({
					color: '#8C8C8C',
					left: 45,
					top: 16,
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					textAlign: 'left',
					text: L('ui0191')
				}));
	
			generalInfoScrollView.add(searchCont);
	
			// Middle cont
		
			var middleCont = Ti.UI.createView({
				left: 25,
				right: 25,
				top: 25,
				height: Ti.UI.SIZE,
				layout: 'vertical'
			});
		
				middleCont.add(Ti.UI.createLabel({
					color: '#8C8C8C',
					left: 0,
					top: 0,
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					textAlign: 'center',
					text: L('ui0192')
				}));
	
				middleCont.add(Ti.UI.createLabel({
					color: '#5C5C5C',
					left: 0,
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					top: 5,
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 15,
						fontWeight: 'normal'
					},
					textAlign: 'center',
					text: L('ui0193')
				}));
			
				middleCont.add(Ti.UI.createLabel({
					color: '#8C8C8C',
					left: 0,
					top: 7,
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					textAlign: 'center',
					text: L('ui0194')
				}));
	
			generalInfoScrollView.add(middleCont);
	
			// Category filter
	
			var categoryFiltersRow1Cont = Ti.UI.createView({
				height: Ti.UI.SIZE,
				left: 25,
				right: 25,
				top: 20,
				layout: 'horizontal'
			});
	
				var categoryFilterType1Cont = Ti.UI.createView({
					left: 0,
					top: 0,
					height: 120,
					width: '33%'
				});
	
					categoryFilterType1Cont.add(Ti.UI.createView({
				    	top: 20,
				    	width: 48,
				    	height: 48,
				    	backgroundImage: '/img/ios/menu/random.png',
				    	backgroundRepeat: false
				    }));
			
					categoryFilterType1Cont.add(Ti.UI.createLabel({
						color: '#5C5C5C',
						top: 75,
						height: Ti.UI.SIZE,
						font: {
							fontFamily: 'OpenSans-Semibold',
							fontSize: 12,
							fontWeight: 'normal'
						},
						textAlign: 'center',
						text: L('ui0165')
					}));
				
				var categoryFilterType2Cont = Ti.UI.createView({
					left: 0,
					top: 0,
					height: 120,
					width: '34%',
					backgroundColor:'#FAFAFA'
				});
		
					categoryFilterType2Cont.add(Ti.UI.createView({
				    	top: 20,
				    	width: 48,
				    	height: 48,
				    	backgroundImage: '/img/ios/menu/food.png',
				    	backgroundRepeat: false
				    }));
		
					categoryFilterType2Cont.add(Ti.UI.createLabel({
						color: '#5C5C5C',
						top: 75,
						height: Ti.UI.SIZE,
						font: {
							fontFamily: 'OpenSans-Semibold',
							fontSize: 12,
							fontWeight: 'normal'
						},
						textAlign: 'center',
						text: L('ui0069')
					}));
		
					categoryFilterType2Cont.add(Ti.UI.createView({
				    	top: 15,
				    	left: 0,
				    	width: 1,
				    	height: 90,
				    	backgroundColor: '#EFEFF3'
				    }));
		
				var categoryFilterType3Cont = Ti.UI.createView({
					left: 0,
					top: 0,
					height: 120,
					width: '33%',
					backgroundColor:'#FAFAFA'
				});
		
					categoryFilterType3Cont.add(Ti.UI.createView({
				    	top: 20,
				    	width: 48,
				    	height: 48,
				    	backgroundImage: '/img/ios/menu/clothing.png',
				    	backgroundRepeat: false
				    }));
		
					categoryFilterType3Cont.add(Ti.UI.createLabel({
						color: '#5C5C5C',
						top: 75,
						height: Ti.UI.SIZE,
						font: {
							fontFamily: 'OpenSans-Semibold',
							fontSize: 12,
							fontWeight: 'normal'
						},
						textAlign: 'center',
						text: L('ui0070')
					}));
		
					categoryFilterType3Cont.add(Ti.UI.createView({
				    	top: 15,
				    	left: 0,
				    	width: 1,
				    	height: 90,
				    	backgroundColor: '#EFEFF3'
				    }));
		
				categoryFiltersRow1Cont.add(categoryFilterType1Cont);
				categoryFiltersRow1Cont.add(categoryFilterType2Cont);
				categoryFiltersRow1Cont.add(categoryFilterType3Cont);
			generalInfoScrollView.add(categoryFiltersRow1Cont);
	
			var categoryFiltersRow2Cont = Ti.UI.createView({
				height: Ti.UI.SIZE,
				left: 25,
				right: 25,
				top: 0,
				layout: 'horizontal'
			});
		
				var categoryFilterType4Cont = Ti.UI.createView({
					left: 0,
					top: 0,
					height: 120,
					width: '33%'
				});
		
					categoryFilterType4Cont.add(Ti.UI.createView({
				    	top: 0,
				    	left: '5%',
				    	width: '90%',
				    	height: 1,
				    	backgroundColor: '#EFEFF3'
				    }));	
		
					categoryFilterType4Cont.add(Ti.UI.createView({
				    	top: 20,
				    	width: 48,
				    	height: 48,
				    	backgroundImage: '/img/ios/menu/smile.png',
				    	backgroundRepeat: false
				    }));
		
					categoryFilterType4Cont.add(Ti.UI.createLabel({
						color: '#5C5C5C',
						top: 71,
						height: Ti.UI.SIZE,
						font: {
							fontFamily: 'OpenSans-Semibold',
							fontSize: 12,
							fontWeight: 'normal'
						},
						textAlign: 'center',
						text: L('ui0071')
					}));
		
				var categoryFilterType5Cont = Ti.UI.createView({
					left: 0,
					top: 0,
					height: 120,
					width: '34%',
					backgroundColor:'#FAFAFA'
				});
				
					categoryFilterType5Cont.add(Ti.UI.createView({
				    	top: 0,
				    	left: '5%',
				    	width: '90%',
				    	height: 1,
				    	backgroundColor: '#EFEFF3'
				    }));
		
					categoryFilterType5Cont.add(Ti.UI.createView({
				    	top: 20,
				    	width: 48,
				    	height: 48,
				    	backgroundImage: '/img/ios/menu/relax.png',
				    	backgroundRepeat: false
				    }));
			
					categoryFilterType5Cont.add(Ti.UI.createLabel({
						color: '#5C5C5C',
						top: 71,
						height: Ti.UI.SIZE,
						font: {
							fontFamily: 'OpenSans-Semibold',
							fontSize: 12,
							fontWeight: 'normal'
						},
						textAlign: 'center',
						text: L('ui0072')
					}));
					
					categoryFilterType5Cont.add(Ti.UI.createView({
				    	top: 15,
				    	left: 0,
				    	width: 1,
				    	height: 90,
				    	backgroundColor: '#EFEFF3'
				    }));
		
				var categoryFilterType6Cont = Ti.UI.createView({
					left: 0,
					top: 0,
					height: 120,
					width: '33%',
					backgroundColor:'#FAFAFA'
				});
		
					categoryFilterType6Cont.add(Ti.UI.createView({
				    	top: 0,
				    	left: '5%',
				    	width: '90%',
				    	height: 1,
				    	backgroundColor: '#EFEFF3'
				    }));
				    
					categoryFilterType6Cont.add(Ti.UI.createView({
				    	top: 20,
				    	width: 48,
				    	height: 48,
				    	backgroundImage: '/img/ios/menu/home.png',
				    	backgroundRepeat: false
				    }));

					categoryFilterType6Cont.add(Ti.UI.createLabel({
						color: '#5C5C5C',
						top: 71,
						height: Ti.UI.SIZE,
						font: {
							fontFamily: 'OpenSans-Semibold',
							fontSize: 12,
							fontWeight: 'normal'
						},
						textAlign: 'center',
						text: L('ui0135')
					}));
		
					categoryFilterType6Cont.add(Ti.UI.createView({
				    	top: 15,
				    	left: 0,
				    	width: 1,
				    	height: 90,
				    	backgroundColor: '#EFEFF3'
				    }));

				categoryFiltersRow2Cont.add(categoryFilterType4Cont);
				categoryFiltersRow2Cont.add(categoryFilterType5Cont);
				categoryFiltersRow2Cont.add(categoryFilterType6Cont);
			generalInfoScrollView.add(categoryFiltersRow2Cont);
		self.add(generalInfoScrollView);

	// Actions

   	var menuContChange = false;

	// Menu event

	var WindowEvent = null;
	var windowEvent = null;

	categoryFilterType1Cont.addEventListener('singletap', function() {
		if (menuContChange === false) {
			menuContChange = true;
			ns.session.category = 0;

			// Spinner animation

			spinnerCont.setVisible(true);

			WindowEvent = require('ui/EventsWindow');
			windowEvent = new WindowEvent(0, 'normal');
			windowEvent.open();

			windowEvent.addEventListener('close_extra', function() {
				WindowEvent = null;
				windowEvent = null;
				menuContChange = false;
				spinnerCont.setVisible(false);

				if (ns.session.list_indicator == 0) {
					topMenuHeaderRightIconIndicator.setVisible(false);
				}
				else {
					topMenuHeaderRightIconIndicator.setVisible(true);
				}
			});
		}
	});

	categoryFilterType2Cont.addEventListener('singletap', function() {
		if (menuContChange === false) {
			menuContChange = true;
			ns.session.category = 1;

			// Spinner animation

			spinnerCont.setVisible(true);

			WindowEvent = require('ui/EventsWindow');
			windowEvent = new WindowEvent(0, 'normal');
			windowEvent.open();

			windowEvent.addEventListener('close_extra', function() {
				WindowEvent = null;
				windowEvent = null;
				menuContChange = false;
				spinnerCont.setVisible(false);

				if (ns.session.list_indicator == 0) {
					topMenuHeaderRightIconIndicator.setVisible(false);
				}
				else {
					topMenuHeaderRightIconIndicator.setVisible(true);
				}
			});
		}
	});

	categoryFilterType3Cont.addEventListener('singletap', function() {
		if (menuContChange === false) {
			menuContChange = true;
			ns.session.category = 2;

			// Spinner animation
	
			spinnerCont.setVisible(true);

			WindowEvent = require('ui/EventsWindow');
			windowEvent = new WindowEvent(0, 'normal');
			windowEvent.open();

			windowEvent.addEventListener('close_extra', function() {
				WindowEvent = null;
				windowEvent = null;
				menuContChange = false;
				spinnerCont.setVisible(false);
				
				if (ns.session.list_indicator == 0) {
					topMenuHeaderRightIconIndicator.setVisible(false);
				}
				else {
					topMenuHeaderRightIconIndicator.setVisible(true);
				}
			});
		}
	});

	categoryFilterType4Cont.addEventListener('singletap', function() {
		if (menuContChange === false) {
			menuContChange = true;
			ns.session.category = 3;

			// Spinner animation
	
			spinnerCont.setVisible(true);

			WindowEvent = require('ui/EventsWindow');
			windowEvent = new WindowEvent(0, 'normal');
			windowEvent.open();

			windowEvent.addEventListener('close_extra', function() {
				WindowEvent = null;
				windowEvent = null;
				menuContChange = false;
				spinnerCont.setVisible(false);
				
				if (ns.session.list_indicator == 0) {
					topMenuHeaderRightIconIndicator.setVisible(false);
				}
				else {
					topMenuHeaderRightIconIndicator.setVisible(true);
				}
			});
		}
	});

	categoryFilterType5Cont.addEventListener('singletap', function() {
		if (menuContChange === false) {
			menuContChange = true;
			ns.session.category = 4;

			// Spinner animation

			spinnerCont.setVisible(true);

			WindowEvent = require('ui/EventsWindow');
			windowEvent = new WindowEvent(0, 'normal');
			windowEvent.open();

			windowEvent.addEventListener('close_extra', function() {
				WindowEvent = null;
				windowEvent = null;
				menuContChange = false;
				spinnerCont.setVisible(false);

				if (ns.session.list_indicator == 0) {
					topMenuHeaderRightIconIndicator.setVisible(false);
				}
				else {
					topMenuHeaderRightIconIndicator.setVisible(true);
				}
			});
		}
	});
	
	categoryFilterType6Cont.addEventListener('singletap', function() {
		if (menuContChange === false) {
			menuContChange = true;
			ns.session.category = 5;

			// Spinner animation

			spinnerCont.setVisible(true);

			WindowEvent = require('ui/EventsWindow');
			windowEvent = new WindowEvent(0, 'normal');
			windowEvent.open();

			windowEvent.addEventListener('close_extra', function() {
				WindowEvent = null;
				windowEvent = null;
				menuContChange = false;
				spinnerCont.setVisible(false);

				if (ns.session.list_indicator == 0) {
					topMenuHeaderRightIconIndicator.setVisible(false);
				}
				else {
					topMenuHeaderRightIconIndicator.setVisible(true);
				}
			});
		}
	});

	// Nav window

    var windowMenuNavigation = Titanium.UI.iOS.createNavigationWindow();

	// Profile

	var WindowProfile = null;
	var windowProfile = null;

	topMenuHeaderLeft.addEventListener('singletap', function() {
		if (menuContChange === false) {
			menuContChange = true;

			// Spinner animation

			spinnerCont.setVisible(true);

			WindowProfile = require('ui/ProfileWindow');
			windowProfile = new WindowProfile();
			windowProfile.open();

			windowProfile.addEventListener('close_extra', function() {
				WindowProfile = null;
				windowProfile = null;
				menuContChange = false;
				spinnerCont.setVisible(false);
			});
		}
	});

	// Search

	var WindowSearch = null;
	var windowSearch = null;

	searchCont.addEventListener('singletap', function() {
		if (menuContChange === false) {
			menuContChange = true;

			var find = '';

			// Spinner animation

			spinnerCont.setVisible(true);

			WindowSearch = require('ui/SearchWindow');
			windowSearch = new WindowSearch(find);
			windowSearch.open();

			windowSearch.addEventListener('close_extra', function() {
				WindowSearch = null;
				windowSearch = null;
				menuContChange = false;
				spinnerCont.setVisible(false);
			});
		}
	});

	// List

	var WindowList = null;
	var windowList = null;

	topMenuHeaderRight.addEventListener('singletap', function(e) {		
		if (menuContChange === false) {
			menuContChange = true;

			var sort = '';

			// Spinner animation

			spinnerCont.setVisible(true);

			WindowList = require('ui/ListWindow');
			windowList = new WindowList('test');
			windowList.open();

			windowList.addEventListener('close_extra', function() {
				WindowList = null;
				windowList = null;
				menuContChange = false;
				spinnerCont.setVisible(false);

				if (ns.session.list_indicator == 0) {
					topMenuHeaderRightIconIndicator.setVisible(false);
				}
				else {
					topMenuHeaderRightIconIndicator.setVisible(true);
				}
			});
		}
	});

	// Open window

	self.addEventListener('open', function(e) {
		Ti.API.info('DEBUG LOG: MENU / Open');

		spinnerCont.setVisible(false);
	});

	// Any screen tap

	self.addEventListener('singletap', function(e) {
		if (e.source.preventDefault != true) {
			Ti.API.info('DEBUG LOG: MENU / Prevent default singletap');
		}
	});

	// App receive local notification

	self.addEventListener('app:local_notification', function(e) {

		Ti.API.info('DEBUG LOG: MENU / Receive local notification');

		if (e.userInfo
			&& e.userInfo.type && e.userInfo.type != '') {

			if (windowProfile != null) {
				windowProfile.close();
			}
	
			if (windowList != null) {
				windowList.close();
			}
			
			if (windowEvent != null) {
				windowEvent.close();
			}

			eventsContChange = false;
			spinnerCont.setVisible(false);

			if (e.userInfo.type == 'local_geo_push'
				&& e.userInfo.group_idd && e.userInfo.group_idd > 0) {

				Ti.API.info('DEBUG LOG: LOCAL NOTIFICATION / Geo push');

				menuContChange = true;
				spinnerCont.setVisible(true);

				WindowEvent = require('ui/EventsWindow');
				windowEvent = new WindowEvent(e.userInfo.group_idd, 'local_geo_push');
				windowEvent.open();
	
				windowEvent.addEventListener('close_extra', function() {
					WindowEvent = null;
					windowEvent = null;
					menuContChange = false;
					spinnerCont.setVisible(false);
	
					if (ns.session.list_indicator == 0) {
						topMenuHeaderRightIconIndicator.setVisible(false);
					}
					else {
						topMenuHeaderRightIconIndicator.setVisible(true);
					}
				});	
			}
		}
	});

	// App:Resumed

	self.addEventListener('app:resumed', function() {
		if (windowProfile != null) {
			windowProfile.fireEvent('app:resumed');
		}

		if (windowList != null) {
			windowList.fireEvent('app:resumed');
		}

		if (windowEvent != null) {
			windowEvent.fireEvent('app:resumed');
		}
	});

	// Close window

	self.addEventListener('close', function() {
		if (windowProfile != null) {
			windowProfile.close();
		}

		if (windowList != null) {
			windowList.close();
		}
		
		if (windowEvent != null) {
			windowEvent.close();
		}
	});
	
	// Select city
	
	menuGeneralDesc.addEventListener('singletap', function() {
		pickerCont.setVisible(true);
	});
	
    picker.addEventListener('change', function(e) {
	    picker.date_value = e.value;
	});

	return self;
}

module.exports = MenuWindow;