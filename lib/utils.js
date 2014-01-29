Utils = {
  frozen: function () {
    return Utils.currentScene() && Utils.currentScene().frozen;
  },
  buildMode: function () {
    return (! Utils.frozen()) && Session.equals("mode", "build");
  },
  currentScene: function () {
    return Scenes.findOne(Session.get("sceneId")) || {};
  },
  getScreenshot: function () {
    return $("x3d")[0].runtime.getScreenshot();
  },
  linkToScene: function (sceneId) {
    return Meteor.absoluteUrl("#/scene/" + sceneId);
  },
  screenshotIsLink: function (screenshot) {
    return screenshot.substring(0, 4) === "http";
  }
};