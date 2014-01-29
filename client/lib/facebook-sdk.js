$(function () {
  if (Config.facebookAppId) {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_UK/all.js', function() {
      FB.init({
        appId: Config.facebookAppId,
        logging: false,
        status: false
      });
    });
  }
});