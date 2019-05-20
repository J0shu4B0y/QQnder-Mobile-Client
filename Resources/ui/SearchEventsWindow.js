function SearchEventsWindow(find) {

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

	var createEventImage = {
		RemoteImage: function(a){
			a = a || {};

			var md5;
			var needsToSave = false;
			var savedFile;

			if (a.image) {
				md5 = Ti.Utils.md5HexDigest(a.image + a.ts_modification) + '.png';
				savedFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache/' + md5);
				
				if (savedFile.exists()) {
					a.image = savedFile;
				}
				else {
					needsToSave = true;
				}
			}

			if (needsToSave == true) {
				Ti.API.info('DEBUG LOG: Search / Event image needs to save');

				a.image = a.image + '?cache=' + new Date().getTime();
				var image = Ti.UI.createImageView(a);

				image.addEventListener('load', function(e) {
					Ti.API.info('DEBUG LOG: Search / Save event image');
					savedFile.write(
						image.toImage(null, true)
					);
				});
		
				image.addEventListener('error', function(e) {
					// If file not found
					if (e.code == 1) {
						Ti.API.info('DEBUG LOG: Search / Use default event image');
						image.setImage(a.data_event_image_default);
					}
					else {
						setTimeout(function() {
							Ti.API.info('DEBUG LOG: Search / Re-load event image');
							image.setImage(a.image);
						}, 15000);
					}
				});
			}
			else {
				Ti.API.info('DEBUG LOG: Search / Event image not needs to save');
				var image = Ti.UI.createImageView(a);
			}

			return image;
		}
	};	

	/**
	 * Search Events
	 */

	var self = Ti.UI.createWindow({
	    top: 0,
	    left: 0,
	    width: Ti.Platform.displayCaps.platformWidth,
	    height: Ti.UI.FILL,
	    statusBarStyle: Ti.UI.iOS.StatusBar.GRAY,
	    backgroundColor: '#FAFAFA'
	});

		// Loading

		var spinnerCont = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			backgroundColor: 'RGBA(0, 0, 0, 0.5)',
			visible: false,
			zIndex: 1000000
		});

		self.add(spinnerCont);

		// Top Menu

		var topSearchHeaderCont = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: (headerTop + 44),
			zIndex: 40
		});

			topSearchHeaderCont.add(Ti.UI.createView({
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: 1,
				bottom: 0,
				backgroundColor:'#CDCED2'
			}));

			var topSearchHeaderCenter = Ti.UI.createView({
				left: 54,
				right: 54,
				height: 44,
				bottom: 0
			});

				topSearchHeaderCenter.add(Ti.UI.createLabel({
					text: L('ui0123'),
					font: {
						fontSize: 16,
						fontFamily: 'OpenSans-Regular',
						fontWeight: 'normal'
					},
					color: '#000000',
					height: Ti.UI.SIZE,
					textAlign: 'center'
				}));

			var topSearchHeaderRight = Ti.UI.createView({
				left: 0,
				width: 54,
				height: 44,
				bottom: 0,
				zIndex: 10
			});

				topSearchHeaderRight.add(Ti.UI.createView({
					width: 22,
					height: 22,
					backgroundImage: '/img/ios/search/left_slider.png',
					backgroundRepeat: false
				}));

			topSearchHeaderCont.add(topSearchHeaderCenter);
			topSearchHeaderCont.add(topSearchHeaderRight);
		self.add(topSearchHeaderCont);

		// Empty screen

		var searchUpdateRequired = Ti.UI.createView({
			top: headerTop,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			zIndex: 30,
			visible: false,
			backgroundColor: '#FAFAFA'
		});

			var searchUpdateRequiredCont = Ti.UI.createView({
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				layout: 'vertical'
			});

				searchUpdateRequiredCont.add(Ti.UI.createView({
					top: 0,
					width: 100,
					height: 100,
					backgroundImage: '/img/ios/search/notfound_icon.png',
					backgroundRepeat: false
				}));

				searchUpdateRequiredCont.add(Ti.UI.createLabel({
					top: 5,
					text: L('ui0162'),
					font: {
						fontSize: 24,
						fontFamily: 'OpenSans-Bold',
						fontWeight: 'normal'
					},
					color: '#000000',
					textAlign: 'center'
				}));

				searchUpdateRequiredCont.add(Ti.UI.createLabel({
					top: 5,
					left: 70,
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					text: L('ui0163'),
					right: 70,
					color: '#5c5c5c',
					textAlign: 'center'
				}));

			searchUpdateRequired.add(searchUpdateRequiredCont);
		self.add(searchUpdateRequired);

		// Events

		var eventsData = [];
		var tableSearchView = Ti.UI.createTableView({
			top: (headerTop + 44),
			left: 0,
			data: eventsData,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			moving: false,
			zIndex: 10,
			editable: false,
			bubbleParent: false,
			separatorStyle: Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
			horizontalWrap: false,
			separatorColor: '#FAFAFA',
			backgroundColor: '#FAFAFA',
			allowsSelection: false,
		    showVerticalScrollIndicator: true,
		    showHorizontalScrollIndicator: false
		});

		self.add(tableSearchView);

	/**
	 * Actions
	 */

	var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);													
	var incLoadingTime = null;
	var searchContChange = false;
	var WindowError = null;
	var windowError = null;
	var WindowDetails = null;
	var windowDetails = null;

	// Table scroll

	function beginUpdate(fast) {
        if (fast == true) {
        	page_number = 1;
			eventsData = [];
			endUpdate();
		}
		else {
			updating = true;
			searchContChange = true;	
			setTimeout(endUpdate, 2000);
		}
	};

	function endUpdate() {
		if (incLoadingTime != null) {
			clearInterval(incLoadingTime);
	   	}

		// Header loading

		var headerLoading = Ti.UI.createView({
			top: (headerTop + 42),
			left: 0,
			width: 1,
			height: 2,
			zIndex: 10000,
			backgroundColor: '#007AFF'
		});

		self.add(headerLoading);

		var httpRegister;

		httpRegister = Ti.Network.createHTTPClient({
			validatesSecureCertificate: true,
			onreadystatechange: function() {
				if (headerLoading !== undefined) {
					if (this.readyState == 1) {
						headerLoading.animate({
							width: parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100),
							duration: 400
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
					width: Ti.Platform.displayCaps.platformWidth,
					duration: 400
				});

				headerLoading.animate(headerLoadingProgressAnimation);

				headerLoadingProgressAnimation.addEventListener('complete', function() {
					if (headerLoading !== undefined) {
						self.remove(headerLoading);
					}
				});

				if (isJsonString(this.responseText)) {
					var jsonResult = JSON.parse(this.responseText);

					if (jsonResult.success.code == '800') {
						if (jsonResult.success.result.events.data.length > 0) {
							searchUpdateRequired.setVisible(false);

							for (var search_event_i = 0; search_event_i < jsonResult.success.result.events.data.length; search_event_i++) {
								var row = Ti.UI.createTableViewRow({
									width: Ti.Platform.displayCaps.platformWidth,
									height: Ti.UI.SIZE,
						    		layout: 'vertical',
						    		hasChild: false,
						    		dataType: 'event',
						    		className: 'search-row-general',
						    		borderColor: '#FAFAFA',
						    		dataEventId: jsonResult.success.result.events.data[search_event_i].group_idd,
						    		touchEnabled: true,
						    		selectedColor: '#FAFAFA',
						    		horizontalWrap: false,
						    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE,
						    		backgroundColor: '#FAFAFA',
						    		allowsSelection: false,
						    		selectedBackgroundColor: '#FAFAFA'
						  		});

									// Event cont

									var event_padding_top = 30;

									if (search_event_i > 0 || eventsData.length > 0) {
										event_padding_top = 15;
									}

									if (eventsData.length > 0) {
										row.add(Ti.UI.createView({
											top: 0,
											left: 25,
											right: 25,
											height: 1,											
											zIndex: 10,
											backgroundColor: '#EFEFF3',
										}));
									}
									else {
										row.add(Ti.UI.createView({
											top: 0,
											left: 25,
											right: 25,
											height: 1,											
											zIndex: 10
										}));
									}

									var someSearchEventCont = Ti.UI.createView({
										top: (event_padding_top + 0),
										left: 25,
										right: 25,
										height: Ti.UI.SIZE
									});

										// Event image
	
										someSearchEventCont.add(createEventImage.RemoteImage({
											top: 0,
											left: 0,
											width: 50,
											image: Ti.Utils.base64decode(jsonResult.success.result.events.data[search_event_i].image).toString(),
											height: 50,
											borderRadius: 5,
											defaultImage: '/img/ios/search/event_img_preload.png',
											ts_modification: jsonResult.success.result.events.data[search_event_i].ts_modification,
											data_event_image_default: '/img/ios/search/event_img_preload.png'
										}));

										// Event name
	
										var someSearchEventInfoCont = Ti.UI.createView({
											top: 0,
											left: 70,
											right: 100,
											height: Ti.UI.SIZE,
											layout: 'vertical'
										});

											someSearchEventInfoCont.add(Ti.UI.createLabel({
												top: 0,
												left: 0,
												font: {
													fontFamily: 'OpenSans-Semibold',
													fontSize: 16,
													fontWeight: 'normal'
												},
												text: jsonResult.success.result.events.data[search_event_i].header.title_two,
												color: '#111111',
												height: Ti.UI.SIZE,
												textAlign: 'left'
											}));
		
											someSearchEventInfoCont.add(Ti.UI.createLabel({
												top: 2,
												left: 0,
												font: {
													fontFamily: 'OpenSans-Regular',
													fontSize: 12,
													fontWeight: 'normal'
												},
												text: capitalizeFirstLetter(jsonResult.success.result.events.data[search_event_i].place_info.name),
												color: '#8C8C8C',
												height: Ti.UI.SIZE,
												textAlign: 'left'
											}));
											
											someSearchEventInfoCont.add(Ti.UI.createView({
												top: 0,
												left: 0,
												height: 15,
												width: Ti.UI.FILL
											}));

										someSearchEventCont.add(someSearchEventInfoCont);
										
										// Event details
	
							  			var someSearchEventDetailsCont = Ti.UI.createView({
											top: 0,
											right: 0,
											width: 90,
											height: Ti.UI.SIZE,
											layout: 'vertical'
										});
	
											var event_details_1st_line = '';
											var event_details_2nd_line = '';
										
											if (trim(jsonResult.success.result.events.data[search_event_i].header.title_one) != '') {
												if (trim(jsonResult.success.result.events.data[search_event_i].header.title_three) != '') {									
													event_details_1st_line = charToCurrencySymbol(jsonResult.success.result.events.data[search_event_i].header.title_one).toUpperCase();
													event_details_2nd_line = charToCurrencySymbol(jsonResult.success.result.events.data[search_event_i].header.title_three).toUpperCase();
												}
												else {
													event_details_1st_line = jsonResult.success.result.events.data[search_event_i].header.title_one;
													event_details_2nd_line = capitalizeFirstLetter(L('ui0149'));
												}
											}
											else if (trim(jsonResult.success.result.events.data[search_event_i].header.title_three) != '' && trim(jsonResult.success.result.events.data[search_event_i].header.title_two) != '') {
												event_details_1st_line = charToCurrencySymbol(jsonResult.success.result.events.data[search_event_i].header.title_three).toUpperCase();
												event_details_2nd_line = capitalizeFirstLetter(L('ui0178'));
											}
											else {
												event_details_1st_line = capitalizeFirstLetter(L('ui0093'));
												event_details_2nd_line = '';
											}
	
											someSearchEventDetailsCont.add(Ti.UI.createLabel({
												font: {
													fontFamily: 'OpenSans-Semibold',
													fontSize: 14,
													fontWeight: 'normal'
												},
												color: '#000000',
												text: event_details_1st_line,
												right: 0,
												top: 0,
												height: Ti.UI.SIZE,
												textAlign: 'right'
											}));
											
											someSearchEventDetailsCont.add(Ti.UI.createLabel({
												font: {
													fontFamily: 'OpenSans-Regular',
													fontSize: 12,
													fontWeight: 'normal'
												},
												color: '#8C8C8C',
												text: event_details_2nd_line,
												right: 0,
												top: 2,
												height: Ti.UI.SIZE,
												textAlign: 'right'
											}));
	
										someSearchEventCont.add(someSearchEventDetailsCont);
									row.add(someSearchEventCont);
								eventsData.push(row);
							}

							tableSearchView.setData(eventsData);
							page_number += 1;
							updating = false;
						}
						else {
							updating = false;
							searchContChange = false;

							if (eventsData.length == 0) {
								searchUpdateRequired.setVisible(true);
							}
						}
					}
					else {
						if (ns.tools.underscore.has(jsonResult, 'error') && jsonResult.error.code == '710') {
							Ti.App.fireEvent('app:auth_window');
						}
						else {
							searchUpdateRequired.setVisible(true);

							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0014'));
							windowError.open();

							windowError.addEventListener('close_extra', function() {
								updating = false;
								WindowError = null;
								windowError = null;
								searchContChange = false;
							});
						}
					}
				}
				else {
					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0014'));
					windowError.open();				

					windowError.addEventListener('close_extra', function() {
						updating = false;
						WindowError = null;
						windowError = null;
						searchContChange = false;
					});
				}
			},
			onerror: function() {
				clearInterval(incLoadingTime);

				if (headerLoading !== undefined) {
					self.remove(headerLoading);
				}
				
				searchUpdateRequired.setVisible(false);

				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0011'));
				windowError.open();

				windowError.addEventListener('close_extra', function() {
					updating = false;
					WindowError = null;
					windowError = null;
					searchContChange = false;
				});
			},
			timeout: 15000
		});

		url = 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=general_search&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&search=' + find + '&location_id=' + ns.session.location_id + '&places_limit=0&events_from=' + (ns.limits.search_events * (page_number - 1))  + '&events_limit=' + ns.limits.search_events + '&screen_type=' + Ti.Platform.displayCaps.dpi;

		httpRegister.open('GET', url);

		httpRegister.send();
	};

	// Go back to the previous screen

	topSearchHeaderRight.addEventListener('singletap', function() {
		if (searchContChange === false) {
			searchContChange = true;

	    	self.fireEvent('close_extra');
	    	self.close();
		}
	});

	// Table search click

	tableSearchView.addEventListener('singletap', function(e) {
		if (e.rowData && e.rowData.dataType && e.rowData.dataType === 'event') {
			searchContChange = true;

			// Spinner animation

			spinnerCont.setVisible(true);

			WindowDetails = require('ui/EventDetailsWindow');
			windowDetails = new WindowDetails(e.rowData.dataEventId);
			windowDetails.open();

			windowDetails.addEventListener('close_extra', function() {
				WindowDetails = null;
				windowDetails = null;
				searchContChange = false;
				spinnerCont.setVisible(false);
			});
		}
	});

	// Scroll events

	var lastDistance = 0;
	var offset;
	var height;
	var total;
	var theEnd;
	var distance;
	var nearEnd;

	tableSearchView.addEventListener('scroll', function(e) {
		offset = e.contentOffset.y;
		height = e.size.height;
		total = offset + height;
		theEnd = e.contentSize.height;
		distance = theEnd - total;

		if (distance < lastDistance) {
			nearEnd = theEnd * .75;

			if (!updating && (total >= nearEnd)) {
				beginUpdate(false);
			}
		}

		lastDistance = distance;
	});
	
	// Open search events

	self.addEventListener('open', function() {
		beginUpdate(true);
	});	

	// Close search

	self.addEventListener('close', function() {
		if (windowError != null) {
			windowError.close();
		}
	});

	return self;
}

module.exports = SearchEventsWindow;