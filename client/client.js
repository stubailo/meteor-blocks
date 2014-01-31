Session.set("color", "#c2892b");

UI.body.helpers({
  boxes: function () {
    return Boxes.find();
  },
  colors: function () {
    return ["#c2892b", "#e91d45", "#30d02c", "#1d57e9", "#9414c9", "#fee619"];
  },
  activeColor: function () {
    return this.valueOf() === Session.get("color");
  }
});

var lastMousePosition;
var mouseMoved = function (event) {
  return Math.abs(event.layerX - lastMousePosition.x) > 5 ||
    Math.abs(event.layerY - lastMousePosition.y) > 5;
};

// events on the dialog with lots of buttons
UI.body.events({
  "click .clear-boxes": function () {
    Meteor.call("clearBoxes");
  },
  "click .swatch": function () {
    Session.set("color", this.valueOf());
  },
  "mousedown x3d": function (event) {
    if (event.layerX) {
      lastMousePosition = {
        x: event.layerX,
        y: event.layerY
      };
    }
  },
  "mouseup shape": function (event) {
    if (! mouseMoved(event) && event.button === 1) {
      // calculate new box position from event
      Boxes.insert({
        color: Session.get("color"),
        x: Math.floor(event.worldX + event.normalX / 2) + 0.5,
        y: Math.floor(event.worldY + event.normalY / 2) + 0.5,
        z: Math.floor(event.worldZ + event.normalZ / 2) + 0.5
      });
    } else if (! mouseMoved(event) &&
      (event.button === 4 || event.button === 2)) {
      // right click to remove box
      Boxes.remove(event.currentTarget.id);
    }
  }
});
