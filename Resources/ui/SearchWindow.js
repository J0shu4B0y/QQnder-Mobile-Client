function SearchWindow() {

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
			backgroundColor: 'RGBA(0, 0, 0, 0.5)',
		});

		self.add(spinnerCont);

		// Top menu

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
				backgroundColor: '#CDCED2'
			}));

			var topSearchHeaderCenter = Ti.UI.createView({
				left: 15,
				right: 120,
				height: 44,
				bottom: 0
			});

				var topSearchHeaderCenterLabelTextField = Ti.UI.createTextField({
				    left: 0,
				    font: {
						fontSize: 14,
						fontFamily: 'OpenSans-Regular',
						fontWeight: 'normal'
					},
					width: Ti.UI.FILL,
					color: '#5c5c5c',
					height: 28,
					padding: {
						left: 10,
						right: 10
					},
					hintText: L('ui0121'),
					textAlign: 'left',
					maxLength: 100,
					autocorrect: true,
					borderRadius: 5,
					hintTextColor: '#8C8C8C',
					returnKeyType: Ti.UI.RETURNKEY_SEARCH,
					backgroundColor:'#EFEFF3',
					autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
				});

			var topSearchHeaderRight = Ti.UI.createView({
				right: 0,
				width: 120,
				height: 44,
				bottom: 0
			});

				topSearchHeaderRight.add(Ti.UI.createLabel({
					font: {
						fontSize: 16,
						fontFamily: 'OpenSans-Regular',
						fontWeight: 'normal'
					},
					text: L('ui0122'),
					color: '#5C5C5C',
					textAlign: 'center'
				}));

			topSearchHeaderCenter.add(topSearchHeaderCenterLabelTextField);
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
					text: L('ui0138'),
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
					text: L('ui0139'),
					right: 70,
					color: '#5c5c5c',
					textAlign: 'center'
				}));

			searchUpdateRequired.add(searchUpdateRequiredCont);
		self.add(searchUpdateRequired);

		// Table search view

		var tableSearchView = Ti.UI.createTableView({
			top: (headerTop + 44),
			left: 0,
			data: [],
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			moving: false,
			zIndex: 10,
			editable: false,
			bubbleParent: false,
			horizontalWrap: false,
			separatorColor: '#FAFAFA',
			separatorStyle: Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
			backgroundColor: '#FAFAFA',
			allowsSelection: false,
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: false
		});

		self.add(tableSearchView);

	/**
	 * Actions
	 */

	var data = [];
	var WindowError = null;
	var windowError = null;
	var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);
	var incLoadingTime = null;
	var searchContChange = false;
	var WindowPlacesSearch = null;
	var windowPlacesSearch = null;
	var WindowDetails = null;
	var windowDetails = null;

	tableSearchView.setData(buildLastSearchQueries());

	// Do search

	topSearchHeaderCenterLabelTextField.addEventListener('return', function(e) {
		e.value = trim(e.value);

		if (e.value.length > 0 && ns.tools.underscore.last(ns.session.last_search_queries, 1) != e.value) {
			ns.session.last_search_queries.push(e.value);			
		}

		data = [];
		tableSearchView.setData(data);

		/**
		 * Header loading
		 */

		var headerLoading = Ti.UI.createView({
			width: 1,
			height: 2,
			top: (headerTop + 42),
			left: 0,
			backgroundColor: '#007AFF',
			zIndex: 20
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
									searchContChange = false;
									WindowError = null;
									windowError = null;
								}
							});
						}
					}
					else {
						if (jsonResult.success.result.events.data.length > 0 || jsonResult.success.result.places.data.length > 0) {

							// Events
							for (var search_event_i = 0; search_event_i < jsonResult.success.result.events.data.length; search_event_i++) {
								var event_padding_top = 25;
	
								if (search_event_i == 0) {
									var row = Ti.UI.createTableViewRow({
										allowsSelection: false,
										horizontalWrap: false,
							    		touchEnabled: true,
							    		hasChild: false,
							    		className: 'search-row-general',
							    		height: 40,
							    		width: Ti.Platform.displayCaps.platformWidth,
							    		selectedBackgroundColor: '#FAFAFA',
							    		selectedColor: '#FAFAFA',
							    		backgroundColor: '#FAFAFA',
							    		borderColor: '#FAFAFA',
							    		dataSearch: '',
							    		dataType: 'event-info',
							    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE
							  		});

							  			var someSearchEventInfoCont = Ti.UI.createView({
											top: 0,
											left: 25,
											right: 25,
											height: 40
										});

											someSearchEventInfoCont.add(Ti.UI.createLabel({
								  				left: 0,
								  				bottom: 0,
												font: {
													fontFamily: 'OpenSans-Regular',
													fontSize: 16,
													fontWeight: 'normal'
												},
												color: '#5c5c5c',
												text: L('ui0123')
											}));

											var someSearchEventInfoMore = Ti.UI.createView({
												bottom: 0,
												right: 0,
												height: 40,
												width: Ti.UI.SIZE
											});

												someSearchEventInfoMore.add(Ti.UI.createLabel({
									  				right: 0,
													bottom: 0,
													font: {
														fontFamily: 'OpenSans-Regular',
														fontSize: 16,
														fontWeight: 'normal'
													},
													color: '#007AFF',
													textAlign: 'right',
													text: L('ui0128')
												}));

											someSearchEventInfoCont.add(someSearchEventInfoMore);
										row.add(someSearchEventInfoCont);
									data.push(row);
								}
								else {
									event_padding_top = 15;
								}

								var row = Ti.UI.createTableViewRow({
									allowsSelection: false,
									horizontalWrap: false,
						    		touchEnabled: true,
						    		hasChild: false,
						    		className: 'search-row-general',
						    		height: Ti.UI.SIZE,
						    		layout: 'vertical',
						    		width: Ti.Platform.displayCaps.platformWidth,
						    		selectedBackgroundColor: '#FAFAFA',
						    		selectedColor: '#FAFAFA',
						    		backgroundColor: '#FAFAFA',
						    		borderColor: '#FAFAFA',
						    		dataEventId: jsonResult.success.result.events.data[search_event_i].group_idd,
						    		dataType: 'event',
						    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE
						  		});

						  			if (search_event_i > 0) {
						  				row.add(Ti.UI.createView({
											top: 0,
											left: 0,
											height: 15,
											width: Ti.UI.FILL
										}));
	
										row.add(Ti.UI.createView({
											top: 0,
											left: 25,
											right: 25,
											height: 1,
											backgroundColor: '#EFEFF3'
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
											borderRadius: 5,
											image: Ti.Utils.base64decode(jsonResult.success.result.events.data[search_event_i].image).toString(),
											ts_modification: jsonResult.success.result.events.data[search_event_i].ts_modification,
											defaultImage: '/img/ios/search/event_img_preload.png',
											data_event_image_default: '/img/ios/search/event_img_preload.png',
											width: 50,
											height: 50
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
												font: {
													fontFamily: 'OpenSans-Semibold',
													fontSize: 16,
													fontWeight: 'normal'
												},
												color: '#111111',
												text: jsonResult.success.result.events.data[search_event_i].header.title_two,
												left: 0,
												top: 0,
												height: Ti.UI.SIZE,
												textAlign: 'left'
											}));
		
											someSearchEventInfoCont.add(Ti.UI.createLabel({
												font: {
													fontFamily: 'OpenSans-Regular',
													fontSize: 12,
													fontWeight: 'normal'
												},
												color: '#8C8C8C',
												text: capitalizeFirstLetter(jsonResult.success.result.events.data[search_event_i].place_info.name),
												left: 0,
												top: 2,
												height: Ti.UI.SIZE,
												textAlign: 'left'
											}));
		
										someSearchEventCont.add(someSearchEventInfoCont);
	
										// Event details
	
							  			var someSearchEventDetailsCont = Ti.UI.createView({
											top: 0,
											right: 0,
											height: Ti.UI.SIZE,
											width: 90,
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
								data.push(row);
							}

							// Places
							for (var search_place_i = 0; search_place_i < jsonResult.success.result.places.data.length; search_place_i++) {
								var place_padding_top = 30;
	
								if (search_place_i == 0) {
									if (data.length > 0) {
										var row = Ti.UI.createTableViewRow({
											allowsSelection: false,
											horizontalWrap: false,
								    		touchEnabled: false,
								    		hasChild: false,
								    		className: 'search-row-top-space',
								    		height: 15,
								    		width: Ti.Platform.displayCaps.platformWidth,
								    		selectedBackgroundColor: '#FAFAFA',
								    		selectedColor: '#FAFAFA',
								    		backgroundColor: '#FAFAFA',
								    		borderColor: '#FAFAFA',
								    		dataType: 'place-space',
								    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE
								  		});
	
											row.add(Ti.UI.createView({
												left: 25,
												right: 25,
												bottom: 0,
												height: 1,
												backgroundColor: '#EFEFF3'
											}));
	
								  		data.push(row);
									}

									var row = Ti.UI.createTableViewRow({
										width: Ti.Platform.displayCaps.platformWidth,
										height: Ti.UI.SIZE,
										hasChild: false,
										dataType: 'place-info',
										className: 'search-row-general',
										dataSearch: '',
										borderColor: '#FAFAFA',
										touchEnabled: true,
										selectedColor: '#FAFAFA',
										horizontalWrap: false,
										selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE,
										backgroundColor: '#FAFAFA',
										allowsSelection: false,
							    		selectedBackgroundColor: '#FAFAFA'
							  		});

							  			var someSearchPlaceInfoCont = Ti.UI.createView({
											top: 0,
											left: 25,
											right: 25,
											height: 40
										});

											someSearchPlaceInfoCont.add(Ti.UI.createLabel({
								  				left: 0,
								  				bottom: 0,
												font: {
													fontFamily: 'OpenSans-Regular',
													fontSize: 16,
													fontWeight: 'normal'
												},
												color: '#5c5c5c',
												textAlign: 'left',
												text: L('ui0180')
											}));

											var someSearchPlaceInfoMore = Ti.UI.createView({
												bottom: 0,
												right: 0,
												height: 50,
												width: Ti.UI.SIZE
											});

												someSearchPlaceInfoMore.add(Ti.UI.createLabel({
									  				right: 0,
													bottom: 0,
													font: {
														fontFamily: 'OpenSans-Regular',
														fontSize: 16,
														fontWeight: 'normal'
													},
													color: '#007AFF',
													textAlign: 'right',
													text: L('ui0181')
												}));
	
											someSearchPlaceInfoCont.add(someSearchPlaceInfoMore);
										row.add(someSearchPlaceInfoCont);
									data.push(row);
								}
								else {
									place_padding_top = 15;
								}

								var row = Ti.UI.createTableViewRow({
						    		width: Ti.Platform.displayCaps.platformWidth,
						    		height: Ti.UI.SIZE,
						    		hasChild: false,
						    		dataType: 'place',
						    		className: 'search-row-general',
						    		borderColor: '#FAFAFA',
						    		dataPlaceId: jsonResult.success.result.places.data[search_place_i].id,
						    		touchEnabled: true,
						    		selectedColor: '#FAFAFA',
						    		horizontalWrap: false,
						    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE,
						    		backgroundColor: '#FAFAFA',
									allowsSelection: false,
						    		selectedBackgroundColor: '#FAFAFA'
						  		});

									// Place cont

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
											font: {
												fontSize: 12,
												fontFamily: 'OpenSans-Regular',
												fontWeight: 'normal'
											},
											text: L('ui0127').replace('{{string}}', declOfNum(jsonResult.success.result.places.data[search_place_i].subscribers, [L('ui0124'), L('ui0125'), L('ui0126')])).replace('{{number}}', jsonResult.success.result.places.data[search_place_i].subscribers),
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

									if (search_place_i > 0) {
										row.add(Ti.UI.createView({
											top: 0,
											left: 25,
											right: 25,
											height: 1,
											backgroundColor: '#EFEFF3'
										}));
									}

								data.push(row);
							}

							searchUpdateRequired.setVisible(false);
							tableSearchView.setData(data);
						}
						else {
							searchUpdateRequired.setVisible(true);
						}
					}
				}
				else {
					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0014'));
					windowError.open();

					windowError.addEventListener('close_extra', function() {
						searchContChange = false;
						
						if (windowError != null) {
							WindowError = null;
							windowError = null;
						}
					});
				}
			},
			onerror: function() {	
				clearInterval(incLoadingTime);

				if (headerLoading !== undefined) {
					self.remove(headerLoading);
				}

				tableSearchView.setData(buildLastSearchQueries());

				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0011'));
				windowError.open();
				
				windowError.addEventListener('close_extra', function() {
					searchContChange = false;
					WindowError = null;
					windowError = null;
				});
			},
			timeout: 15000
		});

	    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=general_search&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&search=' + e.value +'&location_id=' + ns.session.location_id + '&events_limit=' + ns.limits.general_search_events + '&places_limit=' + ns.limits.general_search_places);
	    httpRegister.send();
	});

	// Open search

	self.addEventListener('open', function() {
		Ti.API.info('DEBUG LOG: Search / Open');

		setTimeout(function() {
			Ti.API.info('DEBUG LOG: Search / Focus on search input');
			topSearchHeaderCenterLabelTextField.focus();
		}, 0);
	});

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
		var search_query = '';

		if (ns.session.last_search_queries && ns.session.last_search_queries.length > 0) {
			search_query = ns.session.last_search_queries.slice(-1);	
		}

		if (e.rowData && e.rowData.dataType && e.rowData.dataType === 'place-info' && search_query != '') {

			// Search Places

			var WindowPlacesSearch = null;
			var windowPlacesSearch = null;

			if (searchContChange === false) {
				searchContChange = true;

				// Spinner animation

				spinnerCont.setVisible(true);

				WindowPlacesSearch = require('ui/SearchPlacesWindow');
				windowPlacesSearch = new WindowPlacesSearch(search_query);
				windowPlacesSearch.open();

				windowPlacesSearch.addEventListener('close_extra', function() {
					WindowPlacesSearch = null;
					windowPlacesSearch = null;
					searchContChange = false;
					spinnerCont.setVisible(false);

					// Do search againg
					topSearchHeaderCenterLabelTextField.fireEvent('return', {
						value: topSearchHeaderCenterLabelTextField.getValue()
					});
				});
			}
		}
		else if (e.rowData && e.rowData.dataType && e.rowData.dataType === 'event-info' && search_query != '') {

			// Search Places

			var WindowEventsSearch = null;
			var windowEventsSearch = null;

			if (searchContChange === false) {
				searchContChange = true;

				// Spinner animation

				spinnerCont.setVisible(true);

				WindowEventsSearch = require('ui/SearchEventsWindow');
				windowEventsSearch = new WindowEventsSearch(search_query);
				windowEventsSearch.open();

				windowEventsSearch.addEventListener('close_extra', function() {
					WindowEventsSearch = null;
					windowEventsSearch = null;
					searchContChange = false;
					spinnerCont.setVisible(false);

					// Do search againg
					topSearchHeaderCenterLabelTextField.fireEvent('return', {
						value: topSearchHeaderCenterLabelTextField.getValue()
					});
				});
			}
		}
		else if (e.rowData && e.rowData.dataType && e.rowData.dataType === 'event') {
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
		else if (e.rowData && e.rowData.dataType && e.rowData.dataType === 'place') {
			if (e.source && e.source.dataType && e.source.dataType === 'place-button') {
				Ti.API.info('DEBUG LOG: Search / Single tap [Place Subscribe/Unsubscribe]');

				var subscribers_total = parseInt(e.row.children[0].children[3].getText());

				if (e.row.children[1].dataStatus == 0) {
					Ti.API.info('DEBUG LOG: Search / Single tap [Place subscribe]');

					var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total + 1, [L('ui0124'), L('ui0125'), L('ui0126')]));
					subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total + 1);
					e.row.children[0].children[3].setText(subscribers_total_tmp);
					e.row.children[1].dataStatus = 1;
					e.row.children[1].setBorderColor('#FF3B30');
					e.row.children[1].children[0].setVisible(false);
					e.row.children[1].children[1].setVisible(true);

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
									e.row.children[0].children[3].setText(subscribers_total_tmp);
									e.row.children[1].dataStatus = 0;
									e.row.children[1].setBorderColor('#007AFF');
									e.row.children[1].children[1].setVisible(false);
									e.row.children[1].children[0].setVisible(true);

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
									e.row.children[0].children[3].setText(subscribers_total_tmp);
									e.row.children[1].dataStatus = 1;
									e.row.children[1].setBorderColor('#FF3B30');
									e.row.children[1].children[0].setVisible(false);		
									e.row.children[1].children[1].setVisible(true);
									searchContChange = false;
							}
						},
						onerror: function() {
							Ti.API.info('DEBUG LOG: Search / Subscribe timeout error');

							var subscribers_total_tmp = L('ui0127').replace('{{string}}', declOfNum(subscribers_total, [L('ui0124'), L('ui0125'), L('ui0126')]));
							subscribers_total_tmp = subscribers_total_tmp.replace('{{number}}', subscribers_total);
							e.row.children[0].children[3].setText(subscribers_total_tmp);
							e.row.children[1].dataStatus = 0;
							e.row.children[1].setBorderColor('#007AFF');
							e.row.children[1].children[1].setVisible(false);
							e.row.children[1].children[0].setVisible(true);

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
					e.row.children[0].children[3].setText(subscribers_total_tmp);
					e.row.children[1].dataStatus = 0;
					e.row.children[1].setBorderColor('#005AFF');
					e.row.children[1].children[1].setVisible(false);
					e.row.children[1].children[0].setVisible(true);
	
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
									e.row.children[0].children[3].setText(subscribers_total_tmp);
									e.row.children[1].dataStatus = 1;
									e.row.children[1].setBorderColor('#FF3B30');
									e.row.children[1].children[0].setVisible(false);		
									e.row.children[1].children[1].setVisible(true);	
	
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
								e.row.children[0].children[3].setText(subscribers_total_tmp);
								e.row.children[1].dataStatus = 1;
								e.row.children[1].setBorderColor('#FF3B30');
								e.row.children[1].children[0].setVisible(false);		
								e.row.children[1].children[1].setVisible(true);	
								
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
							e.row.children[0].children[3].setText(subscribers_total_tmp);
							e.row.children[1].dataStatus = 1;
							e.row.children[1].setBorderColor('#FF3B30');
							e.row.children[1].children[0].setVisible(false);
							e.row.children[1].children[1].setVisible(true);
	
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
	    else if (e.rowData && e.rowData.dataType && e.rowData.dataType === 'query'
	    	&& e.rowData.dataSearch && e.rowData.dataSearch.length > 0) {

	    	topSearchHeaderCenterLabelTextField.setValue(e.rowData.dataSearch);
	    	topSearchHeaderCenterLabelTextField.fireEvent('return', {value: e.rowData.dataSearch});
	    	topSearchHeaderCenterLabelTextField.blur();
	    }
	});

	// Close search

	self.addEventListener('close', function() {
		if (windowError != null) {
			Ti.API.info('DEBUG LOG: Search / Error close');
			windowError.close();
		}

		if (windowPlacesSearch != null) {
			Ti.API.info('DEBUG LOG: Search / Places search close');
			windowPlacesSearch.close();
		}
	});

	return self;
}

module.exports = SearchWindow;