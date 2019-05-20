function MapWindow(dataPlaceLatitude, dataPlaceLongitude, dataEventGroupIdd, similarPlacesTmpArr) {

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
	 * Map
	 */	

	var self = Ti.UI.createWindow({
		top: 0,
		left: 0,
	    width: Ti.Platform.displayCaps.platformWidth,
	    height: Ti.UI.FILL,
	    backgroundColor: '#FAFAFA'
	});

		// Top Menu

		var topMapHeaderCont = Ti.UI.createView({
			height: (headerTop + 44),
			width: Ti.Platform.displayCaps.platformWidth,
			top: 0,
			left: 0,
			zIndex: 10000
		});

			topMapHeaderCont.add(Ti.UI.createView({
				height: 1,
				left: 0,
				width: Ti.Platform.displayCaps.platformWidth,
				bottom: 0,
				backgroundColor: '#CDCED2'
			}));

			var topMapHeaderCenter = Ti.UI.createView({
				right: 54,
				left: 54,
				height: 44,
				bottom: 0
			});

				topMapHeaderCenter.add(Ti.UI.createLabel({
					text: L('ui0157'),
					font: {
						fontFamily: 'OpenSans-Regular',
						fontSize: 16,
						fontWeight: 'normal'
					},
					height: Ti.UI.SIZE,
					color: '#000000'
				}));

			var topMapHeaderRight = Ti.UI.createView({
				left: 0,
				height: 44,
				width: 54,
				bottom: 0
			});

				topMapHeaderRight.add(Ti.UI.createView({
					backgroundImage: '/img/ios/map/left_slider.png',
					backgroundRepeat: false,
					height: 22,
					width: 22
				}));

			topMapHeaderCont.add(topMapHeaderCenter);
			topMapHeaderCont.add(topMapHeaderRight);
		self.add(topMapHeaderCont);

	var mapCont = apple_map.createView({
    	top: (headerTop + 44),
    	left: 0,
        width: Ti.Platform.displayCaps.platformWidth,
        bottom: 110,
        zIndex: 100,
        mapType: apple_map.TERRAIN_TYPE,
        animate: true,
        userLocation: true,
        touchEnabled: true,
        rotateEnabled: true,
        backgroundColor: '#555555',
        showsPointsOfInterest: false
	});

		mapCont.setLocation({
	   		animate: true,
	   		latitude: dataPlaceLatitude,
	   		longitude: dataPlaceLongitude,
	    	latitudeDelta: .01,
	        longitudeDelta: .01
	    });

	var markersArr = [];
	var phoneTmp = '';

	for (var i = 0; i < similarPlacesTmpArr.length; i++) {
        var markerTmp = apple_map.createAnnotation({
            latitude: similarPlacesTmpArr[i].location[1],
            longitude: similarPlacesTmpArr[i].location[0],
            customView: Ti.UI.createView({
	        	width: 16,
				height: 16,
				borderRadius: 8,
				backgroundColor: '#007AFF'
	    	}),
            zIndex: 100,
            showInfoWindow: false,
            title: similarPlacesTmpArr[i].name,
            subtitle: similarPlacesTmpArr[i].address,
            dataName: similarPlacesTmpArr[i].name,
            dataPhone: similarPlacesTmpArr[i].phone,
            dataAddress: similarPlacesTmpArr[i].address,
            dataPlaceId: similarPlacesTmpArr[i].place_id
        });

        markersArr.push(markerTmp);
    }

	var callCont = Ti.UI.createView({
        bottom: 25,
        right: 25,
        height: 70,
        width: 70,
        borderRadius: 35,
		backgroundColor: '#007AFF',
        zIndex: 200
    });

		callCont.add(Ti.UI.createView({
	        height: 28,
			width: 28,
	        backgroundImage: '/img/ios/map/call_icon.png',
            backgroundRepeat: false
	    }));

		mapCont.add(callCont);

    self.add(mapCont);

    var scheduleCont = Ti.UI.createView({
    	left: 0,
    	right: 0,
    	height: 110,
    	bottom: 0,        
       	touchEnabled: false
    });

    	scheduleCont.add(Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.Platform.displayCaps.platformWidth,
			height: 1,
			backgroundColor:'#EFEFF3',
			zIndex: 10
		}));

    	var scheduleViewCont = Ti.UI.createView({
	    	left: 25,
	    	right: 25,
	    	height: 80,
	    	bottom: 15,
	    	layout: 'horizontal',       
	       	touchEnabled: false
	    });

	    	// Mon

		    var mon = Ti.UI.createView({
	            left: 0,
	            width: '16%',
	            height: 80,
	            top: 0,
	            backgroundColor: '#FAFAFA'
	        });

	            mon.add(Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#000000',
	                font: {
	                    fontFamily: 'OpenSans-Semibold',
	                    fontSize: 15,
	                    fontWeight: 'normal'
	                },
	                text: L('weekDay1'),
	                top: 3
	            }));
	
	            var monSubTitleOne = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 40
	            });

	            mon.add(monSubTitleOne);

	            var monSubTitleTwo = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 59
	            });

	            mon.add(monSubTitleTwo);

			    var monSubTitleAllTime = Ti.UI.createLabel({
			        textAlign: 'center',
			        color: '#5C5C5C',
			        font: {
			            fontFamily: 'OpenSans-Regular',
			            fontSize: 12,
			            fontWeight: 'normal'
			        },
			        text: '24/1',
			        top: 46,
			        visible: false
			    });

			    mon.add(monSubTitleAllTime);

			    var monHr = Ti.UI.createView({
			    	left: 0,
			        top: 30,
			        width: Ti.UI.FILL,
			        height: 1,
			        backgroundColor: '#EFEFF3'
			    });

			    mon.add(monHr);
		    scheduleViewCont.add(mon);
	
	  		// Tue
	
			var tue = Ti.UI.createView({
	            left: 0,
	            height: 80,
	            width: '13%',
	            backgroundColor: '#FAFAFA',
	            top: 0
	        });

	            tue.add(Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#000000',
	                font: {
	                    fontFamily: 'OpenSans-Semibold',
	                    fontSize: 15,
	                    fontWeight: 'normal'
	                },
	                text: L('weekDay2'),
	                top: 3
	            }));
	
	            var tueSubTitleOne = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 40
	            });
	
	            tue.add(tueSubTitleOne);
	
	            var tueSubTitleTwo = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 59
	            });
	
	            tue.add(tueSubTitleTwo);
	
			    var tueSubTitleAllTime = Ti.UI.createLabel({
			        textAlign: 'center',
			        color: '#5C5C5C',
			        font: {
			            fontFamily: 'OpenSans-Regular',
			            fontSize: 12,
			            fontWeight: 'normal'
			        },
			        text: '24/1',
			        top: 46,
			        visible: false
			    });
			    
			    tue.add(tueSubTitleAllTime);
	
			    var tueHr = Ti.UI.createView({
			        top: 30,
			        left: 0,
			        width: Ti.UI.FILL,
			        height: 1,
			        backgroundColor: '#EFEFF3'
			    });
	
			    tue.add(tueHr);
		    scheduleViewCont.add(tue);
			    
			// Wed
	  
			var wed = Ti.UI.createView({
	            left: 0,
	            height: 80,
	            width: '13%',
	            backgroundColor: '#FAFAFA',
	            top: 0
	        });
	
	            wed.add(Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#222222',
	                font: {
	                    fontFamily: 'OpenSans-Semibold',
	                    fontSize: 15,
	                    fontWeight: 'normal'
	                },
	                text: L('weekDay3'),
	                top: 3
	            }));
	
	            var wedSubTitleOne = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 40
	            });
	
	            wed.add(wedSubTitleOne);
	
	            var wedSubTitleTwo = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 59
	            });
	
	            wed.add(wedSubTitleTwo);
	
			    var wedSubTitleAllTime = Ti.UI.createLabel({
			        textAlign: 'center',
			        color: '#5C5C5C',
			        font: {
			            fontFamily: 'OpenSans-Regular',
			            fontSize: 12,
			            fontWeight: 'normal'
			        },
			        text: '24/1',
			        top: 46,
			        visible: false
			    });
			    
			    wed.add(wedSubTitleAllTime);
	
			    var wedHr = Ti.UI.createView({
			        top: 30,
			        left: 0,
			        width: Ti.UI.FILL,
			        height: 1,
			        backgroundColor: '#EFEFF3'
			    });
	
			    wed.add(wedHr);
		    scheduleViewCont.add(wed);
	
			// Thursday
	
			var thu = Ti.UI.createView({
	            left: 0,
	            height: 80,
	            width: '16%',
	            backgroundColor: '#FAFAFA',
	            top: 0
	        });
	
	            thu.add(Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#000000',
	                font: {
	                    fontFamily: 'OpenSans-Semibold',
	                    fontSize: 15,
	                    fontWeight: 'normal'
	                },
	                text: L('weekDay4'),
	                top: 3
	            }));
	
	            var thuSubTitleOne = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 40
	            });
	
	            thu.add(thuSubTitleOne);
	
	            var thuSubTitleTwo = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 59
	            });
	
	            thu.add(thuSubTitleTwo);
	
			    var thuSubTitleAllTime = Ti.UI.createLabel({
			        textAlign: 'center',
			        color: '#5C5C5C',
			        font: {
			            fontFamily: 'OpenSans-Regular',
			            fontSize: 12,
			            fontWeight: 'normal'
			        },
			        text: '24/1',
			        top: 46,
			        visible: false
			    });
	
			    thu.add(thuSubTitleAllTime);
	
			    var thuHr = Ti.UI.createView({
			        top: 30,
			        left: 0,
			        width: Ti.UI.FILL,
			        height: 1,
			        backgroundColor: '#EFEFF3'
			    });
	
			    thu.add(thuHr);
		    scheduleViewCont.add(thu);
	
			// Friday
	  
			var fri = Ti.UI.createView({
	            left: 0,
	            height: 80,
	            width: '13%',
	            backgroundColor: '#FAFAFA',
	            top: 0
	        });
	
	            fri.add(Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#000000',
	                font: {
	                    fontFamily: 'OpenSans-Semibold',
	                    fontSize: 15,
	                    fontWeight: 'normal'
	                },
	                text: L('weekDay5'),
	                top: 3
	            }));
	
	            var friSubTitleOne = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 40
	            });
	
	            fri.add(friSubTitleOne);
	
	            var friSubTitleTwo = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 59
	            });
	
	            fri.add(friSubTitleTwo);
	
			    var friSubTitleAllTime = Ti.UI.createLabel({
			        textAlign: 'center',
			        color: '#5C5C5C',
			        font: {
			            fontFamily: 'OpenSans-Regular',
			            fontSize: 12,
			            fontWeight: 'normal'
			        },
			        text: '24/1',
			        top: 46,
			        visible: false
			    });
	
			    fri.add(friSubTitleAllTime);
	
			    var friHr = Ti.UI.createView({
			    	left: 0,
			        top: 30,
			        width: Ti.UI.FILL,
			        height: 1,
			        backgroundColor: '#EFEFF3'
			    });
	
			    fri.add(friHr);
		    scheduleViewCont.add(fri);
	
			// Saturday
	  
			var sat = Ti.UI.createView({
	            left: 0,
	            height: 80,
	            width: '13%',
	            backgroundColor: '#FAFAFA',
	            top: 0
	        });
	
	            sat.add(Ti.UI.createLabel({
	                textAlign: 'center',
	                font: {
	                    fontFamily: 'OpenSans-Semibold',
	                    fontSize: 15,
	                    fontWeight: 'normal'
	                },
	                color: '#FF3B30',
	                text: L('weekDay6'),
	                top: 3
	            }));
	
	            var satSubTitleOne = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 40
	            });
	
	            sat.add(satSubTitleOne);
	
	            var satSubTitleTwo = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 59
	            });
	
	            sat.add(satSubTitleTwo);
	
			    var satSubTitleAllTime = Ti.UI.createLabel({
			        textAlign: 'center',
			        color: '#5C5C5C',
			        font: {
			            fontFamily: 'OpenSans-Regular',
			            fontSize: 12,
			            fontWeight: 'normal'
			        },
			        text: '24/1',
			        top: 46,
			        visible: false
			    });
	
			    sat.add(satSubTitleAllTime);
	
			    var satHr = Ti.UI.createView({
			    	left: 0,
			        top: 30,
			        width: Ti.UI.FILL,
			        height: 1,
			        backgroundColor: '#EFEFF3'
			    });
	
			    sat.add(satHr);
		    scheduleViewCont.add(sat);	
	
			// Sunday
	
			var sun = Ti.UI.createView({
	            left: 0,
	            height: 80,
	            width: '16%',
	            backgroundColor: '#FAFAFA',
	            top: 0
	        });
	
	            sun.add(Ti.UI.createLabel({
	                textAlign: 'center',
	                font: {
	                    fontFamily: 'OpenSans-Semibold',
	                    fontSize: 15,
	                    fontWeight: 'normal'
	                },
	                color: '#FF3B30',
	                text: L('weekDay7'),
	                top: 3
	            }));
	
	            var sunSubTitleOne = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 40
	            });
	
	            sun.add(sunSubTitleOne);
	
	            var sunSubTitleTwo = Ti.UI.createLabel({
	                textAlign: 'center',
	                color: '#5C5C5C',
	                font: {
	                    fontFamily: 'OpenSans-Regular',
	                    fontSize: 12,
	                    fontWeight: 'normal'
	                },
	                text: '',
	                top: 59
	            });
	
	            sun.add(sunSubTitleTwo);
	
			    var sunSubTitleAllTime = Ti.UI.createLabel({
			        textAlign: 'center',
			        color: '#5C5C5C',
			        font: {
			            fontFamily: 'OpenSans-Regular',
			            fontSize: 12,
			            fontWeight: 'normal'
			        },
			        text: '24/1',
			        top: 46,
			        visible: false
			    });
	
			    sun.add(sunSubTitleAllTime);
	
			    var sunHr = Ti.UI.createView({
			    	left: 0,
			    	top: 30,
			    	width: Ti.UI.FILL,
			    	height: 1,
					backgroundColor: '#EFEFF3'
				});

				sun.add(sunHr);
			scheduleViewCont.add(sun);

		scheduleCont.add(scheduleViewCont);
	self.add(scheduleCont);

	/**
	 * Actions
	 */

	var mapContChange = true;

	self.addEventListener('open', function() {
		setTimeout(function() {	
			mapContChange = false;
		}, 300);
	});

	// Select marker

	mapCont.addEventListener('click', function(e) {
		if (mapContChange === false && 'pin' === e.clicksource) {
			phoneTmp = e.annotation.dataPhone;

			for (var i = 0; i < similarPlacesTmpArr.length; i++) {
            	if (similarPlacesTmpArr[i].place_id == e.annotation.dataPlaceId) {
                	var dayOfWeek = ns.tools.moment().format('E');
                    monHr.setBackgroundColor('#EFEFF3');
                    tueHr.setBackgroundColor('#EFEFF3');
                    wedHr.setBackgroundColor('#EFEFF3');
                    thuHr.setBackgroundColor('#EFEFF3');
                    friHr.setBackgroundColor('#EFEFF3');
                    satHr.setBackgroundColor('#EFEFF3');
                    sunHr.setBackgroundColor('#EFEFF3');

                    if (dayOfWeek == 1) {
                    	monHr.setBackgroundColor('#000000');
                    }
                    else if (dayOfWeek == 2) {
                    	tueHr.setBackgroundColor('#000000');
                    }
                    else if (dayOfWeek == 3) {
                    	wedHr.setBackgroundColor('#000000');
                    }
                    else if (dayOfWeek == 4) {
                    	thuHr.setBackgroundColor('#000000');
                    }
                    else if (dayOfWeek == 5) {
                    	friHr.setBackgroundColor('#000000');
                    }
                    else if (dayOfWeek == 6) {
                    	satHr.setBackgroundColor('#000000');
                    }
                    else if (dayOfWeek == 7) {
                    	sunHr.setBackgroundColor('#000000');
                    }
                    
                    // Mon
                                        
                    if (0 == similarPlacesTmpArr[i].schedule.mon_start && 0 == similarPlacesTmpArr[i].schedule.mon_end) {
                		monSubTitleOne.setText('—');
                		monSubTitleTwo.setText('—');
                	}
                	else {
                		if (2400 == similarPlacesTmpArr[i].schedule.mon_start && 2400 == similarPlacesTmpArr[i].schedule.mon_end) {
					        monSubTitleOne.setVisible(false);
					        monSubTitleTwo.setVisible(false);
					        monSubTitleAllTime.setVisible(true);
					    }
					    else {
					        if (similarPlacesTmpArr[i].schedule.tue_start < 1000) {
					            monSubTitleOne.setText('0' + similarPlacesTmpArr[i].schedule.mon_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.mon_start.toString().substr(1, 2));
					        }
					        else {
					            monSubTitleOne.setText(similarPlacesTmpArr[i].schedule.mon_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.mon_start.toString().substr(2, 2));
					        }

					        if (similarPlacesTmpArr[i].schedule.mon_end < 1000) {
					            monSubTitleTwo.setText('0' + similarPlacesTmpArr[i].schedule.mon_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.mon_end.toString().substr(1, 2));
					        }
					        else {
					            monSubTitleTwo.setText(similarPlacesTmpArr[i].schedule.mon_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.mon_end.toString().substr(2, 2));
					        }
					    }
                	}
                	
                	// Tue
                	
                	if (0 == similarPlacesTmpArr[i].schedule.tue_start && 0 == similarPlacesTmpArr[i].schedule.tue_end) {
                		tueSubTitleOne.setText('—');
                		tueSubTitleTwo.setText('—');
                	}
                	else {
                		if (2400 == similarPlacesTmpArr[i].schedule.tue_start && 2400 == similarPlacesTmpArr[i].schedule.tue_end) {
					        tueSubTitleOne.setVisible(false);
					        tueSubTitleTwo.setVisible(false);
					        tueSubTitleAllTime.setVisible(true);
					    }
					    else {
					        if (similarPlacesTmpArr[i].schedule.tue_start < 1000) {
					            tueSubTitleOne.setText('0' + similarPlacesTmpArr[i].schedule.tue_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.tue_start.toString().substr(1, 2));
					        }
					        else {
					            tueSubTitleOne.setText(similarPlacesTmpArr[i].schedule.tue_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.tue_start.toString().substr(2, 2));
					        }

					        if (similarPlacesTmpArr[i].schedule.tue_end < 1000) {
					            tueSubTitleTwo.setText('0' + similarPlacesTmpArr[i].schedule.tue_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.tue_end.toString().substr(1, 2));
					        }
					        else {
					            tueSubTitleTwo.setText(similarPlacesTmpArr[i].schedule.tue_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.tue_end.toString().substr(2, 2));
					        }
					    }
                	}
                	
                	// Wed
                	
                	if (0 == similarPlacesTmpArr[i].schedule.wed_start && 0 == similarPlacesTmpArr[i].schedule.wed_end) {
                		wedSubTitleOne.setText('—');
                		wedSubTitleTwo.setText('—');
                	}
                    else {
                		if (2400 == similarPlacesTmpArr[i].schedule.wed_start && 2400 == similarPlacesTmpArr[i].schedule.wed_end) {
					        wedSubTitleOne.setVisible(false);
					        wedSubTitleTwo.setVisible(false);
					        wedSubTitleAllTime.setVisible(true);
					    }
					    else {
					        if (similarPlacesTmpArr[i].schedule.wed_start < 1000) {
					            wedSubTitleOne.setText('0' + similarPlacesTmpArr[i].schedule.wed_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.wed_start.toString().substr(1, 2));
					        }
					        else {
					            wedSubTitleOne.setText(similarPlacesTmpArr[i].schedule.wed_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.wed_start.toString().substr(2, 2));
					        }

					        if (similarPlacesTmpArr[i].schedule.wed_end < 1000) {
					            wedSubTitleTwo.setText('0' + similarPlacesTmpArr[i].schedule.wed_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.wed_end.toString().substr(1, 2));
					        }
					        else {
					            wedSubTitleTwo.setText(similarPlacesTmpArr[i].schedule.wed_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.wed_end.toString().substr(2, 2));
					        }
					    }
                	}

                    // Tru
                    
                    if (0 == similarPlacesTmpArr[i].schedule.thu_start && 0 == similarPlacesTmpArr[i].schedule.thu_end) {
                		thuSubTitleOne.setText('—');
                		thuSubTitleTwo.setText('—');
                	}
                	else {
                		if (2400 == similarPlacesTmpArr[i].schedule.thu_start && 2400 == similarPlacesTmpArr[i].schedule.thu_end) {
					        thuSubTitleOne.setVisible(false);
					        thuSubTitleTwo.setVisible(false);
					        thuSubTitleAllTime.setVisible(true);
					    }
					    else {
					        if (similarPlacesTmpArr[i].schedule.thu_start < 1000) {
					            thuSubTitleOne.setText('0' + similarPlacesTmpArr[i].schedule.thu_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.thu_start.toString().substr(1, 2));
					        }
					        else {
					            thuSubTitleOne.setText(similarPlacesTmpArr[i].schedule.thu_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.thu_start.toString().substr(2, 2));
					        }

					        if (similarPlacesTmpArr[i].schedule.thu_end < 1000) {
					            thuSubTitleTwo.setText('0' + similarPlacesTmpArr[i].schedule.thu_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.thu_end.toString().substr(1, 2));
					        }
					        else {
					            thuSubTitleTwo.setText(similarPlacesTmpArr[i].schedule.thu_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.thu_end.toString().substr(2, 2));
					        }
					    }
                	}
                	
                	// Fri
                    
                    if (0 == similarPlacesTmpArr[i].schedule.fri_start && 0 == similarPlacesTmpArr[i].schedule.fri_end) {
                		friSubTitleOne.setText('—');
                		friSubTitleTwo.setText('—');
                	}
                	else {
                		if (2400 == similarPlacesTmpArr[i].schedule.fri_start && 2400 == similarPlacesTmpArr[i].schedule.fri_end) {
					        friSubTitleOne.setVisible(false);
					        friSubTitleTwo.setVisible(false);
					        friSubTitleAllTime.setVisible(true);
					    }
					    else {
					        if (similarPlacesTmpArr[i].schedule.fri_start < 1000) {
					            friSubTitleOne.setText('0' + similarPlacesTmpArr[i].schedule.fri_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.fri_start.toString().substr(1, 2));
					        }
					        else {
					            friSubTitleOne.setText(similarPlacesTmpArr[i].schedule.fri_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.fri_start.toString().substr(2, 2));
					        }

					        if (similarPlacesTmpArr[i].schedule.thu_end < 1000) {
					            friSubTitleTwo.setText('0' + similarPlacesTmpArr[i].schedule.fri_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.fri_end.toString().substr(1, 2));
					        }
					        else {
					            friSubTitleTwo.setText(similarPlacesTmpArr[i].schedule.fri_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.fri_end.toString().substr(2, 2));
					        }
					    }
                	}
                	
                	// Sat
                    
                    if (0 == similarPlacesTmpArr[i].schedule.sat_start && 0 == similarPlacesTmpArr[i].schedule.sat_end) {
                		satSubTitleOne.setText('—');
                		satSubTitleTwo.setText('—');
                	}
                	else {
                		if (2400 == similarPlacesTmpArr[i].schedule.sat_start && 2400 == similarPlacesTmpArr[i].schedule.sat_end) {
					        satSubTitleOne.setVisible(false);
					        satSubTitleTwo.setVisible(false);
					        satSubTitleAllTime.setVisible(true);
					    }
					    else {
					        if (similarPlacesTmpArr[i].schedule.sat_start < 1000) {
					            satSubTitleOne.setText('0' + similarPlacesTmpArr[i].schedule.sat_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.sat_start.toString().substr(1, 2));
					        }
					        else {
					            satSubTitleOne.setText(similarPlacesTmpArr[i].schedule.sat_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.sat_start.toString().substr(2, 2));
					        }

					        if (similarPlacesTmpArr[i].schedule.sat_end < 1000) {
					            satSubTitleTwo.setText('0' + similarPlacesTmpArr[i].schedule.sat_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.sat_end.toString().substr(1, 2));
					        }
					        else {
					            satSubTitleTwo.setText(similarPlacesTmpArr[i].schedule.sat_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.sat_end.toString().substr(2, 2));
					        }
					    }
                	}
                	
                	// Sun

                    if (0 == similarPlacesTmpArr[i].schedule.sun_start && 0 == similarPlacesTmpArr[i].schedule.sun_end) {
                		sunSubTitleOne.setText('—');
                		sunSubTitleTwo.setText('—');
                	}
                	else {
                		if (2400 == similarPlacesTmpArr[i].schedule.sun_start && 2400 == similarPlacesTmpArr[i].schedule.sun_end) {
					        sunSubTitleOne.setVisible(false);
					        sunSubTitleTwo.setVisible(false);
					        sunSubTitleAllTime.setVisible(true);
					    }
					    else {
					        if (similarPlacesTmpArr[i].schedule.sun_start < 1000) {
					            sunSubTitleOne.setText('0' + similarPlacesTmpArr[i].schedule.sun_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.sun_start.toString().substr(1, 2));
					        }
					        else {
					            sunSubTitleOne.setText(similarPlacesTmpArr[i].schedule.sun_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.sun_start.toString().substr(2, 2));
					        }

					        if (similarPlacesTmpArr[i].schedule.sat_end < 1000) {
					            sunSubTitleTwo.setText('0' + similarPlacesTmpArr[i].schedule.sun_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[i].schedule.sun_end.toString().substr(1, 2));
					        }
					        else {
					            sunSubTitleTwo.setText(similarPlacesTmpArr[i].schedule.sun_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[i].schedule.sun_end.toString().substr(2, 2));
					        }
					    }
                	}
                }
			}
		}
	});

	setTimeout(function() {
    	mapCont.addAnnotations(markersArr);

    	for (var i = 0; i < similarPlacesTmpArr.length; i++) {
			mapCont.selectAnnotation(markersArr[0]);

			var dayOfWeek = ns.tools.moment().format('E');
            monHr.setBackgroundColor('#EFEFF3');
            tueHr.setBackgroundColor('#EFEFF3');
            wedHr.setBackgroundColor('#EFEFF3');
            thuHr.setBackgroundColor('#EFEFF3');
            friHr.setBackgroundColor('#EFEFF3');
            satHr.setBackgroundColor('#EFEFF3');
            sunHr.setBackgroundColor('#EFEFF3');

            if (dayOfWeek == 1) {
            	monHr.setBackgroundColor('#000000');
            }
            else if (dayOfWeek == 2) {
            	tueHr.setBackgroundColor('#000000');
            }
            else if (dayOfWeek == 3) {
            	wedHr.setBackgroundColor('#000000');
            }
            else if (dayOfWeek == 4) {
            	thuHr.setBackgroundColor('#000000');
            }
            else if (dayOfWeek == 5) {
            	friHr.setBackgroundColor('#000000');
            }
            else if (dayOfWeek == 6) {
            	satHr.setBackgroundColor('#000000');
            }
            else if (dayOfWeek == 7) {
            	sunHr.setBackgroundColor('#000000');
            }

            // Mon

            if (0 == similarPlacesTmpArr[0].schedule.mon_start && 0 == similarPlacesTmpArr[0].schedule.mon_end) {
        		monSubTitleOne.setText('—');
        		monSubTitleTwo.setText('—');
        	}
        	else {
        		if (2400 == similarPlacesTmpArr[0].schedule.mon_start && 2400 == similarPlacesTmpArr[0].schedule.mon_end) {
			        monSubTitleOne.setVisible(false);
			        monSubTitleTwo.setVisible(false);
			        monSubTitleAllTime.setVisible(true);
			    }
			    else {
			        if (similarPlacesTmpArr[0].schedule.tue_start < 1000) {
			            monSubTitleOne.setText('0' + similarPlacesTmpArr[0].schedule.mon_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.mon_start.toString().substr(1, 2));
			        }
			        else {
			            monSubTitleOne.setText(similarPlacesTmpArr[0].schedule.mon_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.mon_start.toString().substr(2, 2));
			        }

			        if (similarPlacesTmpArr[0].schedule.mon_end < 1000) {
			            monSubTitleTwo.setText('0' + similarPlacesTmpArr[0].schedule.mon_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.mon_end.toString().substr(1, 2));
			        }
			        else {
			            monSubTitleTwo.setText(similarPlacesTmpArr[0].schedule.mon_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.mon_end.toString().substr(2, 2));
			    	}
			    }
        	}
        	
        	// Tue
        	
        	if (0 == similarPlacesTmpArr[0].schedule.tue_start && 0 == similarPlacesTmpArr[0].schedule.tue_end) {
        		tueSubTitleOne.setText('—');
        		tueSubTitleTwo.setText('—');
        	}
        	else {
        		if (2400 == similarPlacesTmpArr[0].schedule.tue_start && 2400 == similarPlacesTmpArr[0].schedule.tue_end) {
			        tueSubTitleOne.setVisible(false);
			        tueSubTitleTwo.setVisible(false);
			        tueSubTitleAllTime.setVisible(true);
			    }
			    else {
			        if (similarPlacesTmpArr[0].schedule.tue_start < 1000) {
			            tueSubTitleOne.setText('0' + similarPlacesTmpArr[0].schedule.tue_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.tue_start.toString().substr(1, 2));
			        }
			        else {
			            tueSubTitleOne.setText(similarPlacesTmpArr[0].schedule.tue_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.tue_start.toString().substr(2, 2));
			        }

			        if (similarPlacesTmpArr[0].schedule.tue_end < 1000) {
			            tueSubTitleTwo.setText('0' + similarPlacesTmpArr[0].schedule.tue_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.tue_end.toString().substr(1, 2));
			        }
			        else {
			            tueSubTitleTwo.setText(similarPlacesTmpArr[0].schedule.tue_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.tue_end.toString().substr(2, 2));
			        }
			    }
        	}

        	// Wed

        	if (0 == similarPlacesTmpArr[0].schedule.wed_start && 0 == similarPlacesTmpArr[0].schedule.wed_end) {
        		wedSubTitleOne.setText('—');
        		wedSubTitleTwo.setText('—');
        	}
            else {
        		if (2400 == similarPlacesTmpArr[0].schedule.wed_start && 2400 == similarPlacesTmpArr[0].schedule.wed_end) {
			        wedSubTitleOne.setVisible(false);
			        wedSubTitleTwo.setVisible(false);
			        wedSubTitleAllTime.setVisible(true);
			    }
			    else {
			        if (similarPlacesTmpArr[0].schedule.wed_start < 1000) {
			            wedSubTitleOne.setText('0' + similarPlacesTmpArr[0].schedule.wed_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.wed_start.toString().substr(1, 2));
			        }
			        else {
			            wedSubTitleOne.setText(similarPlacesTmpArr[0].schedule.wed_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.wed_start.toString().substr(2, 2));
			        }

			        if (similarPlacesTmpArr[0].schedule.wed_end < 1000) {
			            wedSubTitleTwo.setText('0' + similarPlacesTmpArr[0].schedule.wed_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.wed_end.toString().substr(1, 2));
			        }
			        else {
			            wedSubTitleTwo.setText(similarPlacesTmpArr[0].schedule.wed_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.wed_end.toString().substr(2, 2));
			        }
			    }
        	}

            // Tru

            if (0 == similarPlacesTmpArr[0].schedule.thu_start && 0 == similarPlacesTmpArr[0].schedule.thu_end) {
        		thuSubTitleOne.setText('—');
        		thuSubTitleTwo.setText('—');
        	}
        	else {
        		if (2400 == similarPlacesTmpArr[0].schedule.thu_start && 2400 == similarPlacesTmpArr[0].schedule.thu_end) {
			        thuSubTitleOne.setVisible(false);
			        thuSubTitleTwo.setVisible(false);
			        thuSubTitleAllTime.setVisible(true);
			    }
			    else {
			        if (similarPlacesTmpArr[0].schedule.thu_start < 1000) {
			            thuSubTitleOne.setText('0' + similarPlacesTmpArr[0].schedule.thu_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.thu_start.toString().substr(1, 2));
			        }
			        else {
			            thuSubTitleOne.setText(similarPlacesTmpArr[0].schedule.thu_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.thu_start.toString().substr(2, 2));
			        }

			        if (similarPlacesTmpArr[0].schedule.thu_end < 1000) {
			            thuSubTitleTwo.setText('0' + similarPlacesTmpArr[0].schedule.thu_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.thu_end.toString().substr(1, 2));
			        }
			        else {
			            thuSubTitleTwo.setText(similarPlacesTmpArr[0].schedule.thu_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.thu_end.toString().substr(2, 2));
			        }
			    }
        	}

        	// Fri

            if (0 == similarPlacesTmpArr[0].schedule.fri_start && 0 == similarPlacesTmpArr[0].schedule.fri_end) {
        		friSubTitleOne.setText('—');
        		friSubTitleTwo.setText('—');
        	}
        	else {
        		if (2400 == similarPlacesTmpArr[0].schedule.fri_start && 2400 == similarPlacesTmpArr[0].schedule.fri_end) {
			        friSubTitleOne.setVisible(false);
			        friSubTitleTwo.setVisible(false);
			        friSubTitleAllTime.setVisible(true);
			    }
			    else {
			        if (similarPlacesTmpArr[0].schedule.fri_start < 1000) {
			            friSubTitleOne.setText('0' + similarPlacesTmpArr[0].schedule.fri_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.fri_start.toString().substr(1, 2));
			        }
			        else {
			            friSubTitleOne.setText(similarPlacesTmpArr[0].schedule.fri_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.fri_start.toString().substr(2, 2));
			        }

			        if (similarPlacesTmpArr[0].schedule.thu_end < 1000) {
			            friSubTitleTwo.setText('0' + similarPlacesTmpArr[0].schedule.fri_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.fri_end.toString().substr(1, 2));
			        }
			        else {
			            friSubTitleTwo.setText(similarPlacesTmpArr[0].schedule.fri_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.fri_end.toString().substr(2, 2));
			        }
			    }
        	}

        	// Sat

            if (0 == similarPlacesTmpArr[0].schedule.sat_start && 0 == similarPlacesTmpArr[0].schedule.sat_end) {
        		satSubTitleOne.setText('—');
        		satSubTitleTwo.setText('—');
        	}
        	else {
        		if (2400 == similarPlacesTmpArr[0].schedule.sat_start && 2400 == similarPlacesTmpArr[0].schedule.sat_end) {
			        satSubTitleOne.setVisible(false);
			        satSubTitleTwo.setVisible(false);
			        satSubTitleAllTime.setVisible(true);
			    }
			    else {
			        if (similarPlacesTmpArr[0].schedule.sat_start < 1000) {
			            satSubTitleOne.setText('0' + similarPlacesTmpArr[0].schedule.sat_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.sat_start.toString().substr(1, 2));
			        }
			        else {
			            satSubTitleOne.setText(similarPlacesTmpArr[0].schedule.sat_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.sat_start.toString().substr(2, 2));
			        }

			        if (similarPlacesTmpArr[0].schedule.sat_end < 1000) {
			            satSubTitleTwo.setText('0' + similarPlacesTmpArr[0].schedule.sat_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.sat_end.toString().substr(1, 2));
			        }
			        else {
			            satSubTitleTwo.setText(similarPlacesTmpArr[0].schedule.sat_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.sat_end.toString().substr(2, 2));
			        }
			    }
        	}

        	// Sun

            if (0 == similarPlacesTmpArr[0].schedule.sun_start && 0 == similarPlacesTmpArr[0].schedule.sun_end) {
        		sunSubTitleOne.setText('—');
        		sunSubTitleTwo.setText('—');
        	}
        	else {
        		if (2400 == similarPlacesTmpArr[0].schedule.sun_start && 2400 == similarPlacesTmpArr[0].schedule.sun_end) {
			        sunSubTitleOne.setVisible(false);
			        sunSubTitleTwo.setVisible(false);
			        sunSubTitleAllTime.setVisible(true);
			    }
			    else {
			        if (similarPlacesTmpArr[0].schedule.sun_start < 1000) {
			            sunSubTitleOne.setText('0' + similarPlacesTmpArr[0].schedule.sun_start.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.sun_start.toString().substr(1, 2));
			        }
			        else {
			            sunSubTitleOne.setText(similarPlacesTmpArr[0].schedule.sun_start.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.sun_start.toString().substr(2, 2));
			        }

			        if (similarPlacesTmpArr[0].schedule.sat_end < 1000) {
			            sunSubTitleTwo.setText('0' + similarPlacesTmpArr[0].schedule.sun_end.toString().substr(0, 1) + ':' + similarPlacesTmpArr[0].schedule.sun_end.toString().substr(1, 2));
			        }
			        else {
			            sunSubTitleTwo.setText(similarPlacesTmpArr[0].schedule.sun_end.toString().substr(0, 2) + ':' + similarPlacesTmpArr[0].schedule.sun_end.toString().substr(2, 2));
			        }
			    }
    		}
    	}
    }, 500);

	// Phone call

	callCont.addEventListener('singletap', function() {
		if (mapContChange === false) {
			mapContChange = true;

			Ti.Platform.openURL('tel:+' + parseInt(phoneTmp.replace(/\D+/g, '')));

			setTimeout(function() {
				mapContChange = false;

				if (checkConnection()) {
					phoneCallRequest(parseInt(phoneTmp.replace(/\D+/g, '')), parseInt(dataEventGroupIdd));
				}
			}, 300);
		}
   	});

	// Map close

	topMapHeaderRight.addEventListener('singletap', function() {
		if (mapContChange === false) {
			mapContChange = true;

	    	self.fireEvent('close_extra');
	    	self.close();
		}
	});

	return self;
}

module.exports = MapWindow;