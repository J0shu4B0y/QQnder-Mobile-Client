function EventsWindow(group_idd, type_event_window) {

	// Session variable
	var similar_places_tmp_arr;

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

	var createHeaderEventImage = {
		RemoteImage: function(a) {
			a = a || {};

			var md5;
			var needsToSave = false;
			var savedFile = null;
			var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');

			if (!cacheDir.exists()) {
				Ti.API.info('DEBUG LOG: Events / Create cache dir');
			    cacheDir.createDirectory();
			}

			if (a.image) {
				md5 = Ti.Utils.md5HexDigest(a.image + a.ts_modification) + '.png';
				savedFile = Ti.Filesystem.getFile(cacheDir.resolve(), md5);

				if (savedFile.exists()) {
					a.opacity = 0;
					a.image = savedFile;
				}
				else {
					needsToSave = true;
				}
			}

			if (needsToSave == true) {
				Ti.API.info('DEBUG LOG: Events / Event image needs to save');

				a.image = a.image + '?cache=' + new Date().getTime();
				var image = Ti.UI.createImageView(a);

				image.addEventListener('load', function(e) {
					Ti.API.info('DEBUG LOG: Events / Save event image');

					if (savedFile.write(image.toImage(null, true)) === false) {
						Ti.API.info('DEBUG LOG: Events / Save event image / Write error');
					}
				});

				image.addEventListener('error', function(e) {
					// If file not found
					if (e.code == 1) {
						Ti.API.info('DEBUG LOG: Events / Use default event image');
					}
					else {
						setTimeout(function() {
							Ti.API.info('DEBUG LOG: Events / Re-load event image');
							image.setImage(a.image);
						}, 15000);
					}
				});
			}
			else {
				Ti.API.info('DEBUG LOG: Events / Event image not needs to save');
				var image = Ti.UI.createImageView(a);
			}

			return image;
		}
	};

	var createCommentAvatar = {
		RemoteImage: function(a) {
			a = a || {};

			var md5;
			var needsToSave = false;
			var savedFile = null;
			var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, 'cache');

			if (!cacheDir.exists()) {
				Ti.API.info('DEBUG LOG: Profile / Create cache dir');
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
				Ti.API.info('DEBUG LOG: Events / Comment avatar needs to save');

				a.image = a.image + '?cache=' + new Date().getTime();
				var image = Ti.UI.createImageView(a);

				image.addEventListener('load', function(e) {
					Ti.API.info('DEBUG LOG: Events / Save comment user avatar');

					if (savedFile.write(image.toImage(null, true)) === false) {
						Ti.API.info('DEBUG LOG: Events / Save comment user avatar / Write error');
					}
				});

				image.addEventListener('error', function(e) {
					// If file not found
					if (e.code == 1) {
						Ti.API.info('DEBUG LOG: Profile / Use default comment user avatar');
						image.setImage(a.data_user_avatar_default);
					}
					else {
						setTimeout(function() {
							Ti.API.info('DEBUG LOG: Profile / Re-load comment user avatar');
							image.setImage(a.image);
						}, 15000);
					}
				});
			}
			else {
				Ti.API.info('DEBUG LOG: Comments / Comment user avatar not needs to save');
				var image = Ti.UI.createImageView(a);
			}

			return image;
		}
	};

	/**
	 * Events
	 */

	var self = Ti.UI.createWindow({
		top: 0,
		left: 0,
		width: Ti.Platform.displayCaps.platformWidth,
	    height: Ti.UI.FILL,
	    backgroundColor: '#FAFAFA',
	    statusBarStyle: Ti.UI.iOS.StatusBar.GRAY
	});

		// Loading
	
		var spinnerCont = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			zIndex: 300,
			backgroundColor: 'RGBA(0, 0, 0, 0.5)',
			visible: false
		});
	
		self.add(spinnerCont);
	
		// Pop-Up message
	
		var hideScreenCont = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			zIndex: 300,
			backgroundColor: 'transparent',
			visible: false
		});
	
			var hideScreenSlide = Ti.UI.createView({
				top: 0,
				left: 0,
			    width: Ti.Platform.displayCaps.platformWidth,
			    height: Ti.UI.SIZE,
				backgroundColor: 'transparent',
				layout: 'vertical'
			});
			
				hideScreenSlide.add(Titanium.UI.createView({
					top: 0,
					left: 0,
					height: headerTop + 8,
					width: Ti.UI.FILL,
					backgroundColor: 'RGBA(0, 0, 0, 0.8)'
				}));
	
				var hideScreenGeneralText = Ti.UI.createTextArea({
					top: 0,
					left: 0,
					value: '',
					padding: {
						left: 25,
						right: 25,
					},
					editable: false,
					textAlign: 'center',
					height: Ti.UI.SIZE,
					width: Ti.Platform.displayCaps.platformWidth,
					color: '#FFFFFF',
					backgroundColor: 'RGBA(0, 0, 0, 0.8)',
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 13,
						fontWeight: 'normal'
					}
				});
	
				hideScreenSlide.add(hideScreenGeneralText);
	
				hideScreenSlide.add(Titanium.UI.createView({
					top: 0,
					left: 0,
					height: 8,
					width: Ti.UI.FILL,
					backgroundColor: 'RGBA(0, 0, 0, 0.8)'
				}));
	
			hideScreenCont.add(hideScreenSlide);
		self.add(hideScreenCont);

		// Feedback

		var feedback = Titanium.UI.createView({
		    width: Ti.Platform.displayCaps.platformWidth,
		    height: Ti.UI.FILL,
		    top: 0,
		    left: 0,
		    backgroundColor: 'RGBA(0, 0, 0, 0.5)',
		    zIndex: 250,
		    visible: false
		});

			var feedbackCont = Titanium.UI.createView({
				height: Ti.UI.SIZE,
				width: 280,
				backgroundColor: 'RGBA(255, 255, 255, 1)',
				borderRadius: 5,
				layout: 'vertical',
				preventDefault: true
			});

				var feedbackTitleCont = Titanium.UI.createView({
					top: 25,
					left: 25,
					right: 25,
					height: Ti.UI.SIZE,
					preventDefault: true
				});

					feedbackTitleCont.add(Ti.UI.createLabel({
						font: {
							fontFamily: 'OpenSans-Semibold',
							fontSize: 15,
							fontWeight: 'normal'
						},
						color: '#000000',
						text: L('ui0155'),
						textAlign: 'center',
						preventDefault: true
					}));

				feedbackCont.add(feedbackTitleCont);

				feedbackCont.add(Ti.UI.createLabel({
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#5C5C5C',
					text: L('ui0154'),
					top: 15,
					left: 25,
					right: 25,
					textAlign: 'center',
					preventDefault: true
				}));

				feedbackCont.add(Titanium.UI.createView({
					top: 20,
					left: 0,
					height: 1,
					width: Ti.UI.FILL,
					backgroundColor: '#EFEFF3',
					preventDefault: true
				}));

				var feedbackPlaceEventCloseCont = Titanium.UI.createView({
					top: 0,
					left: 0,
					height: 50,
					width: Ti.UI.FILL
				});

					feedbackPlaceEventCloseCont.add(Ti.UI.createLabel({
						font: {
							fontFamily: 'OpenSans-Regular',
							fontSize: 15,
							fontWeight: 'normal'
						},
						color: '#000000',
						text: L('ui0153'),
						height: Ti.UI.SIZE
					}));

				feedbackCont.add(feedbackPlaceEventCloseCont);

				feedbackCont.add(Titanium.UI.createView({
					top: 0,
					left: 0,
					height: 1,
					width: Ti.UI.FILL,
					backgroundColor: '#EFEFF3',
					preventDefault: true
				}));

				var feedbackPlaceCloseCont = Titanium.UI.createView({
					top: 0,
					left: 0,
					height: 50,
					width: Ti.UI.FILL
				});

					feedbackPlaceCloseCont.add(Ti.UI.createLabel({
						font: {
							fontFamily: 'OpenSans-Regular',
							fontSize: 15,
							fontWeight: 'normal'
						},
						color: '#000000',
						text: L('ui0152'),
						height: Ti.UI.SIZE
					}));

				feedbackCont.add(feedbackPlaceCloseCont);

				feedbackCont.add(Titanium.UI.createView({
					top: 0,
					left: 0,
					height: 1,
					width: Ti.UI.FILL,
					backgroundColor: '#EFEFF3',
					preventDefault: true
				}));
	
				var feedbackPlaceChangePhoneCont = Titanium.UI.createView({
					top: 0,
					left: 0,
					height: 50,
					width: Ti.UI.FILL
				});
	
					feedbackPlaceChangePhoneCont.add(Ti.UI.createLabel({
						font: {
							fontFamily: 'OpenSans-Regular',
							fontSize: 15,
							fontWeight: 'normal'
						},
						color: '#000000',
						text: L('ui0151'),
						height: Ti.UI.SIZE
					}));
	
				feedbackCont.add(feedbackPlaceChangePhoneCont);
			feedback.add(feedbackCont);
		self.add(feedback);

	// Top menu

	var topPlaceHeaderCont = Ti.UI.createView({
		height: (headerTop + 44),
		width: Ti.Platform.displayCaps.platformWidth,
		top: 0,
		left: 0,
		zIndex: 150,
		backgroundColor: '#FAFAFA'
	});

		topPlaceHeaderCont.add(Ti.UI.createView({
			height: 1,
			width: Ti.Platform.displayCaps.platformWidth,
			bottom: 0,
			left: 0,
			backgroundColor: '#CDCED2'
		}));

		var topPlaceHeaderLeft = Ti.UI.createView({
			left: 0,
			height: 44,
			width: 54,
			bottom: 0
		});

			topPlaceHeaderLeft.add(Ti.UI.createView({
				backgroundImage: '/img/ios/events/left_slider.png',
				backgroundRepeat: false,
				height: 22,
				width: 22
			}));

		var topPlaceHeaderCenter = Ti.UI.createView({
			right: 54,
			left: 54,
			height: 44,
			bottom: 0
		});

			var topPlaceHeaderLabel = Ti.UI.createLabel({
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 16,
					fontWeight: 'normal'
				},
				text: '',
				color: '#000000',
				height: Ti.UI.SIZE,
				textAlign: 'center'
			});

			topPlaceHeaderCenter.add(topPlaceHeaderLabel);

			if (ns.session.category == 0) {
				topPlaceHeaderLabel.setText(L('ui0165').replace('\n', ' '));
			}
			else if (ns.session.category == 1) {
				topPlaceHeaderLabel.setText(L('ui0069').replace('\n', '/'));
			}		
			else if (ns.session.category == 2) {
				topPlaceHeaderLabel.setText(L('ui0070').replace('\n', '/'));
			}
			else if (ns.session.category == 3) {
				topPlaceHeaderLabel.setText(L('ui0071').replace('\n', '/'));
			}
			else if (ns.session.category == 4) {
				topPlaceHeaderLabel.setText(L('ui0072').replace('\n', '/'));
			}
			else {
				topPlaceHeaderLabel.setText(L('ui0076').replace('\n', '/'));
			}

		var topPlaceHeaderComments = Ti.UI.createView({
			right: 0,
			height: 44,
			width: 54,
			bottom: 0
		});

			topPlaceHeaderComments.add(Ti.UI.createView({
				backgroundImage: '/img/ios/events/comments.png',
				backgroundRepeat: false,
				height: 22,
				width: 22
			}));

			var topPlaceHeaderCommentsIndicator = Ti.UI.createView({
				visible: false,
				height: 8,
				width: 8,
				right: 15,
				top: 10,
				borderRadius: 4,
				borderColor: '#FAFAFA',
				borderWidth: 1,
				backgroundColor: '#FF3B30'
			});

			topPlaceHeaderComments.add(topPlaceHeaderCommentsIndicator);
		topPlaceHeaderCont.add(topPlaceHeaderLeft);
		topPlaceHeaderCont.add(topPlaceHeaderCenter);
		topPlaceHeaderCont.add(topPlaceHeaderComments);
	self.add(topPlaceHeaderCont);

    /**
     * Default
     */

	var	someEventDefault = Ti.UI.createView({
		top: headerTop,
		left: 0,
    	width: Ti.Platform.displayCaps.platformWidth,
    	height: Ti.UI.FILL,
		zIndex: 125,
		visible: true,
		backgroundColor: '#FAFAFA'
	});

		var someEventDefaultCont = Ti.UI.createView({
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.SIZE,
			layout: 'vertical'
		});

			someEventDefaultCont.add(Ti.UI.createView({
				top: 0,
				width: 100,
				height: 100,
				backgroundImage: '/img/ios/events/loading_icon.png',
				backgroundRepeat: false
			}));

			someEventDefaultCont.add(Ti.UI.createLabel({
				top: 5,
				text: L('ui0045'),
				font: {
					fontFamily: 'OpenSans-Bold',
					fontSize: 24,
					fontWeight: 'normal'
				},
				color: '#000000',
				textAlign: 'center'
			}));

			someEventDefaultCont.add(Ti.UI.createLabel({
				top: 5,
				left: 70,
				font: {
					fontFamily: 'OpenSans-Regular',
					fontSize: 15,
					fontWeight: 'normal'
				},
				text: L('ui0046'),
				right: 70,
				color: '#5c5c5c',
				textAlign: 'center'
			}));

		someEventDefault.add(someEventDefaultCont);
	self.add(someEventDefault);

    /**
     * General Cont
     */

    var generalCont = Ti.UI.createView({
    	top: 0,
    	left: 0,
    	width: Ti.Platform.displayCaps.platformWidth,
    	height: Ti.UI.FILL,
    	zIndex: 100,
    	backgroundColor: '#FFFFFF'
    });

		// Update required

		var someEventUpdateRequired = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
			zIndex: 250,
			visible: false,
			backgroundColor: '#FFFFFF'
		});

			var someEventUpdateRequiredCont = Ti.UI.createView({
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				layout: 'vertical'
			});

				someEventUpdateRequiredCont.add(Ti.UI.createView({
					top: 0,
					width: 100,
					height: 100,
					backgroundImage: '/img/ios/events/notfound_icon.png',
					backgroundRepeat: false
				}));

				someEventUpdateRequiredCont.add(Ti.UI.createLabel({
					top: 5,
					text: L('ui0038'),
					font: {
						fontFamily: 'OpenSans-Bold',
						fontSize: 24,
						fontWeight: 'normal'
					},
					color: '#000000',
					textAlign: 'center'
				}));

				someEventUpdateRequiredCont.add(Ti.UI.createLabel({
					top: 5,
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					left: 70,
					text: L('ui0037'),
					right: 70,
					color: '#5c5c5c',
					textAlign: 'center'
				}));

				var someEventUpdateRequiredButton = Ti.UI.createView({
					top: 20,
					left: 25,
					right: 25,
					height: 50,
					borderRadius: 5,
					backgroundColor: '#005AFF'
				});

					someEventUpdateRequiredButton.add(Ti.UI.createLabel({
						font: {
							fontFamily: 'OpenSans-Regular',
							fontSize: 18,
							fontWeight: 'normal'
						},
						color: '#FFFFFF',
						textAlign: 'center',
						text: L('ui0039')
					}));

				someEventUpdateRequiredCont.add(someEventUpdateRequiredButton);
			someEventUpdateRequired.add(someEventUpdateRequiredCont);
		generalCont.add(someEventUpdateRequired);

		// Event

		var generalInfoScrollView = Ti.UI.createScrollView({
			top: (headerTop + 44),
	  	    left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL,
		    zIndex: 30,
		    layout: 'vertical',
		    contentWidth: Ti.UI.FILL,
		    contentHeight: Ti.UI.SIZE,
		    disableBounce: true,
		    backgroundColor: '#FAFAFA',
		    showVerticalScrollIndicator: false,
		    showHorizontalScrollIndicator: false
		});

			var eventTypePositioning = Ti.UI.createView({
				top: 25,
				left: 25,
				right: 25,
				height: Ti.UI.SIZE,
				layout: 'horizontal'
			});

				var eventTypePositioning1st = Ti.UI.createLabel({
					top: 0,
					left: 0,
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					text: L('ui0150').toUpperCase(),
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 14,
						fontWeight: 'normal'
					},
					color: '#000000'
				});

				eventTypePositioning.add(eventTypePositioning1st);

				var eventTypePositioning2nd = Ti.UI.createLabel({
					top: 0,
					left: 7,
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					text: L('ui0150').toUpperCase(),
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Semibold',
						fontSize: 14,
						fontWeight: 'normal'
					},
					color: '#5c5c5c'
				});

				eventTypePositioning.add(eventTypePositioning2nd);
			generalInfoScrollView.add(eventTypePositioning);
		
			var eventGeneralDesc = Ti.UI.createLabel({
				top: 10,
				text: '',
				left: 25,
				font: {
					fontFamily: 'OpenSans-Bold',
					fontSize: 24,
					fontWeight: 'normal'
				},
				right: 50,
				color: '#000000',
				height: Ti.UI.SIZE,
				opacity: 0,
				textAlign: 'left'
			});

			generalInfoScrollView.add(eventGeneralDesc);
			
			var eventCountDown = Ti.UI.createLabel({
				top: 14,
				left: 25,
				text: '',
				textAlign: 'left',
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				color: '#5C5C5C',
				font: {
					fontFamily: 'Merriweather-Italic',
					fontSize: 14,
					fontWeight: 'normal'
				}
			});

			generalInfoScrollView.add(eventCountDown);

			// Init Event

			var someEventCont = Ti.UI.createView({
				top: 25,
				left: 25,
				right: 25,
				height: (Ti.Platform.displayCaps.platformWidth - (25 * 2)),
				borderRadius: 5,
				dataUrl: '',
				dataDesc: '',
				dataTitle: '',
				dataPlaceId: 0,
				dataImageUrl: '',
				dataPlacePhone: '',
				dataPlaceTsStart: '',
				dataPlaceWebsite: '',
				dataEventGroupIdd: 0,
				dataPlaceTsFinish: '',
				dataPlaceLatitude: '',
				dataPlaceLongitude: '',
				dataPlaceSubscribeStatus: 0
			});

			generalInfoScrollView.add(someEventCont);

			var generalInfoScrollViewCont = Ti.UI.createView({
				top: 25,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				height: Ti.UI.SIZE,
				layout: 'vertical',
				backgroundColor: '#FAFAFA'
			});

				var someEventPlaceCont = Ti.UI.createView({
					top: 0,
					left: 25,
					right: 25,
					height: Ti.UI.SIZE,
					layout: 'horizontal',
					zIndex: 15
				}); 

					var someEventPlaceLeftCont = Ti.UI.createView({
						top: 0,
						left: 0,
						width: (Ti.Platform.displayCaps.platformWidth - 120 - 25 - 25),
						height: Ti.UI.SIZE,
						layout: 'vertical'
					});

						var someEventPlaceTitle = Ti.UI.createLabel({
							font: {
								fontFamily: 'OpenSans-Semibold',
								fontSize: 16,
								fontWeight: 'normal'
							},
							color: '#111111',
							text: '',
							left: 0,
							top: 0,
							height: Ti.UI.SIZE,
							textAlign: 'left'
						});

						someEventPlaceLeftCont.add(someEventPlaceTitle);

						var someEventPlaceAddress = Ti.UI.createLabel({
							font: {
								fontFamily: 'OpenSans-Regular',
								fontSize: 13,
								fontWeight: 'normal'
							},
							color: '#8C8C8C',
							text: '',
							left: 0,
							top: 4,
							height: Ti.UI.SIZE,
							textAlign: 'left'
						});

						someEventPlaceLeftCont.add(someEventPlaceAddress);

						var someEventExtraUnderAddressCont = Ti.UI.createView({
							top: 8,
							left: 0,
							width: (Ti.Platform.displayCaps.platformWidth - 120 - 25 - 25),
							height: Ti.UI.SIZE,
							layout: 'horizontal'
						});

							var someEventExtraUnderAddressTimeCont = Ti.UI.createView({
								top: 0,
								left: 0,
								width: Ti.UI.SIZE,
								height: 22,
								layout: 'horizontal'
							});

								var someEventTimeIcon = Ti.UI.createView({
									left: 0,
									width: 20,
									height: 20,
									backgroundImage: '/img/ios/events/time_green.png',
									backgroundRepeat: false
								});

								var someEventTimeText = Ti.UI.createLabel({
									text: '',
									font: {
										fontFamily: 'OpenSans-Regular',
										fontSize: 13,
										fontWeight: 'normal'
									},
									left: 10,
									width: Ti.UI.SIZE,
									color: '#5C5C5C',
									textAlign: 'left'
								});

								someEventExtraUnderAddressTimeCont.add(someEventTimeIcon);
								someEventExtraUnderAddressTimeCont.add(someEventTimeText);
							someEventExtraUnderAddressCont.add(someEventExtraUnderAddressTimeCont);
						someEventPlaceLeftCont.add(someEventExtraUnderAddressCont);
					someEventPlaceCont.add(someEventPlaceLeftCont);

					var someEventPlaceRightCont = Ti.UI.createView({
						left: 0,
						top: 0,
						width: 120,
						height: Ti.UI.SIZE
					});

						// Map Cont

						var mapCont = Ti.UI.createView({
							top: 0,
							right: 0,
							width: 120,
							height: 70
						});

							var map = apple_map.createView({
								height: Ti.UI.FILL,
								width: Ti.UI.FILL,
							    mapType: apple_map.TERRAIN_TYPE,
							    animate: true,
							    userLocation: false,
							    touchEnabled: false,
							    rotateEnabled: false,
							    backgroundColor: 'transparent',
							    showsPointsOfInterest: false
							});

					    	mapCont.add(map);

					    	var mapFront = Ti.UI.createView({
					    		top: 0,
					    		right: 0,
								width: Ti.UI.FILL,
								height: Ti.UI.FILL,
					          	backgroundGradient: {
						            type: 'linear',
						            startPoint: {
						            	x: '0%',
						            	y: '0%'
						            },
						            endPoint: {
						            	x: '100%',
						            	y: '0%'
						            },
						            colors: [
							            {
							                color: 'RGBA(250, 250, 250, 1)',
							                offset: 0.0
							            },
							            {
							                color: 'RGBA(255, 255, 255, 0)',
							                offset: 0.5
							            }
							        ]
						        },
						        zIndex: 10
							});

							mapCont.add(mapFront);
						someEventPlaceRightCont.add(mapCont);
					someEventPlaceCont.add(someEventPlaceRightCont);
				generalInfoScrollViewCont.add(someEventPlaceCont);

				// Subscribe button

				var someEventSubscribeButton = Ti.UI.createView({
					top: 20,
					left: 25,
					right: 25,
					height: 37,
					borderColor: '#007AFF',
					borderWidth: 1,
					borderRadius: 5
				});

					var someEventSubscribeButtonText = Ti.UI.createLabel({
						font: {
							fontFamily: 'OpenSans-Regular',
							fontSize: 15,
							fontWeight: 'normal'
						},
						text: L('ui0198'),
						color: '#007AFF',
						height: Ti.UI.SIZE,
						textAlign: 'center'
					});

					someEventSubscribeButton.add(someEventSubscribeButtonText);
				generalInfoScrollViewCont.add(someEventSubscribeButton);

				// Show number of views and likes

				var eventContBar = Ti.UI.createView({
					top: 15,
					left: 25,
					right: 25,
					height: Ti.UI.SIZE,
					layout: 'vertical'
				});

				generalInfoScrollViewCont.add(eventContBar);

				generalInfoScrollViewCont.add(Ti.UI.createView({
					top: 15,
					left: 25,
					right: 25,
					width: Ti.UI.FILL,
					height: 1,
					backgroundColor: '#EFEFF3'
				}));

				// Event text

				var someEventPlaceText = Ti.UI.createLabel({
					text: '',
					top: 15,
					left: 25,
					right: 25,
					textAlign: 'left',
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 15,
						fontWeight: 'normal'
					},
					color: '#5C5C5C',
					height: Ti.UI.SIZE
				});

				generalInfoScrollViewCont.add(someEventPlaceText);

				// Social Cont

				generalInfoScrollViewCont.add(Ti.UI.createView({
					top: 15,
					left: 25,
					right: 25,
					height: 1,
					backgroundColor: '#EFEFF3'
				}));

				var eventSocialCont = Ti.UI.createView({
					top: 15,
					left: 25,
					right: 25,
					height: Ti.UI.SIZE
				});

				generalInfoScrollViewCont.add(eventSocialCont);

				var eventSocialButtonsCont = Ti.UI.createView({
					top: 15,
					left: 25,
					right: 25,
					height: Ti.UI.SIZE,
					backgroundColor: '#FAFAFA',
					layout: 'horizontal'
				});

				    var eventSocialButtonTwitter = Ti.UI.createView({
				    	width: 36,
				    	height: 36,
				    	top: 0,
				    	left: 0
				    });

					    eventSocialButtonTwitter.add(Ti.UI.createView({
					    	top: 0,
					    	width: 36,
					    	height: 36,
					    	backgroundImage: '/img/ios/events/social_twitter_icon.png',
					    	backgroundRepeat: false
					    }));

						eventSocialButtonsCont.add(eventSocialButtonTwitter);

					var eventSocialButtonFacebook = Ti.UI.createView({
				    	width: 36,
				    	height: 36,
				    	top: 0,
				    	left: 15
				    });

					    eventSocialButtonFacebook.add(Ti.UI.createView({
					    	top: 0,
					    	width: 36,
					    	height: 36,
					    	backgroundImage: '/img/ios/events/social_facebook_icon.png',
					    	backgroundRepeat: false
					    }));

					    eventSocialButtonsCont.add(eventSocialButtonFacebook);

					var eventSocialButtonWhatsapp = Ti.UI.createView({
				    	width: 36,
				    	height: 36,
				    	top: 0,
				    	left: 15
				    });

					    eventSocialButtonWhatsapp.add(Ti.UI.createView({
					    	top: 0,
					    	width: 36,
					    	height: 36,
					    	backgroundImage: '/img/ios/events/social_whatsapp_icon.png',
					    	backgroundRepeat: false
					    }));

					    eventSocialButtonsCont.add(eventSocialButtonWhatsapp);

					var eventSocialButtonEmail = Ti.UI.createView({
				    	width: 36,
				    	height: 36,
				    	top: 0,
				    	left: 15
				    });

					    eventSocialButtonEmail.add(Ti.UI.createView({
					    	top: 0,
					    	width: 36,
					    	height: 36,
					    	backgroundImage: '/img/ios/events/social_email_icon.png',
					    	backgroundRepeat: false
					    }));

					    eventSocialButtonsCont.add(eventSocialButtonEmail);
					generalInfoScrollViewCont.add(eventSocialButtonsCont);

				// Comments Cont

				var eventCommentsHeader = Ti.UI.createView({
					top: 15,
					left: 25,
					right: 25,
					height: Ti.UI.SIZE,
					layout: 'vertical'
				});

					eventCommentsHeader.add(Ti.UI.createView({
						top: 0,
						left: 0,
						width: Ti.UI.FILL,
						height: 1,
						backgroundColor: '#EFEFF3'
					}));

					var eventCommentsHeaderTitle = Ti.UI.createLabel({
						top: 15,
						left: 0,
						text: '',
						color: '#000000',
						height: Ti.UI.SIZE,
						textAlign: 'left',
						font: {
							fontFamily: 'OpenSans-Regular',
							fontSize: 15,
							fontWeight: 'normal'
						}
					});

					eventCommentsHeader.add(eventCommentsHeaderTitle);
				generalInfoScrollViewCont.add(eventCommentsHeader);

				var eventCommentsCont = Ti.UI.createView({
					top: 0,
					left: 25,
					right: 25,
					height: Ti.UI.SIZE,
					layout: 'vertical'
				});

				generalInfoScrollViewCont.add(eventCommentsCont);

				var eventCommentsShowAll = Ti.UI.createView({
					top: 15,
					left: 25,
					right: 25,
					height: Ti.UI.SIZE,
					layout: 'vertical'
				});

					var eventCommentsShowAllButton = Ti.UI.createView({
						height: 37,
						width: Ti.UI.FILL,
						left: 0,
						top: 0,
						borderRadius: 5,
						borderColor: '#007AFF',
						borderWidth: 1
					});

						var commentAllLabel = Ti.UI.createLabel({
							text: L('ui0035'),
							height: Ti.UI.SIZE,
							textAlign: 'center',
							color: '#007AFF',
							font: {
								fontFamily: 'OpenSans-Regular',
								fontSize: 15,
								fontWeight: 'normal'
							}
						});

						eventCommentsShowAllButton.add(commentAllLabel);
					eventCommentsShowAll.add(eventCommentsShowAllButton);
				generalInfoScrollViewCont.add(eventCommentsShowAll);

				var someEventFooterHeight = 0;

				if (isiPhoneX()) {
					someEventFooterHeight = 17;
				}

				generalInfoScrollViewCont.add(Ti.UI.createView({
					top: 0,
					left: 0,
					height: (75 - someEventFooterHeight),
					width: Ti.UI.FILL,
					backgroundColor: '#FAFAFA'
				}));

			generalInfoScrollView.add(generalInfoScrollViewCont);
		generalCont.add(generalInfoScrollView);

		// Event Like / Next / Hate / To Top

		var someEventFooterCont = Ti.UI.createView({
			height: (50 + someEventFooterHeight),
			width: Ti.Platform.displayCaps.platformWidth,
			zIndex: 40,
			left: 0,
			bottom: 0,
			backgroundColor: '#000000'
		});

		generalCont.add(someEventFooterCont);

		var someEventComplaintCont = Ti.UI.createView({
			height: 50,
			left: 0,
			width: '25%',
			top: 0,
			visible: true
		});

			var someEventComplaintIcon = Ti.UI.createView({
				height: 28,
				width: 28,
				backgroundImage: '/img/ios/events/complaint_icon.png',
				backgroundRepeat: false
			});

			someEventComplaintCont.add(someEventComplaintIcon);	
		someEventFooterCont.add(someEventComplaintCont);

		var someEventHateCont = Ti.UI.createView({
			height: 50,
			width: '25%',
			top: 0,
			left: '25%',
			visible: true
		});
		
			var someEventHateIcon = Ti.UI.createView({
				height: 28,
				width: 28,
				backgroundImage: '/img/ios/events/hate_icon.png',
				backgroundRepeat: false
			});
			
			someEventHateCont.add(someEventHateIcon);
		someEventFooterCont.add(someEventHateCont);

		var someEventNextCont = Ti.UI.createView({
			height: 50,
			width: '25%',
			left: '50%',
			top: 0,
			visible: true
		});

			var someEventNextIcon = Ti.UI.createView({
				height: 28,
				width: 28,
				backgroundImage: '/img/ios/events/next_icon.png',
				backgroundRepeat: false
			});
			
			someEventNextCont.add(someEventNextIcon);
		//someEventFooterCont.add(someEventNextCont);

		var someEventLikeCont = Ti.UI.createView({
			height: 50,
			width: '25%',
			top: 0,
			left: '50%',
			visible: true
		});

			var someEventLikeIcon = Ti.UI.createView({
				height: 28,
				width: 28,
				backgroundImage: '/img/ios/events/like_icon.png',
				backgroundRepeat: false
			});

			someEventLikeCont.add(someEventLikeIcon);
		someEventFooterCont.add(someEventLikeCont);

		var someEventCallCont = Ti.UI.createView({
			top: 0,
			left: '75%',
			width: '25%',
			height: 50,
			visible: true
		});

			var someEventCallIcon = Ti.UI.createView({
				height: 28,
				width: 28,
				backgroundImage: '/img/ios/events/call_icon.png',
				backgroundRepeat: false
			});

			someEventCallCont.add(someEventCallIcon);
		someEventFooterCont.add(someEventCallCont);
	self.add(generalCont);

	/**
	 * Actions
	 */

   	var eventsContChange = false;
   	var WindowError = null;
	var windowError = null;

	function nextEvent(update, liked_idd, hated_idd) {

   		eventsContChange = true;

   		topPlaceHeaderComments.setVisible(true);

		if (!someEventDefault.getVisible()) {
			Ti.API.info('DEBUG LOG: Events / Show default view');
   			someEventDefault.setVisible(true);
   		}

		// Reset footer bottons
		someEventLikeIcon.setBackgroundImage('/img/ios/events/like_icon.png');

   		// Remove old image
   		someEventCont.removeAllChildren();

   		// Reset GeneralDesk opacity
   		eventGeneralDesc.setOpacity(0);

		// Scroll back to top
   		generalInfoScrollView.scrollTo(0, 0);

   		// Reset subscribe button

   		someEventCont.dataPlaceSubscribeStatus = 0;
		someEventSubscribeButton.setBorderColor('#007AFF');
		someEventSubscribeButtonText.setColor('#007AFF');
		someEventSubscribeButtonText.setText(L('ui0198'));

		var timeout = 1500;

		if (type_event_window == 'local_geo_push' || type_event_window == 'push') {
			timeout = 0;
		}

		// Remove old images from cache
		clearOldImages();

   		setTimeout(function() {
			var httpRegister;

			httpRegister = Ti.Network.createHTTPClient({
				onload: function() {
					if (isJsonString(this.responseText)) {
						Ti.API.info('DEBUG LOG: Events / JSON success');
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
									WindowError = null;
									windowError = null;
									nextEvent(false, false, false);
								});
							}
						}
						else if (ns.tools.underscore.has(jsonResult, 'success') && (jsonResult.success.code == '726' || jsonResult.success.code == '727' || jsonResult.success.code == '732')) {
							someEventDefault.setVisible(false);
							someEventUpdateRequired.setVisible(true);
							topPlaceHeaderComments.setVisible(false);

							setTimeout(function() {
								eventsContChange = false;
							}, 500);
						}
						else {
							eventsContChange = false;
							someEventDefault.setVisible(false);
							someEventUpdateRequired.setVisible(false);

							if (liked_idd > 0) {
								ns.session.list_indicator = 1;
								Ti.App.Properties.setString('list_indicator', 1);
							}

							// TODO: что это такое понять и добавить в EventDetails если нужно
							if (group_idd && group_idd > 0 && type_event_window && type_event_window != 'normal') {
								group_idd = 0;
								ns.session.category = jsonResult.success.result.category;
								type_event_window = 'normal';
							}

							// Reset longitude and latitude if location services is disabled or if location hasn't location permissions
							if (!Ti.Geolocation.locationServicesEnabled || !Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS)) {
								Ti.API.info('DEBUG LOG: GEO LOCATION / Location Services Disabled or Location has not Location Permissions');

						    	ns.session.longitude = 0;
						    	ns.session.latitude = 0;
							}

					   		// Remove all markers from map
					   		map.removeAllAnnotations();

					   		// Similar places
					   		similar_places_tmp_arr = jsonResult.success.result.other_places;

							// Header titles
							if (trim(jsonResult.success.result.header.title_one) != '') {
								if (trim(jsonResult.success.result.header.title_three) != '') {									
									eventTypePositioning1st.setText(L('ui0171').toUpperCase() + ' ' + charToCurrencySymbol(jsonResult.success.result.header.title_one).toUpperCase());
									eventTypePositioning2nd.setText(L('ui0172').toUpperCase() + ' ' + charToCurrencySymbol(jsonResult.success.result.header.title_three).toUpperCase());
									eventTypePositioning2nd.setVisible(true);
								}
								else {
									eventTypePositioning1st.setText(L('ui0149').toUpperCase());
									eventTypePositioning2nd.setText(jsonResult.success.result.header.title_one.toUpperCase());
									eventTypePositioning2nd.setVisible(true);
								}
							}
							else if (trim(jsonResult.success.result.header.title_three) != '') {
								eventTypePositioning1st.setText(L('ui0178').toUpperCase());
								eventTypePositioning2nd.setText(charToCurrencySymbol(jsonResult.success.result.header.title_three).toUpperCase());
								eventTypePositioning2nd.setVisible(true);
							}
							else {
								eventTypePositioning1st.setText(L('ui0093').toUpperCase());
								eventTypePositioning2nd.setVisible(false);
							}

							// General title
							if (trim(jsonResult.success.result.header.title_two) != '') {
								eventGeneralDesc.setText(capitalizeFirstLetter(trim(jsonResult.success.result.header.title_two)));

								eventGeneralDesc.animate({
									opacity: 1,
									duration: 300
								});
							}

							// Count down
							eventCountDown.setText(countToDown(ns.tools.moment().toDate(), ns.tools.moment.unix(jsonResult.success.result.ts_finish).toDate()));

							// Session timer
							ns.session.timer = ns.tools.moment().unix();

							var image = Ti.Utils.base64decode(jsonResult.success.result.image);
							var someEventImg = createHeaderEventImage.RemoteImage({
								image: image.toString(),
								width: Ti.Platform.displayCaps.platformWidth,
								height: Ti.Platform.displayCaps.platformWidth,
								zIndex: 100,
								defaultImage: '/img/ios/events/some_event_img_preload.png',								
							  	ts_modification: jsonResult.success.result.image_cache
							});

								someEventImg.addEventListener('load', function() {
									someEventImg.animate({
										opacity: 1,
										duration: 200,
										curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
									});
								});

							someEventCont.add(someEventImg);

							someEventPlaceTitle.setText(trim(jsonResult.success.result.place_info.name));
					   		someEventPlaceAddress.setText(trim(jsonResult.success.result.place_info.address));

							var ts_now = ns.tools.moment().locale('en');
							var day_now = ts_now.format('ddd').toLowerCase();
							var time_now = parseInt(ts_now.format('Hmm'));
							var place_ts_start = parseInt(jsonResult.success.result.place_info.schedule[day_now + '_start']);
							var place_ts_finish = parseInt(jsonResult.success.result.place_info.schedule[day_now + '_end']);

							if (place_ts_start == 2400 && place_ts_finish == 2400) {
								someEventTimeIcon.setBackgroundImage('/img/ios/events/time_green.png');
								someEventTimeIcon.setBackgroundRepeat(false);
							    someEventTimeText.setText(capitalizeFirstLetter(L('ui0042')));
							}
							else {
							    if (checkTime(place_ts_start, place_ts_finish, time_now, false)) {
							    	if (!checkTime(place_ts_start, place_ts_finish, time_now, true)) {
							    		someEventTimeIcon.setBackgroundImage('/img/ios/events/time_orange.png');
										someEventTimeIcon.setBackgroundRepeat(false);
										someEventTimeText.setText(capitalizeFirstLetter(L('ui0064')) + ' ' + timeScheduleNormalizer(place_ts_finish));
							    	}
							    	else {
							    		someEventTimeIcon.setBackgroundImage('/img/ios/events/time_green.png');
										someEventTimeIcon.setBackgroundRepeat(false);
										someEventTimeText.setText(capitalizeFirstLetter(L('ui0064')) + ' ' + timeScheduleNormalizer(place_ts_finish));
									}
								}
								else {
									someEventTimeIcon.setBackgroundImage('/img/ios/events/time_red.png');
									someEventTimeIcon.setBackgroundRepeat(false);
									someEventTimeText.setText(capitalizeFirstLetter(L('ui0043')));
								}
							}

							// Short text

							someEventPlaceText.setText(trim(jsonResult.success.result.short_text));

							// Phone

							someEventCont.dataPlacePhone = jsonResult.success.result.place_info.phone;

							// SMM

							eventSocialCont.removeAllChildren();

							if (jsonResult.success.result.smm.status == 1) {
								var someEventSocialCont = Ti.UI.createView({
									top: 0,
									left: 0,
									width: Ti.UI.FILL,
									height: Ti.UI.SIZE,
									backgroundColor: 'RGBA(254, 90, 0, 0.15)',
									borderRadius: 5
								});

									var someEventSocialTextCont = Ti.UI.createLabel({
										top: 15,
										left: 20,
										right: 20,
										height: Ti.UI.SIZE,
										layout: 'vertical'
									});

										someEventSocialTextCont.add(Ti.UI.createLabel({
											text: L('ui0148'),
											top: 0,
											left: 0,
											color: '#000000',
											font: {
												fontFamily: 'OpenSans-Semibold',
												fontSize: 14,
												fontWeight: 'normal'
											},
											width: Ti.UI.SIZE,
											height: Ti.UI.SIZE,
											textAlign: 'left'
										}));

										someEventSocialTextCont.add(Ti.UI.createLabel({
											top: 10,
											left: 0,
											font: {
												fontFamily: 'OpenSans-Regular',
												fontSize: 14,
												fontWeight: 'normal'
											},
											color: '#5C5C5C',
											text: jsonResult.success.result.smm.text,
											width: Ti.UI.SIZE,
											height: Ti.UI.SIZE,
											textAlign: 'left',
											bottom: 15
										}));

									someEventSocialCont.add(someEventSocialTextCont);
								eventSocialCont.add(someEventSocialCont);	
							}
							else {
								var someEventSocialCont = Ti.UI.createView({
									top: 0,
									left: 0,
									width: Ti.UI.FILL,
									height: Ti.UI.SIZE,
									backgroundColor: 'rgba(0, 90, 255, 0.15)',
									borderRadius: 5
								});

									var someEventSocialTextCont = Ti.UI.createLabel({
										top: 15,
										left: 20,
										right: 20,
										height: Ti.UI.SIZE,
										layout: 'vertical'
									});

										someEventSocialTextCont.add(Ti.UI.createLabel({
											text: L('ui0200'),
											top: 0,
											left: 0,
											color: '#000000',
											font: {
												fontFamily: 'OpenSans-Semibold',
												fontSize: 14,
												fontWeight: 'normal'
											},
											width: Ti.UI.SIZE,
											height: Ti.UI.SIZE,
											textAlign: 'left'
										}));

										someEventSocialTextCont.add(Ti.UI.createLabel({
											top: 10,
											left: 0,
											font: {
												fontFamily: 'OpenSans-Regular',
												fontSize: 14,
												fontWeight: 'normal'
											},
											color: '#5C5C5C',
											text: L('ui0201'),
											width: Ti.UI.SIZE,
											height: Ti.UI.SIZE,
											textAlign: 'left',
											bottom: 15
										}));

									someEventSocialCont.add(someEventSocialTextCont);
								eventSocialCont.add(someEventSocialCont);
							}

							// Map

							map.setLocation({
								latitude: jsonResult.success.result.location[1],
								longitude: jsonResult.success.result.location[0],
								animate: true,
						    	latitudeDelta: 0.01,
						    	longitudeDelta: 0.01
						    });

						    map.addAnnotation(apple_map.createAnnotation({
							    latitude: jsonResult.success.result.location[1],
								longitude: jsonResult.success.result.location[0],
								customView: Ti.UI.createView({
							    	width: 10,
							    	height: 10,
							    	zIndex: 150,
							    	borderRadius: 5,
							    	backgroundColor: '#007AFF'
							    })  
						    }));

						    setTimeout(function() {
								mapCont.setHeight(someEventPlaceLeftCont.toImage(null, true).height);
							}, 200);

							// Extra data

							someEventCont.dataTitle = jsonResult.success.result.place_info.name;
							someEventCont.dataDesc = jsonResult.success.result.header.title_two;
							someEventCont.dataUrl = 'https://qqnder.com/g/' + jsonResult.success.result.id;
							someEventCont.dataImageUrl = image;
							someEventCont.dataEventGroupIdd = jsonResult.success.result.group_idd;
							someEventCont.dataPlaceId = jsonResult.success.result.place_info.place_id;
							someEventCont.dataPlaceLatitude = jsonResult.success.result.location[1];
							someEventCont.dataPlaceLongitude = jsonResult.success.result.location[0];
							someEventCont.dataPlaceTsStart = place_ts_start;
							someEventCont.dataPlaceTsFinish = place_ts_finish;
							someEventCont.dataPlaceSubscribeStatus = jsonResult.success.result.place_info.subscribe_status;
							
							// Set subscribed status

							if (someEventCont.dataPlaceSubscribeStatus == 1) {
								someEventSubscribeButton.setBorderColor('#ff3b30');
								someEventSubscribeButtonText.setColor('#ff3b30');
								someEventSubscribeButtonText.setText(L('ui0199'));
							}

							// Peoples who viewed or liked this event

							eventContBar.removeAllChildren();

							var countBarCont = Ti.UI.createView({
								top: 0,
								left: 0,
								width: Ti.UI.SIZE,
								height: 20,
								layout: 'horizontal'
							});

								countBarCont.add(Ti.UI.createView({
									top: 0,
									left: 0,
									width: 20,
									height: 20,
									backgroundImage: '/img/ios/events/views_icon.png',
									backgroundRepeat: false
								}));

								countBarCont.add(Ti.UI.createLabel({
									text: socialNumberBeautifier(jsonResult.success.result.views),
									left: 5,
									font: {
										fontFamily: 'OpenSans-Regular',
										fontSize: 14,
										fontWeight: 'normal'
									},
									color: '#000000',
									width: Ti.UI.SIZE,
									height: Ti.UI.SIZE,
									textAlign: 'left'
								}));

								countBarCont.add(Ti.UI.createView({
									top: 0,
									left: 10,
									width: 20,
									height: 20,
									backgroundImage: '/img/ios/events/likes_icon.png',
									backgroundRepeat: false
								}));

								countBarCont.add(Ti.UI.createLabel({
									text: socialNumberBeautifier(jsonResult.success.result.likes),
									left: 5,
									textAlign: 'left',
									color: '#000000',
									font: {
										fontFamily: 'OpenSans-Regular',
										fontSize: 14,
										fontWeight: 'normal'
									},
									width: Ti.UI.SIZE,
									height: Ti.UI.SIZE,
									textAlign: 'left'
								}));

							eventContBar.add(countBarCont);

							// Comments

							eventCommentsCont.removeAllChildren();

							eventCommentsHeaderTitle.setText(str_replace('{{value}}', jsonResult.success.result.comments.count, L('ui0147')));

							if (jsonResult.success.result.comments.items.length > 0) {
								for (var i = 0; i < jsonResult.success.result.comments.items.length; i++) {
									var comment = Ti.UI.createView({
										top: 0,
										left: 0,
										right: 0,							
										height: Ti.UI.SIZE
									});

										var avatar = Ti.Utils.base64decode(jsonResult.success.result.comments.items[i].avatar);
										var commentAvatar = createCommentAvatar.RemoteImage({
											image: avatar.toString(),
											ts_modification: jsonResult.success.result.comments.items[i].avatar_cache,
											defaultImage: '/img/ios/events/user_avatar_preload.png',
											top: 15,
											left: 0,
											width: 50,
											height: 50,
											borderRadius: 4
										});

										comment.add(commentAvatar);

										var comment_user_name = L('ui0159');

										if (trim(jsonResult.success.result.comments.items[i].name) != '') {
											comment_user_name = trim(jsonResult.success.result.comments.items[i].name);
										}

										comment.add(Ti.UI.createLabel({
											top: 20,
											left: 65,
											font: {
												fontSize: 14,
												fontFamily: 'OpenSans-Semibold',
												fontWeight: 'normal'
											},
											text: comment_user_name,
											color: '#222222',
											height: 14
										}));

										comment.add(Ti.UI.createLabel({
											top: 40,
											left: 65,
											font: {
												fontFamily: 'OpenSans-Regular',
												fontSize: 12,
												fontWeight: 'normal'
											},
											color: '#444444',
											text: ns.tools.moment.unix(jsonResult.success.result.comments.items[i].ts_registration).fromNow()
										}));

										comment.add(Ti.UI.createLabel({
											top: 80,
											left: 0,
											textAlign: 'left',
											font: {
												fontFamily: 'OpenSans-Regular',
												fontSize: 14,
												fontWeight: 'normal'
											},
											color: '#222222',
											text: jsonResult.success.result.comments.items[i].text
										}));
										
									eventCommentsCont.add(comment);
								}
							}
							else {
								var comment = Ti.UI.createView({
									top: 0,
									left: 0,
									right: 0,
									height: Ti.UI.SIZE
								});

									comment.add(Ti.UI.createImageView({
										image: '/img/ios/events/user.png',
									  	defaultImage: '/img/ios/events/user_avatar_preload.png',
										top: 15,
										left: 0,
										width: 50,
										height: 50,
										borderRadius: 4
									}));

									comment.add(Ti.UI.createLabel({
										top: 20,
										left: 65,
										height: 14,
										font: {
											fontFamily: 'OpenSans-Semibold',
											fontSize: 14,
											fontWeight: 'normal'
										},
										color: '#222222',
										text: L('ui0033')
									}));

									comment.add(Ti.UI.createLabel({
										top: 40,
										left: 65,
										font: {
											fontFamily: 'OpenSans-Regular',
											fontSize: 12,
											fontWeight: 'normal'
										},
										color: '#444444',
										text: L('ui0034')
									}));

									comment.add(Ti.UI.createLabel({
										top: 80,
										left: 0,
										textAlign: 'left',
										font: {
											fontFamily: 'OpenSans-Regular',
											fontSize: 14,
											fontWeight: 'normal'
										},
										color: '#222222',
										text: L('ui0156')
									}));

								eventCommentsCont.add(comment);
							}
						}
					}
					else {
						Ti.API.info('DEBUG LOG: Events / JSON ERROR');

						WindowError = require('ui/ErrorWindow');
						windowError = new WindowError(L('ui0010'), L('x0014'));
						windowError.open();

						windowError.addEventListener('close_extra', function() {
							if (windowError != null) {
								WindowError = null;
								windowError = null;
								nextEvent(false, false, false);
							}
						});
					}
				},
				onerror: function() {
					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0011'));
					windowError.open();
	
					windowError.addEventListener('close_extra', function(e) {
						WindowError = null;
						windowError = null;
						nextEvent(false, false, false);
					});
				},
				timeout: 15000
			});

			/**
			 * Platform
			 */

			var platform_osname = '';
			var platform_ostype = '';
			var platform_model = '';		
			var platform_locale = '';
			var platform_manufacturer = '';	
			var platform_processor_count = 1;
			var platform_username = '';
			var platform_version = '';

			if (Ti.Platform.osname) {
				platform_osname = Ti.Platform.osname;
			}

			if (Ti.Platform.ostype) {
				platform_ostype = Ti.Platform.ostype;
			}

			if (Ti.Platform.model) {
				platform_model = Ti.Platform.model;
			}
	
			if (Ti.Platform.locale) {
				platform_locale = Ti.Platform.locale;
			}
	
			if (Ti.Platform.manufacturer) {
				platform_manufacturer = Ti.Platform.manufacturer;
			}
	
			if (Ti.Platform.processorCount) {
				platform_processor_count = parseInt(Ti.Platform.processorCount);
			}
	
			if (Ti.Platform.username) {
				platform_username = Ti.Platform.username;
			}		
	
			if (Ti.Platform.version) {
				platform_version = Ti.Platform.version;
			}
	
			if (group_idd > 0 && type_event_window == 'push') {
				var nextEventUrl = 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=event_by_group_idd' +
		                   '&uuid=' + Ti.Platform.id + 
						   '&token=' + ns.session.token +
						   '&group_idd=' + group_idd +
						   '&lng=' + ns.session.longitude +
						   '&lat=' + ns.session.latitude +
						   '&hour=' + ns.tools.moment().format('H') +
						   '&minute=' + ns.tools.moment().format('m') +
						   '&day_of_week=' + ns.tools.moment().format('E') +
						   '&screen_type=' + Ti.Platform.displayCaps.dpi +
						   '&from=push' +

						   //platform details
						   '&platform_osname=' + platform_osname +
						   '&platform_ostype=' + platform_ostype +
						   '&platform_model=' + platform_model +
						   '&platform_locale=' + platform_locale +
						   '&platform_manufacturer=' + platform_manufacturer +
						   '&platform_processor_count=' + platform_processor_count +
						   '&platform_username=' + platform_username +
						   '&platform_version=' + platform_version;
			}
			else if (group_idd > 0 && type_event_window == 'local_geo_push') {
				var nextEventUrl = 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=event_by_group_idd' +
		                   '&uuid=' + Ti.Platform.id + 
						   '&token=' + ns.session.token +
						   '&group_idd=' + group_idd +
						   '&lng=' + ns.session.longitude +
						   '&lat=' + ns.session.latitude +
						   '&hour=' + ns.tools.moment().format('H') +
						   '&minute=' + ns.tools.moment().format('m') +
						   '&day_of_week=' + ns.tools.moment().format('E') +
						   '&screen_type=' + Ti.Platform.displayCaps.dpi +
						   '&from=local_geo_push' +
	
						   //platform details
						   '&platform_osname=' + platform_osname +
						   '&platform_ostype=' + platform_ostype +
						   '&platform_model=' + platform_model +
						   '&platform_locale=' + platform_locale +
						   '&platform_manufacturer=' + platform_manufacturer +
						   '&platform_processor_count=' + platform_processor_count +
						   '&platform_username=' + platform_username +
						   '&platform_version=' + platform_version;
			}
			else {
				var nextEventUrl = 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=events' +
				                   '&uuid=' + Ti.Platform.id + 
								   '&token=' + ns.session.token +
								   '&category=' + ns.session.category +
								   '&lng=' + ns.session.longitude +
								   '&lat=' + ns.session.latitude +
								   '&hour=' + ns.tools.moment().format('H') +
								   '&minute=' + ns.tools.moment().format('m') +
								   '&day_of_week=' + ns.tools.moment().format('E') +
								   '&screen_type=' + Ti.Platform.displayCaps.dpi +

		  						   //platform details
								   '&platform_osname=' + platform_osname +
								   '&platform_ostype=' + platform_ostype +
								   '&platform_model=' + platform_model +
								   '&platform_locale=' + platform_locale +
								   '&platform_manufacturer=' + platform_manufacturer +
								   '&platform_processor_count=' + platform_processor_count +
								   '&platform_username=' + platform_username +
								   '&platform_version=' + platform_version;

				if (update == true) {
					nextEventUrl += '&update=true';
				}
			}

			if (liked_idd != false && liked_idd > 0) {
				nextEventUrl += '&liked_idd=' + liked_idd +'&timer=' + (ns.tools.moment().unix() - ns.session.timer) + '&country=' + Ti.Locale.currentCountry.toLowerCase();
			}
			else if (hated_idd != false && hated_idd > 0) {
				nextEventUrl += '&hated_idd=' + hated_idd +'&timer=' + (ns.tools.moment().unix() - ns.session.timer) + '&country=' + Ti.Locale.currentCountry.toLowerCase();
			}

		    httpRegister.open('GET', nextEventUrl);   						 
		    httpRegister.send();
		}, timeout);
   	};

    function likeIt(liked_idd) {
    	if (canRate(ns.session.rate_me_counter)) {
    		new rate(ns.app.id).open();
    	}

		nextEvent(false, liked_idd, false);
   	};

    function hateIt(hated_idd) {
		nextEvent(false, false, hated_idd);
   	};

	// Social menu

		// Vk

		/*
		function vk_login(e) {
			if (e.success) {
				vkontakte.makeAPICall('wall.post', {
					message: someEventCont.dataTitle + ' — ' + someEventCont.dataDesc,
					attachments: someEventCont.dataUrl
				});
		   	}
		   	else {
		   		spinnerCont.setVisible(false);
		   		eventsContChange = false;
		   	}
		};

		function vk_result(e) {
			Ti.API.info('RESULT');
			Ti.API.info(e);

			if (e.result.hasOwnProperty('post_id')) {
				Ti.API.info('DEBUG LOG: VK / Wall make post');

				spinnerCont.setVisible(false);
				eventsContChange = false;

				hideScreenGeneralText.setValue(L('ui0168'));
				hideScreenCont.setVisible(true);

				setTimeout(function() {
					hideScreenCont.setVisible(false);
				}, 3000);

				if (checkConnection()) {
					socialShareRequest('vk', parseInt(someEventCont.dataEventGroupIdd));
				}
			}
			else {
				Ti.API.info('DEBUG LOG: VK / Unknown result');

				spinnerCont.setVisible(false);

				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0014'));
				windowError.open();

				windowError.addEventListener('close_extra', function() {
					eventsContChange = false;
					WindowError = null;
					windowError = null;
				});
			}
		};

		function vk_error(e) {
			Ti.API.info('DEBUG LOG: VK / Error');
			Ti.API.info(e);

			spinnerCont.setVisible(false);
			
			WindowError = require('ui/ErrorWindow');
			windowError = new WindowError(L('ui0010'), L('x0014'));
			windowError.open();				
			
			windowError.addEventListener('close_extra', function() {
				eventsContChange = false;
				WindowError = null;
				windowError = null;
			});
		};

		vkontakte.removeEventListener('login', vk_login);
		vkontakte.addEventListener('login', vk_login);

		eventSocialButtonVk.addEventListener('singletap', function() {
			if (eventsContChange === false) {
				eventsContChange = true;

				if (!checkConnection()) {
					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0010'));
					windowError.open();
		
					windowError.addEventListener('close_extra', function() {
						WindowError = null;
						windowError = null;
						eventsContChange = false;
					});
				}
				else {

					// Spinner animation
					spinnerCont.setVisible(true);

					Ti.API.info('DEBUG LOG: VK / Wall post with attachments');

					var makaAPIStatus = vkontakte.makeAPICall('wall.post', {
						message: someEventCont.dataTitle + ' — ' + someEventCont.dataDesc,
						attachments: someEventCont.dataUrl
					});

					if (makaAPIStatus == null) {
						vkontakte.authorize();
					}
			    }
			}
		});

		vkontakte.removeEventListener('result', vk_result);
		vkontakte.removeEventListener('error', vk_error);
		vkontakte.addEventListener('result', vk_result);
		vkontakte.addEventListener('error', vk_error);
		*/

		// Facebook

		function fb_publish() {
			Ti.API.info('DEBUG LOG: SocialShare / Facebook / Present Share Dialog');

			fb.presentShareDialog({
		        link: someEventCont.dataUrl,
	            title: someEventCont.dataTitle,
	            description: someEventCont.dataDesc,
	            picture: someEventCont.dataImageUrl.toString()
		    });
		};

		fb.addEventListener('login', function(e) {
			Ti.API.info('DEBUG LOG: SocialShare / Facebook / Login event');

		    if (e.success) {
		    	fb_publish();
		    }
		});

		eventSocialButtonFacebook.addEventListener('singletap', function() {
			Ti.API.info('DEBUG LOG: SocialShare / Facebook / Share menu singletap');

			if (eventsContChange === false) {
				eventsContChange = true;

				if (!checkConnection()) {
					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0010'));
					windowError.open();

					windowError.addEventListener('close_extra', function() {
						WindowError = null;
						windowError = null;
						eventsContChange = false;
					});
				}
				else {
					socialShareRequest('facebook', parseInt(someEventCont.dataEventGroupIdd));

					if (!fb.getLoggedIn()) {
						Ti.API.info('DEBUG LOG: SocialShare / Facebook / Autorize');
						eventsContChange = false;
						fb.authorize();
					}
					else {
						eventsContChange = false;
						fb_publish();
					}
				}
			}
		});

		// Twitter

		eventSocialButtonTwitter.addEventListener('singletap', function() {
			if (eventsContChange == false) {
				eventsContChange = true;

				if (!checkConnection()) {
					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0010'));
					windowError.open();
		
					windowError.addEventListener('close_extra', function() {
						WindowError = null;
						windowError = null;
						eventsContChange = false;
					});
				}
				else if (Ti.Platform.canOpenURL('twitter://post?message=Is support')) {
					Ti.API.info('DEBUG LOG: SocialShare / Twitter / Twitter is supported');
					social.twitter({
						text: someEventCont.dataDesc + ' ' + someEventCont.dataUrl
					});
					socialShareRequest('twitter', parseInt(someEventCont.dataEventGroupIdd));
					eventsContChange = false;
				}
				else {
					Ti.API.info('DEBUG LOG: SocialShare / Twitter / Twitter isn\'t supported');

					hideScreenGeneralText.setValue(L('ui0182'));
					hideScreenCont.setVisible(true);

					setTimeout(function() {
						hideScreenCont.setVisible(false);
					}, 3000);

					eventsContChange = false;
				}
			}
		});

		// Whatsapp

		eventSocialButtonWhatsapp.addEventListener('singletap', function() {
			if (eventsContChange == false) {
				eventsContChange = true;

				if (!checkConnection()) {
					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0010'));
					windowError.open();
		
					windowError.addEventListener('close_extra', function() {
						WindowError = null;
						windowError = null;
						eventsContChange = false;
					});
				}
				else if (Ti.Platform.canOpenURL('whatsapp://send?text=Is support')) {
					Ti.API.info('DEBUG LOG: Whatsapp / Whatsapp is supported');
					Ti.Platform.openURL('whatsapp://send?text=' + someEventCont.dataDesc + ' ' + someEventCont.dataUrl);
					socialShareRequest('whatsapp', parseInt(someEventCont.dataEventGroupIdd));
			        eventsContChange = false;
				}
				else {
					Ti.API.info('DEBUG LOG: Whatsapp / Whatsapp isn\'t supported');
					
					hideScreenGeneralText.setValue(L('ui0144'));
					hideScreenCont.setVisible(true);

					setTimeout(function() {
						hideScreenCont.setVisible(false);
					}, 3000);
					
					eventsContChange = false;
				}
			}
		});

		// E-mail

		eventSocialButtonEmail.addEventListener('singletap', function() {
			var emailDialog = Ti.UI.createEmailDialog({
				subject: 'QQnder — ' + someEventCont.dataDesc,
				messageBody: someEventCont.dataDesc + ' ' + someEventCont.dataUrl
			});
			emailDialog.open();

			socialShareRequest('email', parseInt(someEventCont.dataEventGroupIdd));
		});

		// Call to event

		someEventCallCont.addEventListener('singletap', function() {
			if (eventsContChange === false) {
				eventsContChange = true;
				
				Ti.Platform.openURL('tel:+' + parseInt(someEventCont.dataPlacePhone.replace(/\D+/g, '')));
				
				setTimeout(function() {
					eventsContChange = false;

					if (checkConnection()) {
						phoneCallRequest(parseInt(someEventCont.dataPlacePhone.replace(/\D+/g, '')), parseInt(someEventCont.dataEventGroupIdd));
					}
				}, 300);
			}
		});

	// Show all comments

	var WindowComments = null;
	var windowComments = null;

	eventCommentsShowAll.addEventListener('singletap', function() {
		if (eventsContChange === false) {
			eventsContChange = true;

			if (!checkConnection()) {
				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();
	
				windowError.addEventListener('close_extra', function() {
					WindowError = null;
					windowError = null;
					eventsContChange = false;
				});
			}
			else {
				spinnerCont.setVisible(true);
		
				WindowComments = require('ui/CommentsWindow');
				windowComments = new WindowComments(someEventCont.dataEventGroupIdd);
				windowComments.open();
	
				windowComments.addEventListener('close_extra', function() {
					WindowComments = null;
					windowComments = null;
					eventsContChange = false;
					spinnerCont.setVisible(false);
					generalInfoScrollView.scrollTo(0, 0);
				});
			}
		}
	});

	topPlaceHeaderComments.addEventListener('singletap', function() {
		eventCommentsShowAll.fireEvent('singletap');	
	});

	eventCommentsCont.addEventListener('singletap', function() {
		eventCommentsShowAll.fireEvent('singletap');	
	});

	// Feedback

	someEventComplaintCont.addEventListener('singletap', function() {
		if (eventsContChange === false) {
			eventsContChange = true;

			setTimeout(function() {
				if (!checkConnection()) {
					WindowError = require('ui/ErrorWindow');
					windowError = new WindowError(L('ui0010'), L('x0010'));
					windowError.open();
	
					windowError.addEventListener('close_extra', function() {
						WindowError = null;
						windowError = null;
						eventsContChange = false;
					});
				}
				else {
					feedback.setVisible(true);
					eventsContChange = false;
				}
			}, 300);
		}
	});

	feedback.addEventListener('singletap', function(e) {
		if (e.source.preventDefault != true) {
			feedback.setVisible(false);
		}
	});

	feedbackPlaceEventCloseCont.addEventListener('singletap', function() {
		if (eventsContChange === false) {
			eventsContChange = true;

			if (!checkConnection()) {
				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();

				windowError.addEventListener('close_extra', function() {
					WindowError = null;
					windowError = null;
					eventsContChange = false;
				});
			}
			else {
				feedbackRequest(1, parseInt(someEventCont.dataEventGroupIdd));
				feedback.setVisible(false);
				hideScreenGeneralText.setValue(L('ui0161'));
				hideScreenCont.setVisible(true);
				setTimeout(function() {
					hideScreenCont.setVisible(false);
					eventsContChange = false;
				}, 3000);
			}
		}
	});

	feedbackPlaceCloseCont.addEventListener('singletap', function() {
		if (eventsContChange === false) {
			eventsContChange = true;
			
			if (!checkConnection()) {
				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();
	
				windowError.addEventListener('close_extra', function() {
					WindowError = null;
					windowError = null;
					eventsContChange = false;
				});
			}
			else {
				feedbackRequest(2, parseInt(someEventCont.dataEventGroupIdd));
				feedback.setVisible(false);
				hideScreenGeneralText.setValue(L('ui0161'));
				hideScreenCont.setVisible(true);
				setTimeout(function() {
					hideScreenCont.setVisible(false);
					eventsContChange = false;
				}, 3000);
			}
		}
	});

	feedbackPlaceChangePhoneCont.addEventListener('singletap', function() {
		if (eventsContChange === false) {
			eventsContChange = true;

			if (!checkConnection()) {
				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0010'));
				windowError.open();
	
				windowError.addEventListener('close_extra', function() {
					WindowError = null;
					windowError = null;
					eventsContChange = false;
				});
			}
			else {
				feedbackRequest(3, parseInt(someEventCont.dataEventGroupIdd));
				feedback.setVisible(false);
				hideScreenGeneralText.setValue(L('ui0161'));
				hideScreenCont.setVisible(true);
				setTimeout(function() {
					hideScreenCont.setVisible(false);
					eventsContChange = false;
				}, 3000);
			}
		}
	});

	// Update Required

	someEventUpdateRequiredButton.addEventListener('touchstart', function() {
		someEventUpdateRequiredButton.setBackgroundColor('#005AFF');
	});

	someEventUpdateRequiredButton.addEventListener('touchend', function() {
		someEventUpdateRequiredButton.setBackgroundColor('#007AFF');
	});

	someEventUpdateRequiredButton.addEventListener('singletap', function() {
		if (eventsContChange === false) {
			nextEvent(true, false, false);
		}
	});

    // Map viewer

	var WindowMap = null;
	var windowMap = null;

	mapFront.addEventListener('singletap', function() {
		if (eventsContChange === false) {
			eventsContChange = true;

			// Spinner animation
			spinnerCont.setVisible(true);

			WindowMap = require('ui/MapWindow');
			windowMap = new WindowMap(someEventCont.dataPlaceLatitude, someEventCont.dataPlaceLongitude, parseInt(someEventCont.dataEventGroupIdd), similar_places_tmp_arr);
			windowMap.open();

			windowMap.addEventListener('close_extra', function() {
				WindowMap = null;
				windowMap = null;
				eventsContChange = false;
				spinnerCont.setVisible(false);
			});
		}
	});

	// Event place address

	someEventPlaceAddress.addEventListener('singletap', function() {
		mapFront.fireEvent('singletap');
	});

	// Event place title

	someEventPlaceTitle.addEventListener('singletap', function() {
		mapFront.fireEvent('singletap');
	});

	// Event place address

	someEventPlaceAddress.addEventListener('singletap', function() {
		mapFront.fireEvent('singletap');
	});

	// Event place under address

	someEventExtraUnderAddressCont.addEventListener('singletap', function() {
		mapFront.fireEvent('singletap');
	});

	// Hate

	someEventHateCont.addEventListener('singletap', function() {
    	if (eventsContChange === false) {
    		eventsContChange = true;
    		setTimeout(function() {
				hateIt(parseInt(someEventCont.dataEventGroupIdd));
			}, 300);
		}
    });

    // Next

    someEventNextCont.addEventListener('singletap', function() {
    	if (eventsContChange === false) {
    		eventsContChange = true;
    		setTimeout(function() {
    			nextEvent(false, false, false);
    		}, 300);
    	}
    });

    // Like

    someEventLikeCont.addEventListener('touchstart', function() {
		someEventLikeIcon.setBackgroundImage('/img/ios/events/like_icon_active.png');
	});

    someEventLikeCont.addEventListener('singletap', function() {
    	if (eventsContChange === false) {
    		eventsContChange = true;
    		setTimeout(function() {
    			likeIt(parseInt(someEventCont.dataEventGroupIdd));
    		}, 300);
    	}
    });

    // Subscribe

	someEventSubscribeButton.addEventListener('singletap', function() {
		if (eventsContChange === false) {
    		eventsContChange = true;
    		Ti.API.info('DEBUG LOG: EVENTS / Single tap [Place Subscribe/Unsubscribe]');

			if (someEventCont.dataPlaceSubscribeStatus == 0) {
				Ti.API.info('DEBUG LOG: EVENTS / Single tap [Place subscribe]');

				someEventCont.dataPlaceSubscribeStatus = 1;
				someEventSubscribeButton.setBorderColor('#ff3b30');
				someEventSubscribeButtonText.setColor('#ff3b30');
				someEventSubscribeButtonText.setText(L('ui0199'));

				var httpRegister;

				httpRegister = Ti.Network.createHTTPClient({
					validatesSecureCertificate: true,
					onload: function() {
						Ti.API.info('DEBUG LOG: EVENTS / Subscribe http onload');

						if (isJsonString(this.responseText)) {
							Ti.API.info('DEBUG LOG: EVENTS / Subscribe JSON is valid');

							var jsonResult = JSON.parse(this.responseText);

							if (ns.tools.underscore.has(jsonResult, 'error')) {
								Ti.API.error('DEBUG LOG: EVENTS / Subscribe JSON error');

								someEventCont.dataPlaceSubscribeStatus = 0;
								someEventSubscribeButton.setBorderColor('#007AFF');
								someEventSubscribeButtonText.setColor('#007AFF');
								someEventSubscribeButtonText.setText(L('ui0198'));

								if (jsonResult.error.code == '710') {
									Ti.App.fireEvent('app:auth_window');
								}
								else {
									Ti.API.info('DEBUG LOG: EVENTS / Subscribe some error');
									eventsContChange = false;
								}
							}
							else {
								Ti.API.info('DEBUG LOG: EVENTS / Subscribe JSON success');
								eventsContChange = false;
							}
						}
						else {
							Ti.API.info('DEBUG LOG: EVENTS / Subscribe JSON is invalid');
							eventsContChange = false;

							someEventCont.dataPlaceSubscribeStatus = 0;
							someEventSubscribeButton.setBorderColor('#007AFF');
							someEventSubscribeButtonText.setColor('#007AFF');
							someEventSubscribeButtonText.setText(L('ui0198'));
						}
					},
					onerror: function() {
						Ti.API.info('DEBUG LOG: EVENTS / Subscribe timeout error');

						someEventCont.dataPlaceSubscribeStatus = 0;
						someEventSubscribeButton.setBorderColor('#007AFF');
						someEventSubscribeButtonText.setColor('#007AFF');
						someEventSubscribeButtonText.setText(L('ui0198'));

						WindowError = require('ui/ErrorWindow');
						windowError = new WindowError(L('ui0010'), L('x0011'));
						windowError.open();

						windowError.addEventListener('close_extra', function() {
							if (windowError != null) {
								eventsContChange = false;
								WindowError = null;
								windowError = null;
							}
						});	
					},
					timeout: 15000
				});

			    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=subscribe_to_place&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&place_id=' + someEventCont.dataPlaceId);			    
			    httpRegister.send();
			}
			else {
				Ti.API.info('DEBUG LOG: EVENTS / Single tap [Place Unsubscribe]');

				someEventCont.dataPlaceSubscribeStatus = 0;
				someEventSubscribeButton.setBorderColor('#007AFF');
				someEventSubscribeButtonText.setColor('#007AFF');
				someEventSubscribeButtonText.setText(L('ui0198'));

				var httpRegister;

				httpRegister = Ti.Network.createHTTPClient({
					validatesSecureCertificate: true,
					onload: function() {
						if (isJsonString(this.responseText)) {
							var jsonResult = JSON.parse(this.responseText);

							if (ns.tools.underscore.has(jsonResult, 'error')) {
								Ti.API.info('DEBUG LOG: EVENTS / Unsubscribe error code ' + jsonResult.error.code);

								someEventCont.dataPlaceSubscribeStatus = 1;
								someEventSubscribeButton.setBorderColor('#ff3b30');
								someEventSubscribeButtonText.setColor('#ff3b30');
								someEventSubscribeButtonText.setText(L('ui0199'));

								if (jsonResult.error.code == '710') {
									Ti.App.fireEvent('app:auth_window');
								}
								else {
									Ti.API.info('DEBUG LOG: EVENTS / Unsubscribe JSON success');
									eventsContChange = false;	
								}
							}
							else {
								Ti.API.info('DEBUG LOG: EVENTS / Unsubscribe success');
								eventsContChange = false;		
							}
						}
						else {
							someEventCont.dataPlaceSubscribeStatus = 1;
							someEventSubscribeButton.setBorderColor('#ff3b30');
							someEventSubscribeButtonText.setColor('#ff3b30');
							someEventSubscribeButtonText.setText(L('ui0199'));
							
							WindowError = require('ui/ErrorWindow');
							windowError = new WindowError(L('ui0010'), L('x0014'));
							windowError.open();

							windowError.addEventListener('close_extra', function() {
								if (windowError != null) {
									eventsContChange = false;
									WindowError = null;
									windowError = null;
								}
							});
						}
					},
					onerror: function() {
						Ti.API.info('DEBUG LOG: EVENTS / Unsubscribe Timeout error');

						someEventCont.dataPlaceSubscribeStatus = 1;
						someEventSubscribeButton.setBorderColor('#ff3b30');
						someEventSubscribeButtonText.setColor('#ff3b30');
						someEventSubscribeButtonText.setText(L('ui0199'));

						WindowError = require('ui/ErrorWindow');
						windowError = new WindowError(L('ui0010'), L('x0011'));
						windowError.open();

						windowError.addEventListener('close_extra', function() {
							if (windowError != null) {
								eventsContChange = false;
								WindowError = null;
								windowError = null;
							}
						});
					},
					timeout: 15000
				});

			    httpRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=unsubscribe_from_place&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&place_id=' + someEventCont.dataPlaceId);			    
			    httpRegister.send();
			}
    	}
    });

	// Open app

	self.addEventListener('open', function() {
		Ti.API.info('DEBUG LOG: EVENTS / Open');
		spinnerCont.setVisible(false);

		if (ns.session.push_last_group_idd > 0) {
			Ti.API.info('DEBUG LOG: Open / Load event by idd');
		}
		else {
			Ti.API.info('DEBUG LOG: Open / Load random event');
			nextEvent(false, false, false);
		}
	});

	// Any tap

	self.addEventListener('singletap', function(e) {
		if (e.source.preventDefault != true) {
			Ti.API.info('DEBUG LOG: EVENTS / Prevent default singletap');
		}
	});

	// Back to prev window

	topPlaceHeaderLeft.addEventListener('singletap', function() {
		if (eventsContChange === false) {
			eventsContChange = true;

	    	self.fireEvent('close_extra');
	    	self.close();
		}
	});

	// Close window

	self.addEventListener('close', function() {
		if (windowError != null) {
			windowError.close();
		}

		if (windowMap != null) {
			windowMap.close();
		}

		if (windowComments != null) {
			windowComments.close();
		}
	});

	return self;
}

module.exports = EventsWindow;