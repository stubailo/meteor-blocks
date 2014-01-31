shareOnFacebook = function (sceneId) {
  // check if we have facebook access
  if (FB) {

    var data = {
      method: "feed",
      name: "Meteor Blocks",
      link: Meteor.absoluteUrl("#/scene/" + sceneId),
      description: "Meteor Blocks is a simple 3D scene editor."
    };
    
    // Facebook doesn't accept Data URIs, we need to have an actual image link
    var screenshot = Scenes.findOne(sceneId).screenshot;
    if (Utils.screenshotIsLink(screenshot)) {
      data.picture = screenshot;
      FB.ui(data);
    } else {
      // try one more time to upload to Imgur
      Meteor.call("uploadScreenshot",
        Session.get("sceneId"), screenshot, function () {
          if (Utils.screenshotIsLink(screenshot)) {
            data.picture = screenshot;
          } else {
            FB.ui(data);
          }
        });
    }
  }
};