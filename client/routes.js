RouterClass = Backbone.Router.extend({
  routes: {
    "": "home",
    "scene/:_id": "scene"
  },

  home: function () {
    Session.set("sceneId", null);
    Meteor.subscribe("frozenScenes");
  },

  scene: function (sceneId) {
    var self = this;
    Session.set("sceneId", sceneId);

    Meteor.subscribe("scenes", Session.get("sceneId"), function () {
      // when the subscribe completes, check if the ID in the session is
      // a real ID; if it's not reset to the home page
      if (Scenes.findOne(Session.get("sceneId"))) {
        if (! Session.get("mode") && ! Utils.currentScene().frozen) {
          // set default mode
          Session.set("mode", "build");
        }
        Meteor.subscribe("boxes", Session.get("sceneId"));
      } else {
        self.navigate("");
      }
    });
  }
});

Router = new RouterClass();
Backbone.history.start();