Template.home.helpers({
  scenes: function () {
    // all frozen scenes
    return Scenes.find({}, {sort: {createdAt: -1}, limit: 30});
  },
  calendar: function (date) {
    return moment(date).calendar();
  }
});

Template.home.events({
  "click .new-scene": function () {
    Meteor.call("newScene", function (error, newId) {
      Router.navigate("/scene/" + newId, { trigger: true });
    });
  },
  "click .clone": function () {
    Session.set("loading", true);
    Meteor.call("cloneScene", this._id, function (error, newId) {
      if (newId) {
        Router.navigate("/scene/" + newId, { trigger: true });
        Session.set("mode", "build");
      }
    });
  }
});

UI.body.helpers({
  sceneLoaded: function () {
    return !! (Session.get("sceneId") && ! Session.get("loading"));
  },
  loading: function () {
    return !! Session.get("loading");
  },
  buildMode: Utils.buildMode
});

