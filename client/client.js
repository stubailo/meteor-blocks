Boxes = new Meteor.Collection("boxes");

// each color has a list so that we have a little variation
var colors = {
  brown: [
    "#c2892b",
    "#af7c27",
    "#b57813"
  ],
  red: [
    "#e91d45",
    "#e91d22",
    "#e60f3d"
  ],
  green: [
    "#30d02c",
    "#26bf22",
    "#30c12d"
  ],
  blue: [
    "#1d57e9",
    "#194dd1",
    "#1d68d9"
  ]
};

// set initial color
Session.set("color", "brown");

// set initial mode to view
Session.set("tool", "view");

// shark doesn't support events on x3dom yet
shapeClicked = function (event) {
  if (Session.get("tool") === "build") {
    if (event.button === 1) {
      // left click, add box
      var x = Math.floor(event.worldX + event.normalX / 2) + 0.5,
        y = Math.floor(event.worldY + event.normalY / 2) + 0.5,
        z = Math.floor(event.worldZ + event.normalZ / 2) + 0.5;

      Boxes.insert({
        color: Random.choice(colors[Session.get("color")]),
        x: x,
        y: y,
        z: z
      });
    } else if (event.button === 4) {
      // right click, remove box

      Boxes.remove(event.target.id);
    }

    event.stopPropagation();
  }
};

// this uses the Shark branch of Meteor
UI.body.helpers({
  boxes: function () {
    return Boxes.find();
  },
  colors: function () {
    return _.map(_.keys(colors), function (name) {
      return {
        name: name,
        code: colors[name][0]
      };
    });
  },
  currentColor: function () {
    return {
      name: Session.get("color"),
      code: colors[Session.get("color")][0]
    };
  },
  activeColor: function () {
    return this.name === Session.get("color");
  },
  buildMode: function () {
    return Session.equals("tool", "build");
  }
});

UI.body.events({
  "click .clear-boxes": function () {
    Meteor.call("clearBoxes");
  },
  "click .swatch": function () {
    console.log(this);
    Session.set("color", this.name);
  },
  "click button.view-mode": function (event, template) {
    Session.set("tool", "view");
    template.find("x3d").runtime.turnTable();
  },
  "click button.build-mode": function (event, template) {
    Session.set("tool", "build");
    template.find("x3d").runtime.noNav();
  }
});
