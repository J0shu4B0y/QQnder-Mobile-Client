function SearchWindow(find) {

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
	 * Search Places
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
			zIndex: 1000000,
			visible: false,
			backgroundColor: 'RGBA(0, 0, 0, 0.5)'
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
					text: L('ui0180'),
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
						fontSize: 15,
						fontFamily: 'OpenSans-Regular',
						fontWeight: 'normal'
					},
					text: L('ui0163'),
					right: 70,
					color: '#5c5c5c',
					textAlign: 'center'
				}));

			searchUpdateRequired.add(searchUpdateRequiredCont);
		self.add(searchUpdateRequired);

		// Places

		var placesData = [];
		var tableSearchView = Ti.UI.createTableView({
			top: (headerTop + 44),
			left: 0,
			data: placesData,
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

	var WindowError = null;
	var windowError = null;
	var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);													
	var incLoadingTime = null;
	var searchContChange = false;

	// Scroll

	function beginUpdate(fast) {
        if (fast == true) {
        	page_number = 1;
			placesData = [];
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

					if (jsonResult.success.code == '800') {
						if (jsonResult.success.result.places.data.length > 0) {
							searchUpdateRequired.setVisible(false);

							for (var search_place_i = 0; search_place_i < jsonResult.success.result.places.data.length; search_place_i++) {
								var row = Ti.UI.createTableViewRow({
									allowsSelection: false,
									horizontalWrap: false,
						    		touchEnabled: true,
						    		hasChild: false,
						    		className: 'search-row-general',
						    		height: Ti.UI.SIZE,
						    		width: Ti.Platform.displayCaps.platformWidth,
						    		selectedBackgroundColor: '#FAFAFA',
						    		selectedColor: '#FAFAFA',
						    		backgroundColor: '#FAFAFA',
						    		borderColor: '#FAFAFA',
						    		dataPlaceId: jsonResult.success.result.places.data[search_place_i].id,
						    		dataType: 'place',
						    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE
						  		});

									// Place cont

									var place_padding_top = 30;

									if (search_place_i > 0 || placesData.length > 0) {
										place_padding_top = 15;
									}

									if (placesData.length > 0) {
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
	
									var someSearchPlaceCont = Ti.UI.createView({
										top: (place_padding_top + 0),
										left: 25,
										right: 125,
										height: Ti.UI.SIZE,
										layout: 'vertical'
									});

										someSearchPlaceCont.add(Ti.UI.createLabel({
											font: {
												fontFamily: 'OpenSans-Semibold',
												fontSize: 16,
												fontWeight: 'normal'
											},
											color: '#111111',
											text: jsonResult.success.result.places.data[search_place_i].name,
											left: 0,
											top: 0,
											height: Ti.UI.SIZE,
											textAlign: 'left'
										}));

										someSearchPlaceCont.add(Ti.UI.createLabel({
											font: {
												fontFamily: 'OpenSans-Regular',
												fontSize: 12,
												fontWeight: 'normal'
											},
											color: '#8C8C8C',
											text: capitalizeFirstLetter(jsonResult.success.result.places.data[search_place_i].description),
											left: 0,
											top: 2,
											height: Ti.UI.SIZE,
											textAlign: 'left'
										}));

										someSearchPlaceCont.add(Ti.UI.createLabel({
											font: {
												fontFamily: 'OpenSans-Regular',
												fontSize: 13,
												fontWeight: 'normal'
											},
											color: '#5c5c5c',
											text: jsonResult.success.result.places.data[search_place_i].address,
											left: 0,
											top: 5,
											height: Ti.UI.SIZE,
											textAlign: 'left'
										}));

										someSearchPlaceCont.add(Ti.UI.createLabel({
											top: 4,
											left: 0,
											text: L('ui0127').replace('{{string}}', declOfNum(jsonResult.success.result.places.data[search_place_i].subscribers, [L('ui0124'), L('ui0125'), L('ui0126')])).replace('{{number}}', jsonResult.success.result.places.data[search_place_i].subscribers),
											font: {
												fontSize: 12,
												fontFamily: 'OpenSans-Regular',
												fontWeight: 'normal'
											},
											color: '#8C8C8C',
											height: Ti.UI.SIZE,
											textAlign: 'left'
										}));

										someSearchPlaceCont.add(Ti.UI.createView({
											top: 0,
											left: 0,
											height: 15,
											width: Ti.UI.FILL
										}));
	
									var someSearchPlaceButtonCont = Ti.UI.createView({
										top: (place_padding_top + 0),
										right: 25,
										height: 30,
										width: 90,
										dataType: 'place-button',
										borderColor: '#007AFF',
										borderRadius: 5,
										borderWidth: 1,
										dataStatus: 0
									});
										
										var someSearchPlaceButtonAdd = Ti.UI.createLabel({
											font: {
												fontFamily: 'OpenSans-Regular',
												fontSize: 12,
												fontWeight: 'normal'
											},
											color: '#007AFF',
											textAlign: 'center',
											text: L('ui0129'),
											maxLines: 1,
											touchEnabled: false,
											visible: false
										});
										
										var someSearchPlaceButtonRemove = Ti.UI.createLabel({
											font: {
												fontFamily: 'OpenSans-Regular',
												fontSize: 12,
												fontWeight: 'normal'
											},
											color: '#FF3B30',
											textAlign: 'center',
											text: L('ui0130'),
											maxLines: 1,
											touchEnabled: false,
											visible: false
										});
		
										if (jsonResult.success.result.places.data[search_place_i].subscribe_status == 0) {
											someSearchPlaceButtonAdd.setVisible(true);
											someSearchPlaceButtonCont.setBorderColor('#007AFF');
											someSearchPlaceButtonCont.dataStatus = 0;
										}
										else {
											someSearchPlaceButtonRemove.setVisible(true);
											someSearchPlaceButtonCont.setBorderColor('#FF3B30');
											someSearchPlaceButtonCont.dataStatus = 1;
										}
		
										someSearchPlaceButtonCont.add(someSearchPlaceButtonAdd);
										someSearchPlaceButtonCont.add(someSearchPlaceButtonRemove);

									row.add(someSearchPlaceCont);
									row.add(someSearchPlaceButtonCont);
								placesData.push(row);
							}

							tableSearchView.setData(placesData);
							page_number += 1;
							updating = false;
							searchContChange = false;
						}
						else {
							updating = false;
							searchContChange = false;

							if (placesData.length == 0) {
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

		httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=general_search&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&search=' + find + '&location_id=' + ns.session.location_id + '&events_limit=0&places_from=' + (ns.limits.search_places * (page_number - 1))  + '&places_limit=' + ns.limits.search_places + '&screen_type=' + Ti.Platform.displayCaps.dpi);

		httpRegister.send();
	};

	// Open search places

	self.addEventListener('open', function() {
		beginUpdate(true);
	});

	topSearchHeaderRight.addEventListener('singletap', function() {
		if (searchContChange === false) {
			searchContChange = true;

	    	self.fireEvent('close_extra');
	    	self.close();
		}
	});

	tableSearchView.addEventListener('singletap', function(e) {
		if (e.rowData && e.rowData.dataType && e.rowData.dataType === 'place') {
			if (e.source && e.source.dataType && e.source.dataType === 'place-button') {

				Ti.API.info('DEBUG LOG: Search / Single tap [Place Subscribe/Unsubscribe]');

				var subscribers_total = parseInt(e.row.children[1].children[3].getText());

				if (e.row.children[2].dataStatus == 0) {
					Ti.API.info('DEBUG LOG: Search / Single tap [Place subscribe]');

					var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total + 1, [L('ui0124'), L('ui0125'), L('ui0126')]));
					subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total + 1);
					e.row.children[1].children[3].setText(subscribers_total_tmp);
					e.row.children[2].dataStatus = 1;
					e.row.children[2].setBorderColor('#FF3B30');
					e.row.children[2].children[0].setVisible(false);
					e.row.children[2].children[1].setVisible(true);

					var httpRegister;
					httpRegister = Ti.Network.createHTTPClient({
						validatesSecureCertificate: true,
						onload: function() {
							Ti.API.info('DEBUG LOG: Search / Subscribe http onload');

							if (isJsonString(this.responseText)) {
								Ti.API.info('DEBUG LOG: Search / Subscribe JSON is valid');

								var jsonResult = JSON.parse(this.responseText);

								if (ns.tools.underscore.has(jsonResult, 'error')) {
									Ti.API.error('DEBUG LOG: Search / Subscribe JSON error');

									var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total, [L('ui0124'), L('ui0125'), L('ui0126')]));
									subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total);
									e.row.children[1].children[3].setText(subscribers_total_tmp);
									e.row.children[2].dataStatus = 0;
									e.row.children[2].setBorderColor('#007AFF');
									e.row.children[2].children[1].setVisible(false);
									e.row.children[2].children[0].setVisible(true);

									if (jsonResult.error.code == '710') {
										Ti.App.fireEvent('app:auth_window');
									}
									else {
										Ti.API.info('DEBUG LOG: Search / Subscribe some error');
										searchContChange = false;
									}
								}
								else {
									Ti.API.info('DEBUG LOG: Search / Subscribe JSON success');
								}
							}
							else {
								var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total, [L('ui0124'), L('ui0125'), L('ui0126')]));
									subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total);
									e.row.children[1].children[3].setText(subscribers_total_tmp);
									e.row.children[2].dataStatus = 1;
									e.row.children[2].setBorderColor('#FF3B30');
									e.row.children[2].children[0].setVisible(false);		
									e.row.children[2].children[1].setVisible(true);
									searchContChange = false;
							}
						},
						onerror: function() {
							Ti.API.info('DEBUG LOG: Search / Subscribe timeout error');

							var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total, [L('ui0124'), L('ui0125'), L('ui0126')]));
							subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total);
							e.row.children[1].children[3].setText(subscribers_total_tmp);
							e.row.children[2].dataStatus = 0;
							e.row.children[2].setBorderColor('#007AFF');
							e.row.children[2].children[1].setVisible(false);
							e.row.children[2].children[0].setVisible(true);

							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0011'));
							windowError.open();

							windowError.addEventListener('close_extra', function() {
								if (windowError != null) {
									searchContChange = false;
									WindowError = null;
									windowError = null;
								}
							});	
						},
						timeout: 15000
					});
				    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=subscribe_to_place&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&place_id=' + e.rowData.dataPlaceId);			    
				    httpRegister.send();
				}
				else {
					Ti.API.info('DEBUG LOG: Search / Single tap [Place Unsubscribe]');

					var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total - 1, [L('ui0124'), L('ui0125'), L('ui0126')]));
					subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total - 1);
					e.row.children[1].children[3].setText(subscribers_total_tmp);
					e.row.children[2].dataStatus = 0;
					e.row.children[2].setBorderColor('#005AFF');
					e.row.children[2].children[1].setVisible(false);
					e.row.children[2].children[0].setVisible(true);

					var httpRegister;
	
					httpRegister = Ti.Network.createHTTPClient({
						validatesSecureCertificate: true,
						onload: function() {
							if (isJsonString(this.responseText)) {
								var jsonResult = JSON.parse(this.responseText);

								if (ns.tools.underscore.has(jsonResult, 'error')) {
									Ti.API.info('DEBUG LOG: Search / Subscribe error code ' +jsonResult.error.code);

									var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total, [L('ui0124'), L('ui0125'), L('ui0126')]));
									subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total);
									e.row.children[1].children[3].setText(subscribers_total_tmp);
									e.row.children[2].dataStatus = 1;
									e.row.children[2].setBorderColor('#FF3B30');
									e.row.children[2].children[0].setVisible(false);		
									e.row.children[2].children[1].setVisible(true);	
	
									if (jsonResult.error.code == '710') {
										Ti.App.fireEvent('app:auth_window');
									}
									else {
										searchContChange = false;	
									}
								}
								else {
									Ti.API.info('DEBUG LOG: Search / Subscribe success');
	
									searchContChange = false;		
								}
							}
							else {
								var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total, [L('ui0124'), L('ui0125'), L('ui0126')]));
								subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total);
								e.row.children[1].children[3].setText(subscribers_total_tmp);
								e.row.children[2].dataStatus = 1;
								e.row.children[2].setBorderColor('#FF3B30');
								e.row.children[2].children[0].setVisible(false);		
								e.row.children[2].children[1].setVisible(true);	
								
								WindowError = require('ui/ErrorWindow');
								windowError = new WindowError(L('ui0010'), L('x0014'));
								windowError.open();
	
								windowError.addEventListener('close_extra', function() {
									if (windowError != null) {
										searchContChange = false;
										WindowError = null;
										windowError = null;
									}
								});					
							}
						},
						onerror: function() {
							Ti.API.info('DEBUG LOG: Search / Unsubscribe Timeout error');
	
							var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total, [L('ui0124'), L('ui0125'), L('ui0126')]));
							subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total);
							e.row.children[1].children[3].setText(subscribers_total_tmp);
							e.row.children[2].dataStatus = 1;
							e.row.children[2].setBorderColor('#FF3B30');
							e.row.children[2].children[0].setVisible(false);
							e.row.children[2].children[1].setVisible(true);
	
							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0011'));
							windowError.open();
	
							windowError.addEventListener('close_extra', function() {
								if (windowError != null) {
									searchContChange = false;
									WindowError = null;
									windowError = null;
								}
							});
						},
						timeout: 15000
					});
	
				    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=unsubscribe_from_place&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&place_id=' + e.rowData.dataPlaceId);			    
				    httpRegister.send();
				}
			}
		}
	});

	// Scroll pleces

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

	// Close search

	self.addEventListener('close', function() {
		if (windowError != null) {
			windowError.close();
		}
	});

	return self;
}

module.exports = SearchWindow;