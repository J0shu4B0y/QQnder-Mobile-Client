// UXCam Sample

var win = Ti.UI.createWindow({
	backgroundColor : 'white'
});
var label = Ti.UI.createLabel();
label.setText("Get your account key from https://www.uxcam.com");
win.add(label);
win.open();

// on app.js add the following:
var UXCam = require('com.uxcam');

/**
 * Starts UXCam session tracking
 *
 * For UXCam account key register at uxcam.com or use demo account key (aca49724f616c4b) and
 * view your data on demo account at uxcam.com with credentials given below
 * email     : android-demo@uxcam.com
 * password  : androiddemo
 * * */
UXCam.startWithKey("UXCAM_ACCOUNT_KEY");

// Use of Optional API's
UXCam.tagScreenName("LoginScreen");
UXCam.tagUsersName("TestUser");
UXCam.markUserAsFavorite();