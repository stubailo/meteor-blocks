// colors from https://github.com/mrmrs/colors/blob/master/less/_variables.less
var colors = {
  // Cool
  aqua: "#7FDBFF",
  blue: "#0074D9",
  navy: "#001F3F",
  teal: "#39CCCC",
  green: "#2ECC40",
  olive: "#3D9970",
  lime:  "#01FF70",

  // Warm
  yellow:  "#FFDC00",
  orange:  "#FF851B",
  red:     "#FF4136",
  fuchsia: "#F012BE",
  purple:  "#B10DC9",
  maroon:  "#85144B",

  // Gray Scale
  white:  "#fff",
  silver: "#ddd",
  gray:   "#aaa",
  black:  "#111",

  // Browns (for natural scenes)
  brown1: "#A64300",
  brown2: "#BF6A30",
  brown3: "#A66A00"
};

Template.controls.helpers({
  frozen: Utils.frozen,
  sceneId: function () {
    return Session.get("sceneId");
  },
  sceneUrl: function () {
    return Utils.linkToScene(Session.get("sceneId"));
  },
  createdAt: function () {
    return Utils.currentScene() && moment(Utils.currentScene().createdAt).calendar();
  },
  // list of colors for color picker
  colors: function () {
    return _.map(_.keys(colors), function (name) {
      return {
        name: name,
        code: colors[name]
      };
    });
  },
  // active color helper for color picker
  activeColor: function () {
    return this.name === Session.get("color");
  },
  // see if we are in build mode
  buildMode: Utils.buildMode,
  screenshot: function () {
    return Utils.currentScene().screenshot;
  },
  showFacebookButton: function () {
    // check for Facebook API
    return !! FB;
  }
});

// events on the dialog with lots of buttons
Template.controls.events({
  "click .clear-boxes": function () {
    Meteor.call("clearBoxes", Session.get("sceneId"));
  },
  "click .swatch": function () {
    Session.set("color", this.name);
  },
  "click button.view-mode": function () {
    Session.set("mode", "view");
  },
  "click button.build-mode": function () {
    Session.set("mode", "build");
  },
  "click button.freeze": function () {
    Meteor.call("freezeScene", Session.get("sceneId"), Utils.getScreenshot(),
      function (error) {
        if (! error) {
          Session.set("mode", "view");
        }
      });
  },
  "click button.clone": function () {
    Meteor.call("cloneScene", Session.get("sceneId"), function (error, newId) {
      if (newId) {
        Router.navigate("/scene/" + newId, { trigger: true });
        Session.set("mode", "build");
      }
    });
  },
  "click .facebook": function () {
    // check if we have facebook access
    if (FB) {
      var data = {
        method: "feed",
        name: "Meteor Blocks",
        link: Meteor.absoluteUrl("#/scene/" + Session.get("sceneId")),
        description: "Meteor Blocks is a simple 3D scene editor."
      };
      
      // don't send image if it's a Data URI
      var screenshot = Utils.currentScene().screenshot;
      if (screenshot.substring(0, 4) === "http") {
        data.picture = screenshot;
      }

      FB.ui(data);
    }
  }
});

Template.scene.helpers({
  // all boxes that were published
  boxes: function () {
    return Boxes.find({"sceneId": Session.get("sceneId")});
  }
});

// method stub for faster performance on the frontend
Meteor.methods({
  addBoxToScene: function (sceneId, box) {
    box.sceneId = sceneId;
    Boxes.insert(box);
  },
  removeBoxFromScene: function (sceneId, boxId) {
    Boxes.remove(boxId);
  },
  freezeScene: function (sceneId, screenshot) {
    Scenes.update(
      { _id: sceneId },
      { $set:
        {
          frozen: true,
          screenshot: screenshot
        }
      }
    );
  }
});

Template.scene.events({
  "mousedown shape": function (event) {
    if (Utils.buildMode()) {
      if (event.button === 1) {
        // left click to add box

        // calculate new box position based on location of click event
        // in 3d space and the normal of the surface that was clicked
        var x = Math.floor(event.worldX + event.normalX / 2) + 0.5,
          y = Math.floor(event.worldY + event.normalY / 2) + 0.5,
          z = Math.floor(event.worldZ + event.normalZ / 2) + 0.5;

        if (! colors.hasOwnProperty(Session.get("color"))) {
          Session.set("color", _.keys(colors)[0]);
        }

        var box = {
          color: colors[Session.get("color")],
          x: x,
          y: y,
          z: z
        };

        Meteor.call("addBoxToScene", Session.get("sceneId"), box);
      } else if (event.button === 4 || event.button === 2) {
        // right click to remove box
        Meteor.call("removeBoxFromScene",
          Session.get("sceneId"), event.currentTarget.id);
      }
    }
  }
});