var triggerGoogleAnalytics = function () {
  if (window.ga) {
    ga('send', 'pageview', window.location.origin + window.location.hash);
  }
};

var RouterClass = Backbone.Router.extend({
  routes: {
    "": "home",
    "scene/:_id": "scene"
  },

  home: function () {
    triggerGoogleAnalytics();
    Session.set("sceneId", null);
    Meteor.subscribe("frozenScenes");
  },

  scene: function (sceneId) {
    triggerGoogleAnalytics();
    var self = this;

    Session.set("loading", true);

    // XXX this method can cause inconsistency between Session and subscription
    // status
    Meteor.subscribe("scenes", sceneId, function () {
      // when the subscribe completes, check if the ID in the session is
      // a real ID; if it's not reset to the home page
      if (Scenes.findOne(sceneId)) {
        // we did good, set the ID in the session
        if (! Session.get("mode") && ! Utils.currentScene().frozen) {
          // set default mode
          Session.set("mode", "build");
        }
        Meteor.subscribe("boxes", sceneId, function () {
          Session.set("sceneId", sceneId);
          Session.set("loading", false);
        });
      } else {
        self.navigate("");
      }
    });
  }
});

Router = new RouterClass();
Backbone.history.start();