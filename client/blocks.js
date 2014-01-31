Session.set("color", "#c2892b");

UI.body.helpers({
  boxes: function () {
    return Boxes.find();
  },
  activeColor: function () {
    return this.valueOf() === Session.get("color");
  },
  colors: ["#c2892b", "#e91d45", "#30d02c",
           "#1d57e9", "#9414c9", "#fee619"]
});

var dragged = false;

UI.body.events({
  "click .swatch": function () {
    Session.set("color", this.valueOf());
  },
  "mousedown x3d": function () {
    dragged = false; // reset to see if we started dragging
  },
  "mousemove x3d": function () {
    dragged = true; // if mouse moves after mousedown it's a drag
  },
  "mouseup shape": function (event) {
    // don't insert or remove block if we are dragging
    if (!dragged && event.button === 1) {

      // insert box when left mouse button is clicked
      Boxes.insert({
        color: Session.get("color"),
        // use the normal pointing out from the face we clicked
        // to calculate the center of the new box
        x: Math.floor(event.worldX + event.normalX / 2) + 0.5,
        y: Math.floor(event.worldY + event.normalY / 2) + 0.5,
        z: Math.floor(event.worldZ + event.normalZ / 2) + 0.5
      });

    } else if (!dragged &&
      (event.button === 4 || event.button === 2)) {
        // remove box when right mouse button is clicked
        Boxes.remove(event.currentTarget.id);
    }
  }
});