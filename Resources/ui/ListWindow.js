function ListWindow(list_sort) {

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

	var createHeaderListEventImage = {
		RemoteImage: function(a) {
			a = a || {};

			var md5;
			var needsToSave = false;
			var savedFile;
			var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');

			if (!cacheDir.exists()) {
				Ti.API.info('DEBUG LOG: Events / Create cache dir');
			    cacheDir.createDirectory();
			}

			if (a.image) {
				md5 = Ti.Utils.md5HexDigest(a.image + a.ts_modification) + '.png';
				savedFile = Ti.Filesystem.getFile(cacheDir.resolve(), md5);

				if (savedFile.exists()) {
					a.image = savedFile;
				}
				else {
					needsToSave = true;
				}
			}

			if (needsToSave == true) {
				Ti.API.info('DEBUG LOG: List / Event image needs to save');

				a.image = a.image + '?cache=' + new Date().getTime();
				var image = Ti.UI.createImageView(a);

				image.addEventListener('load', function(e) {
					Ti.API.info('DEBUG LOG: List / Save event image');
					
					if (savedFile.write(image.toImage(null, true)) === false) {
						Ti.API.info('DEBUG LOG: List / Save event image / Write error');
					}
				});

				image.addEventListener('error', function(e) {
					// If file not found
					if (e.code == 1) {
						Ti.API.info('DEBUG LOG: List / Use default event image');
					}
					else {
						setTimeout(function() {
							Ti.API.info('DEBUG LOG: List / Re-load event image');
							image.setImage(a.image);
						}, 15000);
					}
				});
			}
			else {
				Ti.API.info('DEBUG LOG: List / Event image not needs to save');
				var image = Ti.UI.createImageView(a);
			}

			return image;
		}
	};

	/**
	 * List
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
	
		var topListHeaderCont = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: (headerTop + 44)
		});

			topListHeaderCont.add(Ti.UI.createView({
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				bottom: 0,
				height: 1,
				backgroundColor:'#CDCED2'
			}));

			var topListHeaderCenter = Ti.UI.createView({
				left: 54,
				right: 54,
				height: 44,
				bottom: 0
			});

				topListHeaderCenter.add(Ti.UI.createLabel({
					text: L('ui0074'),
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					color: '#000000',
					height: Ti.UI.SIZE,
					textAlign: 'center'
				}));

			var topListHeaderLeft = Ti.UI.createView({
				left: 0,
				width: 54,
				bottom: 0,
				zIndex: 10,
				height: 44
			});

				topListHeaderLeft.add(Ti.UI.createView({
					width: 22,
					height: 22,
					backgroundRepeat: false,
					backgroundImage: '/img/ios/list/left_slider.png'
				}));

			topListHeaderCont.add(topListHeaderCenter);
			topListHeaderCont.add(topListHeaderLeft);
		self.add(topListHeaderCont);

		// Empty

		var listUpdateRequired = Ti.UI.createView({
			top: (headerTop + 44),
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			zIndex: 300,
			visible: false,
			backgroundColor: '#FFFFFF'
		});

			var listUpdateRequiredCont = Ti.UI.createView({
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				layout: 'vertical'
			});
	
				listUpdateRequiredCont.add(Ti.UI.createView({
					top: 0,
					width: 100,
					height: 100,
					backgroundImage: '/img/ios/list/notfound_icon.png',
					backgroundRepeat: false
				}));
	
				listUpdateRequiredCont.add(Ti.UI.createLabel({
					top: 5,
					text: L('ui0105'),
					font: {
						fontFamily: 'OpenSans-Bold',
						fontSize: 24,
						fontWeight: 'normal'
					},
					color: '#000000',
					textAlign: 'center'
				}));
	
				listUpdateRequiredCont.add(Ti.UI.createLabel({
					top: 5,
					left: 70,
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					text: L('ui0106'),
					right: 70,
					color: '#5c5c5c',
					textAlign: 'center'
				}));
	
			listUpdateRequired.add(listUpdateRequiredCont);
		self.add(listUpdateRequired);

		// Bottom list filter
	
		var bottomListFilterCont = Ti.UI.createView({
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			bottom: 0,
			height: 50
		});

			var bottomListFilterAll = Ti.UI.createView({
				top: 1,
				left: 0,
				width: (Ti.Platform.displayCaps.platformWidth / 2),
				height: 49
			});

				var bottomListFilterAllCont = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: 24,
					layout: 'horizontal'
				});

					bottomListFilterAllCont.add(Ti.UI.createView({
						width: 24,
						height: 24,
						backgroundImage: '/img/ios/list/all_icon.png',
						backgroundRepeat: false
					}));
	
					bottomListFilterAllLabel = Ti.UI.createLabel({
						left: 7,
						text: L('ui0077'),
						font: {
							fontFamily: 'OpenSans-Regular',
							fontSize: 14,
							fontWeight: 'normal'
						},
						color: '#222222'
					});
	
					bottomListFilterAllCont.add(bottomListFilterAllLabel);
				bottomListFilterAll.add(bottomListFilterAllCont);

			var bottomListFilterActive = Ti.UI.createView({
				top: 1,
				right: 0,
				width: (Ti.Platform.displayCaps.platformWidth / 2),
				height: 49,
				opacity: 0.5
			});

				var bottomListFilterActiveCont = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: 24,
					layout: 'horizontal'
				});

					bottomListFilterActiveCont.add(Ti.UI.createView({
						width: 24,
						height: 24,
						backgroundImage: '/img/ios/list/active_icon.png',
						backgroundRepeat: false
					}));

					bottomListFilterActiveCont.add(Ti.UI.createLabel({
						left: 7,
						font: {
							fontFamily: 'OpenSans-Regular',
							fontSize: 14,
							fontWeight: 'normal'
						},
						text: L('ui0078'),
						color: '#222222'
					}));

				bottomListFilterActive.add(bottomListFilterActiveCont);

				bottomListFilterCont.add(Ti.UI.createView({
					top: 1,
					width: Ti.Platform.displayCaps.platformWidth,
					height: 1,
					backgroundColor: '#EFEFF3'
				}));

				bottomListFilterCont.add(Ti.UI.createView({
					top: 1,
					width: 1,
					height: 49,
					backgroundColor: '#EFEFF3'
				}));
	
			bottomListFilterCont.add(bottomListFilterAll);
			bottomListFilterCont.add(bottomListFilterActive);
		self.add(bottomListFilterCont);

		// List

		var tableView = Ti.UI.createTableView({
			data: [],
		    top: (headerTop + 44),
		    left: 0,
		    width: Ti.Platform.displayCaps.platformWidth,
		    bottom: 50,
		    moving: false,
		    zIndex: 10,
		    editable: false,
			bubbleParent: false,
			separatorColor: '#FAFAFA',
			horizontalWrap: false,
			allowsSelection: false,
			separatorStyle: Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
			backgroundColor: '#FAFAFA',
			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: false
		});

		self.add(tableView);

		var httpRegister;
		var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);													
		var incLoadingTime = null;
		var page_number = 1;
		var type = 0;
		var data_list_idd = [];
		var data = [];
		var last_day = 0;
		var sort = '';
		var listContChange = false;
		var WindowError = null;
		var windowError = null;
		var WindowDetails = null;
		var windowDetails = null;
	
		function loadList() {
			if (incLoadingTime != null) {
		   		clearInterval(incLoadingTime);
		   	}
	
			/**
			 * Header loading
			 */
	
			var headerLoading = Ti.UI.createView({
				top: (headerTop + 42),
				left: 0,
				width: 1,
				height: 2,
				zIndex: 10000,
				backgroundColor: '#007AFF'
			});
	
			self.add(headerLoading);
	
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
	
						if (ns.tools.underscore.has(jsonResult, 'success')) {					
							if (jsonResult.success.code == '800') {
								if (jsonResult.success.result.length > 0) {
									ns.session.list_indicator = 0;
									Ti.App.Properties.setString('list_indicator', 0);
	
									if (listUpdateRequired.getVisible()) {
										listUpdateRequired.setVisible(false);
									}
	
									page_number += 1;
	
									for (var list_i = 0; list_i < jsonResult.success.result.length; list_i++) {
										if (in_array(jsonResult.success.result[list_i].id, data_list_idd) === false) {
											if (page_number > 1 && list_i == 0) {
												data.splice(-1, 1);
											}
	
											data_list_idd.push(jsonResult.success.result[list_i].id);
	
											var current_day = ns.tools.moment.unix(jsonResult.success.result[list_i].ts_registration).format('MDYY');
											var new_section = false;
	
											if (last_day == 0 || (current_day != last_day)) {
												var row = Ti.UI.createTableViewRow({
										    		touchEnabled: true,
										    		selectedBackgroundColor: '#FAFAFA',
										    		selectedColor: '#FAFAFA',
										    		backgroundColor: '#FAFAFA',
										    		borderColor: '#FAFAFA',
										    		height: Ti.UI.SIZE,
										    		className: 'list-row-date',
										    		hasChild: false,
										    		rowIndex: jsonResult.success.result[list_i].group_idd,
										    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE,
										    		layout: 'vertical'
										  		});
	
										  			if (last_day != 0) {
														row.add(Ti.UI.createView({
											  				top: 0,
													    	height: 1,
															backgroundColor: '#EFEFF3',
												    		width: Ti.UI.FILL
											  			}));
											  		}
	
											  		var someItemEventInfoCont = Ti.UI.createView({
														top: 0,
														left: 25,
														right: 25,
														height: 40
													});
	
													// Today, yesterday or some day
	
													if (ns.tools.moment().format('MDYY') == current_day) {
														someItemEventInfoCont.add(Ti.UI.createLabel({
															color: '#5C5C5C',
															height: Ti.UI.SIZE,
															font: {
																fontFamily: 'OpenSans-Semibold',
																fontSize: 14,
																fontWeight: 'normal'
															},
															text: L('ui0084'),
															left: 0,
															bottom: 0
														}));
													}
													else if (ns.tools.moment().subtract(1, 'days').format('MDYY') == current_day) {
											  			someItemEventInfoCont.add(Ti.UI.createLabel({
															color: '#5C5C5C',
															font: {
																fontFamily: 'OpenSans-Semibold',
																fontSize: 14,
																fontWeight: 'normal'
															},
															text: L('ui0085'),
															bottom: 0,
															left: 0
														}));
													}
													else {
											  			someItemEventInfoCont.add(Ti.UI.createLabel({
												  			height: Ti.UI.SIZE,
															color: '#5C5C5C',
															font: {
																fontFamily: 'OpenSans-Semibold',
																fontSize: 14,
																fontWeight: 'normal'
															},
															text: ns.tools.moment.unix(jsonResult.success.result[list_i].ts_registration).format('Do') + ' ' + capitalizeFirstLetter(L('mounth' + ns.tools.moment.unix(jsonResult.success.result[list_i].ts_registration).format('M'))),
															bottom: 0,
															left: 0
														}));
													}
	
													row.add(someItemEventInfoCont);
	
													row.add(Ti.UI.createView({
										  				top: 0,
												    	height: 5,
														backgroundColor: '#FAFAFA',
											    		width: Ti.UI.FILL
										  			}));
	
										  		data.push(row);
	
										  		last_day = current_day;
												new_section = true;
											}
	
											var row = Ti.UI.createTableViewRow({
												allowsSelection: false,
												horizontalWrap: false,
									    		touchEnabled: true,
									    		hasChild: false,
									    		className: 'list-row-general',
									    		height: Ti.UI.SIZE,
									    		width: Ti.Platform.displayCaps.platformWidth,
									    		selectedBackgroundColor: '#FFFFFF',
									    		selectedColor: '#FFFFFF',
									    		backgroundColor: '#FFFFFF',
									    		borderColor: '#FFFFFF',
									    		dataGroupIdd: jsonResult.success.result[list_i].group_idd,
									    		dataActive: 1,
									    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE,
									    		layout: 'vertical'
									  		});
	
									  			if (new_section == true) {
													row.add(Ti.UI.createView({
										  				top: 0,
												    	height: 1,
														backgroundColor: '#EFEFF3',
											    		width: Ti.UI.FILL
										  			}));
												}
												else {
													row.add(Ti.UI.createView({
										  				top: 0,
												    	height: 1,
														backgroundColor: '#EFEFF3',
											    		left: 25,
											    		right: 25
										  			}));
												}
	
									  			row.add(Ti.UI.createView({
													left: 0,
													top: 0,
													height: 15,
													width: Ti.UI.FILL
												}));
	
		  										var someListEventCont = Ti.UI.createView({
													top: 0,
													left: 25,
													right: 25,
													height: Ti.UI.SIZE
												});
	
									  				someListEventCont.add(createHeaderListEventImage.RemoteImage({
														top: 0,
									  					left: 0,
														width: 50,
														image: Ti.Utils.base64decode(jsonResult.success.result[list_i].image).toString(),
														height: 50,
														borderRadius: 5,
														defaultImage: '/img/ios/list/event_image_preload.png',
														ts_modification: jsonResult.success.result[list_i].ts_registration,
														data_event_image_default: '/img/ios/list/event_image_preload.png'
													}));
	
													var someListEventInfoCont = Ti.UI.createView({
														top: 0,
														left: 70,
														right: 100,
														height: Ti.UI.SIZE,
														layout: 'vertical'
													});
	
														someListEventInfoCont.add(Ti.UI.createLabel({
															font: {
																fontFamily: 'OpenSans-Semibold',
																fontSize: 16,
																fontWeight: 'normal'
															},
															color: '#111111',
															text: jsonResult.success.result[list_i].header.title_two,
															left: 0,
															top: 0,
															height: Ti.UI.SIZE,
															textAlign: 'left'
														}));
	
														someListEventInfoCont.add(Ti.UI.createLabel({
															font: {
																fontFamily: 'OpenSans-Regular',
																fontSize: 12,
																fontWeight: 'normal'
															},
															color: '#8C8C8C',
															text: capitalizeFirstLetter(jsonResult.success.result[list_i].place_info.name),
															left: 0,
															top: 2,
															height: Ti.UI.SIZE,
															textAlign: 'left'
														}));
	
													someListEventCont.add(someListEventInfoCont);
	
													// Event details
	
										  			var someListEventDetailsCont = Ti.UI.createView({
														top: 0,
														right: 0,
														height: Ti.UI.SIZE,
														width: 90,
														layout: 'vertical'
													});
	
														var event_details_1st_line = '';
														var event_details_2nd_line = '';
	
														if (trim(jsonResult.success.result[list_i].header.title_one) != '') {
															if (trim(jsonResult.success.result[list_i].header.title_three) != '') {									
																event_details_1st_line = charToCurrencySymbol(jsonResult.success.result[list_i].header.title_one).toUpperCase();
																event_details_2nd_line = charToCurrencySymbol(jsonResult.success.result[list_i].header.title_three).toUpperCase();
															}
															else {
																event_details_1st_line = jsonResult.success.result[list_i].header.title_one;
																event_details_2nd_line = capitalizeFirstLetter(L('ui0149'));
															}
														}
														else if (trim(jsonResult.success.result[list_i].header.title_three) != '' && trim(jsonResult.success.result[list_i].header.title_two) != '') {
															event_details_1st_line = charToCurrencySymbol(jsonResult.success.result[list_i].header.title_three).toUpperCase();
															event_details_2nd_line = capitalizeFirstLetter(L('ui0178'));
														}
														else {
															event_details_1st_line = capitalizeFirstLetter(L('ui0093'));
															event_details_2nd_line = '';
														}
	
														someListEventDetailsCont.add(Ti.UI.createLabel({
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
	
														someListEventDetailsCont.add(Ti.UI.createLabel({
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
	
													someListEventCont.add(someListEventDetailsCont);
													
												row.add(someListEventCont);
	
												row.add(Ti.UI.createView({
													left: 0,
													top: 0,
													height: 15,
													width: Ti.UI.FILL
												}));
	
											if (jsonResult.success.result[list_i].status != 1 || jsonResult.success.result[list_i].ts_finish < ns.tools.moment().unix()) {
									  			someListEventCont.setOpacity(0.5);
									  			row.dataActive = 0;
									  		}
	
											data.push(row);
	
											if (list_i == (jsonResult.success.result.length - 1)) {
												var row = Ti.UI.createTableViewRow({
													allowsSelection: false,
													horizontalWrap: false,
										    		touchEnabled: true,
										    		hasChild: false,
										    		className: 'list-space-general',
										    		height: Ti.UI.SIZE,
										    		width: Ti.Platform.displayCaps.platformWidth,
										    		selectedBackgroundColor: '#FAFAFA',
										    		selectedColor: '#FAFAFA',
										    		backgroundColor: '#FAFAFA',
										    		borderColor: '#FAFAFA',
										    		dataGroupIdd: jsonResult.success.result[list_i].group_idd,
										    		dataActive: 0,
										    		selectionStyle: Ti.UI.iOS.TableViewCellSelectionStyle.NONE,
										    		layout: 'vertical'
										  		});
												
													row.add(Ti.UI.createView({
										  				top: 0,
												    	height: 1,
														backgroundColor: '#EFEFF3',
											    		width: Ti.UI.FILL
										  			}));
												
													row.add(Ti.UI.createView({
														left: 0,
														top: 0,
														height: 15,
														width: Ti.UI.FILL
													}));
												
												data.push(row);
											}
								  		}
									}
	
									tableView.setData(data);
								}
								else if (data.length == 0) {
									if (data_list_idd.length == 0) { 
										listUpdateRequired.setVisible(true);
										data = [];
										tableView.setData(data);
									}
								}
	
								listContChange = false;
							}
							else {
								if (ns.tools.underscore.has(jsonResult, 'error') && jsonResult.error.code == '710') {
									Ti.App.fireEvent('app:auth_window');
								}
								else {
									WindowError = require('ui/ErrorWindow');
									windowError = new WindowError(L('ui0010'), L('x0014'));
									windowError.open();
	
									windowError.addEventListener('close_extra', function() {
										listContChange = false;
										WindowError = null;
										windowError = null;
									});
								}
							}
						}
						else {
							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0014'));
							windowError.open();
	
							windowError.addEventListener('close_extra', function() {
								listContChange = false;
								WindowError = null;
								windowError = null;
							});
						}
					}
					else {
						if (data_list_idd.length == 0) { 
							listUpdateRequired.setVisible(true);
						}
	
						WindowError = require('ui/ErrorWindow');
						windowError = new WindowError(L('ui0010'), L('x0014'));
						windowError.open();
	
						windowError.addEventListener('close_extra', function() {
							listContChange = false;
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

					if (data_list_idd.length == 0) {
						listUpdateRequired.setVisible(true);
					}

					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0011'));
					windowError.open();

					windowError.addEventListener('close_extra', function() {
						listContChange = false;
						WindowError = null;
						windowError = null;
					});
				},
				timeout: 15000
			});

		    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=list' +
		                             '&uuid=' + Ti.Platform.id +
		                             '&sort=' + sort + 
		                             '&token=' + ns.session.token +
		                             '&page_number=' + page_number);

		    httpRegister.send();
		};

		function beginUpdate() {
			listContChange = true;
			setTimeout(endUpdate, 2000);
		};

		function endUpdate() {
			loadList();
		};

		var lastListDistance = 0;

		tableView.addEventListener('scroll', function(e) {
			var offset = e.contentOffset.y;
			var height = e.size.height;
			var total = offset + height;
			var theEnd = e.contentSize.height;
			var distance = theEnd - total;

			if (distance < lastListDistance) {
				var nearEnd = theEnd * .75;
	
				if (listContChange === false && (total >= nearEnd)) {
					beginUpdate();
				}
			}
	
			lastListDistance = distance;
		});

		/**
		 * Actions
		 */

		bottomListFilterAll.addEventListener('singletap', function() {	
			if (listContChange === false) {
				listContChange = true;
				bottomListFilterAll.setOpacity(1);
				bottomListFilterActive.setOpacity(0.5);
				page_number = 1;
				last_day = 0;
				data = [];
				data_list_idd = [];
				tableView.setData(data);
				sort = 'new';
				loadList();
			}
		});

		bottomListFilterActive.addEventListener('singletap', function() {
			if (listContChange === false) {
				listContChange = true;
				bottomListFilterAll.setOpacity(0.5);
				bottomListFilterActive.setOpacity(1);
				page_number = 1;
				last_day = 0;
				data = [];
				data_list_idd = [];
				tableView.setData(data);
				sort = 'active';
				loadList();
			}
		});

		topListHeaderLeft.addEventListener('singletap', function() {
			if (listContChange === false) {
				listContChange = true;
	
		    	self.fireEvent('close_extra');
		    	self.close();
			}
		});

		tableView.addEventListener('singletap', function(e) {
			if (listContChange === false && !checkConnection()) {
				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();
	
				windowError.addEventListener('close_extra', function() {
					WindowError = null;
					windowError = null;
					listContChange = false;
				});
			}
			else if (listContChange === false
				&& e.rowData.dataGroupIdd
				&& e.rowData.dataGroupIdd > 0
				&&  e.rowData.dataActive == 1) {

					listContChange = true;

					// Spinner animation

					spinnerCont.setVisible(true);

					WindowDetails = require('ui/EventDetailsWindow');
					windowDetails = new WindowDetails(e.rowData.dataGroupIdd);
					windowDetails.open();

					windowDetails.addEventListener('close_extra', function() {
						WindowDetails = null;
						windowDetails = null;
						listContChange = false;
						spinnerCont.setVisible(false);
					});
			}
		});

		self.addEventListener('open', function() {
			listContChange = true;	
			sort = 'new';
			loadList();
		});

		self.addEventListener('close', function() {
			if (windowError != null) {
				windowError.close();
			}
	
			if (windowDetails != null) {
				windowDetails.close();
			}
		});

	return self;
}

module.exports = ListWindow;