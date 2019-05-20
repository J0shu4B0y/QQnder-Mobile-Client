function CommentWindow(eventGroupIdd) {

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
				Ti.API.info('DEBUG LOG: Comments / Avatar needs to save');

				a.image = a.image + '?cache=' + new Date().getTime();
				var image = Ti.UI.createImageView(a);

				image.addEventListener('load', function() {
					Ti.API.info('DEBUG LOG: Comments / Save user comment avatar');

					if (savedFile.write(image.toImage(null, true)) === false) {
						Ti.API.info('DEBUG LOG: Comments / Save user commment avatar / Write error');
					}
				});

				image.addEventListener('error', function(e) {
					// If file not found
					if (e.code == 1) {
						Ti.API.info('DEBUG LOG: Comments / Use default user comment avatar');
						image.setImage(a.data_user_avatar_default);
					}
					else {
						setTimeout(function() {
							Ti.API.info('DEBUG LOG: Comments / Re-load user comment avatar');
							image.setImage(a.image);
						}, 15000);
					}
				});
			}
			else {
				Ti.API.info('DEBUG LOG: Comments / User comment avatar not needs to save');
				var image = Ti.UI.createImageView(a);
			}

			return image;
		}
	};

	/**
	 * Comments
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

		var topCommentsHeaderCont = Ti.UI.createView({
			height: (headerTop + 44),
			width: Ti.Platform.displayCaps.platformWidth,
			top: 0,
			left: 0,
			zIndex: 40
		});

			topCommentsHeaderCont.add(Ti.UI.createView({
				height: 1,
				width: Ti.Platform.displayCaps.platformWidth,
				bottom: 0,
				left: 0,
				backgroundColor:'#CDCED2'
			}));

			var topCommentsHeaderCenter = Ti.UI.createView({
				right: 54,
				left: 54,
				height: 44,
				bottom: 0
			});

				topCommentsHeaderCenter.add(Ti.UI.createLabel({
					text: L('ui0158'),
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					height: Ti.UI.SIZE,
					color: '#000000',
					textAlign: 'center'
				}));

			var topCommentsHeaderLeft = Ti.UI.createView({
				left: 0,
				height: 44,
				width: 54,
				bottom: 0,
				zIndex: 10
			});

				topCommentsHeaderLeft.add(Ti.UI.createView({
					backgroundImage: '/img/ios/comments/left_slider.png',
					backgroundRepeat: false,
					height: 22,
					width: 22
				}));

			topCommentsHeaderCont.add(topCommentsHeaderCenter);
			topCommentsHeaderCont.add(topCommentsHeaderLeft);
		self.add(topCommentsHeaderCont);

	// Add button cont

	var commentsAddCont = Ti.UI.createView({
		right: 25,
		width: 70,
		height: 70,
		bottom: 25,
		zIndex: 40,
		visible: true,
		borderRadius: 35,
		backgroundColor: '#007AFF'
	});

		commentsAddCont.add(Ti.UI.createView({
			backgroundImage: '/img/ios/comments/add_icon.png',
			backgroundRepeat: false,
			height: 28,
			width: 28
		}));

	self.add(commentsAddCont);

	// Empty screen

	var commentsUpdateRequired = Ti.UI.createView({
		top: headerTop,
		left: 0,
		width: Ti.Platform.displayCaps.platformWidth,
		height: Ti.UI.FILL,
		zIndex: 30,
		visible: false,
		backgroundColor: '#FAFAFA'
	});

		var commentsUpdateRequiredCont = Ti.UI.createView({
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.SIZE,
			layout: 'vertical'
		});

			commentsUpdateRequiredCont.add(Ti.UI.createView({
				top: 0,
				width: 100,
				height: 100,
				backgroundImage: '/img/ios/comments/notfound_icon.png',
				backgroundRepeat: false
			}));

			commentsUpdateRequiredCont.add(Ti.UI.createLabel({
				top: 5,
				text: L('ui0162'),
				font: {
					fontFamily: 'OpenSans-Bold',
					fontSize: 24,
					fontWeight: 'normal'
				},
				color: '#000000',
				textAlign: 'center'
			}));

			commentsUpdateRequiredCont.add(Ti.UI.createLabel({
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

		commentsUpdateRequired.add(commentsUpdateRequiredCont);
	self.add(commentsUpdateRequired);

	// Comments

	var commentsData = [];
	var commentsScrollView = Ti.UI.createTableView({
		top: (headerTop + 44),
		left: 0,
		data: commentsData,
		width: Ti.Platform.displayCaps.platformWidth,
		height: Ti.UI.FILL,
		horizontalWrap: false,
		separatorColor: '#FAFAFA',
	    separatorStyle: Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
	   	allowsSelection: false,
	    backgroundColor: '#FAFAFA',
	    showVerticalScrollIndicator: false,
	    showHorizontalScrollIndicator: false
	});

	self.add(commentsScrollView);

	var commentsContChange = false;

	/**
	 * Actions
	 */

	var incLoadingVal = parseInt(30 * Ti.Platform.displayCaps.platformWidth / 100);
    var incLoadingTime = null;
    var page_number = 1;
	var updating = false;
	var WindowError = null;
	var windowError = null;
	var WindowCommentAdd = null;
	var windowCommentAdd = null;

	// Scroll

	function beginUpdate(fast) {
        if (fast == true) {
        	page_number = 1;
			commentsData = [];
			endUpdate();
		}
		else {
			updating = true;
			commentsContChange = true;	
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

		var httpCommentsRegister;

		httpCommentsRegister = Ti.Network.createHTTPClient({
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

					if (jsonResult.success.code == '800') {
						if (jsonResult.success.result.comments.items.length > 0) {
							commentsUpdateRequired.setVisible(false);

							for (var i = 0; i < jsonResult.success.result.comments.items.length; i++) {
								if (page_number == 1 && i == 0) {
									commentsData.push(Ti.UI.createTableViewRow({
										width: Ti.Platform.displayCaps.platformWidth,
									    height: 15,
									    touchEnabled: false,
									    backgroundColor: '#FAFAFA',
										selectedBackgroundColor: 'transparent'
									}));
								}
								else if (page_number >= 1 && i != 0) {
									var comment = Ti.UI.createTableViewRow({
										width: Ti.Platform.displayCaps.platformWidth,
									    height: 16,
									    touchEnabled: false,
									    backgroundColor: 'transparent',
										selectedBackgroundColor: 'transparent'
									});

										comment.add(Ti.UI.createView({
											top: 15,
											bottom: 15,
											height: 1,
											left: 25,
											right: 25,
											backgroundColor: '#EFEFF3'
										}));

									commentsData.push(comment);
								}
								else if (page_number > 1 && i == 0) {
									commentsData.splice(-1, 1);

									var comment = Ti.UI.createTableViewRow({
									    width: Ti.Platform.displayCaps.platformWidth,
									    height: 16,
									    touchEnabled: false,
									    backgroundColor: 'transparent',
										selectedBackgroundColor: 'transparent'
									});

										comment.add(Ti.UI.createView({
											top: 15,
											left: 25,
											right: 25,
											height: 1,
											bottom: 15,
											backgroundColor: '#EFEFF3'
										}));

									commentsData.push(comment);
								}

								var comment = Ti.UI.createTableViewRow({
								    width: Ti.Platform.displayCaps.platformWidth,
								    height: Ti.UI.SIZE,
									touchEnabled: false,
									backgroundColor: '#FAFAFA',
									selectedBackgroundColor: 'transparent'
								});

									var commentCont = Ti.UI.createView({
										top: 0,
										left: 25,
										right: 25,
										height: Ti.UI.SIZE
									});

										var avatar = Ti.Utils.base64decode(jsonResult.success.result.comments.items[i].avatar);

										var commentAvatar = createCommentAvatar.RemoteImage({
											top: 15,
											left: 0,
											width: 50,
											image: avatar.toString(),
											height: 50,
											borderRadius: 5,
											defaultImage: '/img/ios/comments/user_avatar_preload.png',
											ts_modification: jsonResult.success.result.comments.items[i].avatar_cache
										});

									commentCont.add(commentAvatar);

									if (!jsonResult.success.result.comments.items[i].name || trim(jsonResult.success.result.comments.items[i].name) == '') {
										jsonResult.success.result.comments.items[i].name = L('ui0159');
									}

									commentCont.add(Ti.UI.createLabel({
										top: 20,
										left: 65,
										font: {
											fontFamily: 'OpenSans-Semibold',
											fontSize: 14,
											fontWeight: 'normal'
										},
										text: jsonResult.success.result.comments.items[i].name,
										color: '#222222',
										height: 14
									}));

									commentCont.add(Ti.UI.createLabel({
										top: 40,
										left: 65,
										font: {
											fontSize: 12,
											fontFamily: 'OpenSans-Regular',
											fontWeight: 'normal'
										},
										text: ns.tools.moment.unix(jsonResult.success.result.comments.items[i].ts_registration).fromNow(),
										color: '#444444'
									}));

									commentCont.add(Ti.UI.createLabel({
										top: 80,
										left: 0,
										font: {
											fontSize: 14,
											fontFamily: 'OpenSans-Regular',
											fontWeight: 'normal'
										},
										text: jsonResult.success.result.comments.items[i].text,
										color: '#222222',
										textAlign: 'left'
									}));

								comment.add(commentCont);
								commentsData.push(comment);
							}

							var comment = Ti.UI.createTableViewRow({
								width: Ti.Platform.displayCaps.platformWidth,
								height: 15,
								touchEnabled: false,
								backgroundColor: 'transparent',
								selectedBackgroundColor: 'transparent'
							});

								var commentCont = Ti.UI.createView({
									top: 0,
									left: 25,
									right: 25,
									height: 15,
									backgroundColor: '#FAFAFA'
								});

								comment.add(commentCont);
							commentsData.push(comment);

							commentsScrollView.setData(commentsData);
							page_number += 1;
							updating = false;
						}
						else {
							updating = false;
							commentsContChange = false;
							
							if (commentsData.length == 0) {
								commentsUpdateRequired.setVisible(true);
							}
						}
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
								updating = false;
								WindowError = null;
								windowError = null;
								commentsContChange = false;
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
						commentsContChange = false;
					});
				}
			},
			onerror: function() {
				clearInterval(incLoadingTime);

				if (headerLoading !== undefined) {
					self.remove(headerLoading);
				}

				if (commentsData.length == 0) {	
					commentsUpdateRequired.setVisible(true);
				}

				WindowError = require('ui/ErrorWindow');
				windowError = new WindowError(L('ui0010'), L('x0011'));
				windowError.open();

				windowError.addEventListener('close_extra', function() {
					updating = false;
					WindowError = null;
					windowError = null;
					commentsContChange = false;
				});
			},
			timeout: 15000
		});
		httpCommentsRegister.open('GET', 'https://qqnder.com/api.php?v=' + ns.api.version + '&step=comments&uuid=' + Ti.Platform.id + '&token=' + ns.session.token + '&group_idd=' + eventGroupIdd + '&page=' + page_number + '&screen_type=' + Ti.Platform.displayCaps.dpi);
		httpCommentsRegister.send();
	};

	// Open comments

	self.addEventListener('open', function() {
		beginUpdate(true);
	});

	// Scroll comments

	var lastDistance = 0;
	var offset;
	var height;
	var total;
	var theEnd;
	var distance;
	var nearEnd;

	commentsScrollView.addEventListener('scroll', function(e) {
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

	// Go back to the previous screen

	topCommentsHeaderLeft.addEventListener('singletap', function() {
		commentsContChange = true;

    	self.fireEvent('close_extra');
    	self.close();
	});

	// Add comment

	commentsAddCont.addEventListener('singletap', function() {
		if (commentsContChange === false && !checkConnection()) {
			WindowError = require('ui/ErrorWindow');
			windowError = new WindowError(L('ui0010'), L('x0010'));
			windowError.open();

			windowError.addEventListener('close_extra', function() {
				WindowError = null;
				windowError = null;
				commentsContChange = false;
			});
		}
		else if (commentsContChange === false) {
			commentsContChange = true;

			WindowCommentAdd = require('ui/CommentAdd');
			windowCommentAdd = new WindowCommentAdd(eventGroupIdd);
			windowCommentAdd.open();

			windowCommentAdd.addEventListener('open', function() {
				setTimeout(function() {
					spinnerCont.setVisible(false);
				}, 500);
			});

			windowCommentAdd.addEventListener('close_extra', function() {
				WindowCommentAdd = null;
				windowCommentAdd = null;
				commentsContChange = false;
				spinnerCont.setVisible(false);
				beginUpdate(true);
			});
		}
	});

	// Close comments

	self.addEventListener('close', function() {
		if (windowError != null) {
			windowError.close();
		}

		if (windowCommentAdd != null) {
			windowCommentAdd.close();
		}
	});

	return self;
}

module.exports = CommentWindow;