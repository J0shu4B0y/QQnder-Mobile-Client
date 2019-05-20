// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

makeVK(exports);

function makeVK(vk) 
{

    // properties
    vk.appid = '';
    vk.permissions = [];

    // constants
    vk.PERMISSION = {
        NOTIFICATION: {code: 1},
        FRIENDS: {code: 2},
        PHOTOS: {code: 4},
        AUDIO: {code: 8},
        VIDEO: {code: 16},
        OFFERS: {code: 32},
        QUESTIONS: {code: 64},
        WIKI: {code: 128},
        WRITE_APPLINK: {code: 256},
        WRITE_WALLAPPLINK: {code: 512},
        STATUS: {code: 1024},
        NOTES: {code: 2048},
        MESSAGES: {code: 4096},
        POST_WALL: {code: 8192},
        ADVERTIZE: {code: 32768},
        DOCUMENTS: {code: 131072},
        GROUPS: {code: 262144},
        ANSWERS: {code: 524288},
        STATISTICS: {code: 1048576}
    };

    // functions
    vk.fireEvent = function(name, event) {
        Ti.App.fireEvent('vkontakte_'+name, event);
    };
    
    vk.addEventListener = function(name, callback) {
        Ti.App.addEventListener('vkontakte_'+name, callback);
    };
    
    vk.removeEventListener = function(name, callback) {
        Ti.App.removeEventListener('vkontakte_'+name, callback);
    };
    
    vk.remakeAPICallWithCaptcha = function(method, params, captcha_sid, captcha_img) {
        var wnd = Ti.UI.createWindow({
            top: 0,
		    width: Ti.Platform.displayCaps.platformWidth,
		    height: Ti.UI.FILL,
		    left: 0,
		    backgroundColor: '#FFFFFF',
		    statusBarStyle: Ti.UI.iPhone.StatusBar.GRAY
        });
        
        	var topCaptchaWindow = 0;
        
        	Ti.API.info(versionChecker(Ti.Platform.getVersion(), '7.0'));
        
    	    if (versionChecker(Ti.Platform.getVersion(), '7.0')) {
		    	topCaptchaWindow = 20;
		    }
        
	        var captchaHeaderCont = Ti.UI.createView({
				height: (topCaptchaWindow + 44),
				width: Ti.Platform.displayCaps.platformWidth,
				top: 0,
				left: 0,
				zIndex: 10000
			});
	
				var captchaHeaderContBg = Ti.UI.createView({
					height: (topCaptchaWindow + 44),
					width: Ti.Platform.displayCaps.platformWidth,
					top: 0,
					left: 0,
					backgroundColor: '#F7F7F7'
				});
	
					captchaHeaderContBg.add(Ti.UI.createView({
						height: 1,
						width: Ti.Platform.displayCaps.platformWidth,
						bottom: 0,
						left: 0,
						backgroundColor:'#DADADA'
					}));
	
				var captchaHeaderCenter = Ti.UI.createView({
					right: 54,
					left: 54,
					height: 44,
					bottom: 0,
					zIndex: 10
				});
	
					var captchaHeaderCenterLabel = Ti.UI.createLabel({
						text: L('ui0044'),
						textAlign: 'center',
						color: '#4C4C4C',
						font: {
							fontFamily: 'Open Sans',
							fontSize: 20,
							fontWeight: 'normal'
						}
					});
	
				var captchaHeaderLeft = Ti.UI.createView({
					left: 0,
					height: 44,
					width: 54,
					bottom: 0,
					zIndex: 10
				});
	
					var captchaHeaderLeftIcon = Ti.UI.createView({
						backgroundImage: '/img/ios/profile/profile_left_slider.png',
						backgroundRepeat: false,
						height: 24,
						width: 24
					});
	
				captchaHeaderCont.add(captchaHeaderContBg);
				captchaHeaderCenter.add(captchaHeaderCenterLabel);
				captchaHeaderCont.add(captchaHeaderCenter);
				captchaHeaderLeft.add(captchaHeaderLeftIcon);
				captchaHeaderCont.add(captchaHeaderLeft);
			wnd.add(captchaHeaderCont);

	        var img = Ti.UI.createImageView({
	            image: captcha_img,
	            width: Ti.UI.SIZE,
	            height: 50,
	            top: 100
	        });
	
			var captchaInputCont = Ti.UI.createView({
				height: 50,
				top: (topCaptchaWindow + 100),
				left: 25,
				right: 25
			});
			
				captchaInputCont.add(Ti.UI.createView({
					width: Ti.UI.FILL,
					height: 1,
					backgroundColor: '#c8c7cc',
					top: 0,
					left: 0,
					zIndex: 10
				}));
		
				captchaInputCont.add(Ti.UI.createView({
					width: Ti.UI.FILL,
					height: 1,
					left: 0,
					backgroundColor: '#c8c7cc',
					bottom: 0,
					zIndex: 10
				}));
	
				var input = Ti.UI.createTextField({
					color: '#555555',
					font: {
						fontFamily: 'Open Sans',
						fontSize: 16,
						fontWeight: 'normal'
					},
					backgroundColor: 'transparent',
					top: 5,
					left: 50,
					width: Ti.UI.FILL,
					height: 40,
					value: '',
					autocapitalization: false,
					keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT,
					returnKeyType: Ti.UI.RETURNKEY_NEXT,
					maxLength: 20
				});
				
				captchaInputCont.add(input);
			wnd.add(captchaInputCont);
        
        var btnOk = Ti.UI.createButton({
            title: L('Ok'),
            width: '45%',
            right: '5%',
            top: 250
        });
        
        wnd.add(img);
        wnd.add(input);
        wnd.add(btnOk);
        
        btnOk.addEventListener('click', function(e) {
            wnd.close();
            params.captcha_sid = captcha_sid;
            params.captcha_key = input.text;
            vk.makeAPICall(method, params);
        });
        
        captchaHeaderLeft.addEventListener('click', function(e) {
        	vk.fireEvent('error', {
        		success: false,
        		error: 'Captcha cancel input'
        	});
            wnd.close();
        });
        
        wnd.open();
    };
    
    vk.logOut = function() {
        vk.token = 0; 	
    };
    
    vk.makeAPICall = function(method, params) {
        if (!vk.token || vk.token.length <= 0) {
            return;
        }

        var client = Ti.Network.createHTTPClient({
            onload: function(e) {
                var res = JSON.parse(client.responseText);

                if (res.hasOwnProperty('error')) {
                    if (res.error.error_code == 14 || res.error.error_code == '14') {
                        // captcha needed
                        vk.remakeAPICallWithCaptcha(method, params, res.error.captcha_sid, res.error.captcha_img);
                    } else {
                        vk.fireEvent('error', {success: false, error: res.error.error_msg});
                    }
                }
                else if (res.hasOwnProperty('response')) {
                    vk.fireEvent('result', {success: true, result: res.response});
                }
                else {
                    vk.fireEvent('result', {success: true, result: res});
            	}
            },
            onerror: function(e) {
                vk.fireEvent('error', {success: false, error: e.error});
            },
            timeout: 5000
        });

        var url = 'https://api.vk.com/method/{0}?access_token={1}' . format(method, vk.token);
        if (!params) params = {};
        client.open('POST', url);
        client.send(params);
        
        return true;
    };
    
    vk.authorize = function() {
        if (!vk.appid || vk.appid.length <= 0) {
            vk.fireEvent('login', {success: false, error: 'Set an application ID before using this method!'});
            return;
        }

        var psum = 0;

        for (var i = vk.permissions.length - 1; i >= 0; i--){
            var p = vk.permissions[i];
            psum += p.code;
        };

        if (psum <= 0) {
            vk.fireEvent('login', {success: false, error: 'Set the permissions before using this method!'});
            return;
        }

        var url = 'https://oauth.vk.com/authorize?client_id=' + vk.appid + '&scope=' + psum + '&redirect_uri=https://oauth.vk.com/blank.html&display=mobile&response_type=token';

        var webView = Ti.UI.createWebView({
            url: url,
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            bottom: 0,
            top: 0,
            hideLoadIndicator: true,
            backgroundColor: 'transparent',
            zIndex: 20
        });

        var wnd = Ti.UI.createWindow({
        	top: 0,
        	left: 0,
        	backgroundColor: 'transparent',
        	fullscreen: true,
        	width: Ti.Platform.displayCaps.platformWidth,
			height: Ti.UI.FILL
        });

        	wnd.add(webView);
        
        webView.addEventListener('load', function(e) {
            var arr = e.url.split('#');

            if (arr[0] === 'https://oauth.vk.com/blank.html') {
                var arr2 = arr[1].split('&');
                var token = null;
                var expires = null;
                var user = null;

                for (var i = 0; i<arr2.length; i++) {
                    var str = arr2[i];
                    if (str.search('access_token') >= 0) {
                        token = str.split('=')[1];
                    } else if(str.search('expires_in') >= 0) {
                        expires = str.split('=')[1];
                    } else if(str.search('user_id') >= 0) {
                        user = str.split('=')[1];
                    }
                }

                if (user && token) {
                    vk.user = user;
                    vk.token = token;
                    vk.authorized = true;
                    vk.fireEvent('login', {success: true});
                }
                else if(!user && !token) {
                    vk.fireEvent('login', {success: false, error: 'User canceled login dialog', cancelled: true});
                }
                else {
                    vk.fireEvent('login', {success: false, error: 'Unknown error!'});
                }

                wnd.close();
            }

            if (e.url.lastIndexOf('https://vk.com/login.php', 0) == 0) {
                vk.fireEvent('login', {
                	success: false,
                	error: 'User canceled login dialog',
                	cancelled: true
                });
                wnd.close();
            }
        });

        webView.addEventListener('error', function(e) {
        	var msg = 'Error: {0} with number: {1}'.format(e.error, e.code);
            vk.fireEvent('login', {
            	success: false,
            	error: msg
            });
            wnd.close();
        });

        wnd.open();
    };
    
    return vk;
}